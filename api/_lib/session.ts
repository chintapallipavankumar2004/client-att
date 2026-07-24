import { randomUUID } from 'crypto';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import type { AdminPermission, AdminRole } from '../../src/shared/adminAccess.js';
import { ROLE_PERMISSIONS, hasAdminPermission } from '../../src/shared/adminAccess.js';
import type { AdminSessionUser } from '../../src/types.js';
import { adminAuth, adminDb } from './firebaseAdmin.js';
import { env } from './env.js';
import { getRequestIp, getRequestUserAgent } from './http.js';
import { DEVELOPMENT_ADMIN_MODE } from '../../src/shared/adminMode.js';

const SESSION_COOKIE_NAME = '__Host-att_admin_session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12;
const REMEMBER_ME_DURATION_MS = 1000 * 60 * 60 * 24 * 7;
const MAX_LOGIN_ATTEMPTS = 5;
const ACCOUNT_LOCK_MS = 1000 * 60 * 15;

const secret = new TextEncoder().encode(env.adminSessionSecret);

const DEVELOPMENT_ADMIN_USER: AdminSessionUser = {
  uid: 'development-admin',
  email: 'demo-admin@local.invalid',
  name: 'Development Demo Admin',
  role: 'super_admin',
  permissions: ROLE_PERMISSIONS.super_admin,
  expiresAt: Number.MAX_SAFE_INTEGER,
  rememberMe: false,
  lastLogin: null,
};

interface AdminSessionTokenPayload extends JWTPayload {
  uid: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: AdminPermission[];
  rememberMe: boolean;
  sessionId: string;
  lastLogin?: string | null;
}

export class SessionError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.name = 'SessionError';
    this.status = status;
  }
}

type AdminAuthorizationFailure =
  | 'firebase_user_missing'
  | 'uid_mismatch'
  | 'custom_claims_missing'
  | 'custom_role_invalid'
  | 'admin_profile_missing'
  | 'profile_email_mismatch'
  | 'profile_role_mismatch'
  | 'admin_profile_inactive';

function logAdminAuthorization(event: string, details: Record<string, unknown>) {
  // Never include passwords, ID tokens, session tokens, or Firebase credentials in logs.
  console.info('[admin-auth]', JSON.stringify({ event, ...details }));
}

function rejectAdminAuthorization(
  reason: AdminAuthorizationFailure,
  details: Record<string, unknown>,
): never {
  logAdminAuthorization('login_authorization_denied', { reason, ...details });
  throw new SessionError('You are not authorized to access this admin panel.', 403);
}

function parseCookies(cookieHeader?: string) {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(';').reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.trim().split('=');
    if (!key) {
      return acc;
    }

    acc[key] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function getSessionCookie(req: any) {
  const cookieHeader = typeof req.headers.cookie === 'string' ? req.headers.cookie : undefined;
  const cookies = parseCookies(cookieHeader);
  return cookies[SESSION_COOKIE_NAME];
}

export function buildSessionCookie(token: string, rememberMe: boolean) {
  const base = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Secure',
  ];

  if (rememberMe) {
    base.push(`Max-Age=${Math.floor(REMEMBER_ME_DURATION_MS / 1000)}`);
  }

  return base.join('; ');
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=0`;
}

function toAdminSessionUser(payload: AdminSessionTokenPayload, expiresAt: number): AdminSessionUser {
  return {
    uid: payload.uid,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    permissions: payload.permissions,
    expiresAt,
    rememberMe: payload.rememberMe,
    lastLogin: payload.lastLogin ?? null,
  };
}

export async function createSignedSession(user: {
  uid: string;
  email: string;
  name: string;
  role: AdminRole;
  rememberMe: boolean;
  lastLogin?: string | null;
}) {
  const sessionId = randomUUID();
  const permissions = ROLE_PERMISSIONS[user.role];
  const expiresAt = Date.now() + (user.rememberMe ? REMEMBER_ME_DURATION_MS : SESSION_DURATION_MS);
  const payload: AdminSessionTokenPayload = {
    uid: user.uid,
    email: user.email,
    name: user.name,
    role: user.role,
    permissions,
    rememberMe: user.rememberMe,
    sessionId,
    lastLogin: user.lastLogin,
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt / 1000))
    .sign(secret);

  return {
    token,
    sessionId,
    expiresAt,
    permissions,
  };
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret);

  const exp = typeof payload.exp === 'number' ? payload.exp * 1000 : Date.now();
  return {
    payload: payload as unknown as AdminSessionTokenPayload,
    expiresAt: exp,
  };
}

async function getAdminProfile(uid: string) {
  const docRef = adminDb.collection('admins').doc(uid);
  const snapshot = await docRef.get();
  if (!snapshot.exists) {
    return { docRef, profile: null };
  }

  return {
    docRef,
    profile: snapshot.data() as Record<string, any>,
  };
}

export async function recordAuditLog(entry: {
  action: string;
  uid?: string | null;
  email?: string | null;
  role?: AdminRole | null;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}) {
  await adminDb.collection('auditLogs').add({
    ...entry,
    createdAt: new Date().toISOString(),
  });
}

export async function getAdminSession(req: any, permission?: AdminPermission) {
  // DEVELOPMENT ONLY — bypass cookie, JWT and Firebase Auth checks for CMS demos.
  if (DEVELOPMENT_ADMIN_MODE) {
    if (permission && !hasAdminPermission(DEVELOPMENT_ADMIN_USER.role, permission)) {
      throw new SessionError('You do not have permission to access this resource.', 403);
    }

    return {
      admin: DEVELOPMENT_ADMIN_USER,
      sessionId: 'development-session',
      profileRef: null,
      profile: {},
    };
  }

  const token = getSessionCookie(req);
  if (!token) {
    logAdminAuthorization('session_missing', { permission: permission || null });
    return null;
  }

  try {
    const { payload, expiresAt } = await verifySessionToken(token);
    const { docRef, profile } = await getAdminProfile(payload.uid);

    if (!profile || profile.status !== 'active') {
      logAdminAuthorization('session_denied', {
        reason: !profile ? 'admin_profile_missing' : 'admin_profile_inactive',
        uid: payload.uid,
        permission: permission || null,
      });
      throw new SessionError('Admin account is inactive.');
    }

    if (!profile.currentSessionId || profile.currentSessionId !== payload.sessionId) {
      logAdminAuthorization('session_denied', {
        reason: 'session_id_mismatch',
        uid: payload.uid,
        permission: permission || null,
      });
      throw new SessionError('Session is no longer valid.');
    }

    const role = (profile.role || payload.role) as AdminRole;
    if (permission && !hasAdminPermission(role, permission)) {
      logAdminAuthorization('session_denied', {
        reason: 'permission_denied',
        uid: payload.uid,
        role,
        permission,
      });
      throw new SessionError('You do not have permission to access this resource.', 403);
    }

    const sessionUser = toAdminSessionUser(
      {
        ...payload,
        role,
        permissions: ROLE_PERMISSIONS[role],
        lastLogin: profile.lastLogin || payload.lastLogin || null,
      },
      expiresAt,
    );

    return {
      admin: sessionUser,
      sessionId: payload.sessionId,
      profileRef: docRef,
      profile,
    };
  } catch (error) {
    if (error instanceof SessionError) {
      throw error;
    }

    logAdminAuthorization('session_denied', {
      reason: 'token_invalid_or_expired',
      permission: permission || null,
    });
    return null;
  }
}

export async function requireAdminSession(req: any, permission?: AdminPermission) {
  const session = await getAdminSession(req, permission);
  if (!session) {
    throw new SessionError('Please sign in to continue.', 401);
  }

  if (permission && !hasAdminPermission(session.admin.role, permission)) {
    throw new SessionError('You do not have permission to access this resource.', 403);
  }

  return session;
}

export async function authenticateAdminWithPassword(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  let userRecord: any = null;

  try {
    userRecord = await adminAuth.getUserByEmail(normalizedEmail);
  } catch (error: any) {
    logAdminAuthorization('firebase_user_lookup_failed', {
      email: normalizedEmail,
      code: error?.code || 'unknown',
    });
    userRecord = null;
  }

  let profileRef = adminDb.collection('admins').doc(userRecord?.uid || randomUUID());
  let profile = null as Record<string, any> | null;

  if (userRecord) {
    const profileResult = await getAdminProfile(userRecord.uid);
    profileRef = profileResult.docRef;
    profile = profileResult.profile;
  }

  if (profile?.accountLockedUntil && Date.parse(profile.accountLockedUntil) > Date.now()) {
    throw new SessionError('Too many login attempts. Please try again later.', 429);
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.firebaseWebApiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password,
        returnSecureToken: true,
      }),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    if (userRecord && profileRef) {
      const attempts = Number(profile?.loginAttempts || 0) + 1;
      const locked = attempts >= MAX_LOGIN_ATTEMPTS;
      await profileRef.set(
        {
          email: normalizedEmail,
          loginAttempts: locked ? 0 : attempts,
          accountLockedUntil: locked ? new Date(Date.now() + ACCOUNT_LOCK_MS).toISOString() : null,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );
    }

    throw new SessionError('Invalid email or password.', 401);
  }

  const decoded = await adminAuth.verifyIdToken(data.idToken);
  const authenticatedUser = await adminAuth.getUser(decoded.uid);
  const authenticatedEmail = authenticatedUser.email?.trim().toLowerCase() || '';
  let authenticatedProfileResult: Awaited<ReturnType<typeof getAdminProfile>>;
  try {
    authenticatedProfileResult = await getAdminProfile(decoded.uid);
  } catch (error: any) {
    logAdminAuthorization('admin_profile_lookup_failed', {
      uid: decoded.uid,
      email: normalizedEmail,
      code: error?.code || 'unknown',
    });
    throw error;
  }
  const { docRef: authenticatedProfileRef, profile: authenticatedProfile } = authenticatedProfileResult;
  const claims = authenticatedUser.customClaims || {};
  const claimRole = claims.role as AdminRole | undefined;
  const profileRole = authenticatedProfile?.role as AdminRole | undefined;
  const profileEmail = authenticatedProfile?.email?.trim().toLowerCase() || '';
  const diagnostic = {
    uid: decoded.uid,
    email: normalizedEmail,
    firebaseEmail: authenticatedEmail || null,
    lookupUid: userRecord?.uid || null,
    profileExists: Boolean(authenticatedProfile),
    profileStatus: authenticatedProfile?.status || null,
    claimAdmin: claims.admin === true,
    claimRole: claimRole || null,
    profileRole: profileRole || null,
  };

  if (!userRecord) {
    rejectAdminAuthorization('firebase_user_missing', diagnostic);
  }
  if (userRecord.uid !== decoded.uid || authenticatedUser.uid !== decoded.uid) {
    rejectAdminAuthorization('uid_mismatch', diagnostic);
  }
  if (claims.admin !== true) {
    rejectAdminAuthorization('custom_claims_missing', diagnostic);
  }
  if (!claimRole || !ROLE_PERMISSIONS[claimRole]) {
    rejectAdminAuthorization('custom_role_invalid', diagnostic);
  }
  if (!authenticatedProfile) {
    rejectAdminAuthorization('admin_profile_missing', diagnostic);
  }
  if (authenticatedEmail !== normalizedEmail || profileEmail !== normalizedEmail) {
    rejectAdminAuthorization('profile_email_mismatch', diagnostic);
  }
  if (profileRole !== claimRole) {
    rejectAdminAuthorization('profile_role_mismatch', diagnostic);
  }
  if (authenticatedProfile.status !== 'active') {
    rejectAdminAuthorization('admin_profile_inactive', diagnostic);
  }

  const role = claimRole;
  profileRef = authenticatedProfileRef;
  profile = authenticatedProfile;

  logAdminAuthorization('login_authorization_granted', { ...diagnostic, role });

  const now = new Date().toISOString();
  const name = authenticatedUser.displayName || authenticatedProfile.name || normalizedEmail;

  await profileRef.set(
    {
      id: decoded.uid,
      name,
      email: normalizedEmail,
      role,
      status: authenticatedProfile.status,
      loginAttempts: 0,
      accountLockedUntil: null,
      lastLogin: now,
      updatedAt: now,
      createdAt: profile?.createdAt || now,
    },
    { merge: true },
  );

  return {
    uid: decoded.uid,
    email: normalizedEmail,
    name,
    role,
    lastLogin: now,
  };
}

export async function beginAdminSession(req: any, adminUser: { uid: string; email: string; name: string; role: AdminRole; rememberMe: boolean; lastLogin?: string | null }) {
  const session = await createSignedSession(adminUser);
  await adminDb.collection('admins').doc(adminUser.uid).set(
    {
      currentSessionId: session.sessionId,
      currentSessionExpiresAt: new Date(session.expiresAt).toISOString(),
      lastLoginIp: getRequestIp(req),
      lastUserAgent: getRequestUserAgent(req),
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );

  return {
    cookie: buildSessionCookie(session.token, adminUser.rememberMe),
    admin: {
      uid: adminUser.uid,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
      permissions: session.permissions,
      expiresAt: session.expiresAt,
      rememberMe: adminUser.rememberMe,
      lastLogin: adminUser.lastLogin || null,
    } satisfies AdminSessionUser,
  };
}

export async function endAdminSession(req: any) {
  if (DEVELOPMENT_ADMIN_MODE) {
    return;
  }

  const session = await getAdminSession(req);
  if (!session) {
    return;
  }

  await session.profileRef.set(
    {
      currentSessionId: null,
      currentSessionExpiresAt: null,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}
