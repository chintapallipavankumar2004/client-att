import { authenticateAdminWithPassword, beginAdminSession, recordAuditLog, SessionError } from '../_lib/session';
import { getRequestIp, getRequestUserAgent, readJsonBody, sendJson } from '../_lib/http';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { message: 'Method not allowed.' });
    return;
  }

  try {
    const body = await readJsonBody<{
      email?: string;
      password?: string;
      rememberMe?: boolean;
    }>(req);

    const email = body.email?.trim().toLowerCase() || '';
    const password = body.password || '';
    const rememberMe = Boolean(body.rememberMe);

    if (!email || !password || password.length < 8 || !email.includes('@')) {
      sendJson(res, 400, { message: 'Enter a valid admin email and password.' });
      return;
    }

    const adminUser = await authenticateAdminWithPassword(email, password);
    const session = await beginAdminSession(req, {
      ...adminUser,
      rememberMe,
    });

    await recordAuditLog({
      action: 'admin_login_success',
      uid: adminUser.uid,
      email: adminUser.email,
      role: adminUser.role,
      ip: getRequestIp(req),
      userAgent: getRequestUserAgent(req),
    });

    sendJson(
      res,
      200,
      {
        message: 'Signed in successfully.',
        admin: session.admin,
      },
      {
        'Set-Cookie': session.cookie,
      },
    );
  } catch (error) {
    if (error instanceof SessionError) {
      await recordAuditLog({
        action: 'admin_login_failed',
        email: req.body?.email || null,
        ip: getRequestIp(req),
        userAgent: getRequestUserAgent(req),
        metadata: {
          reason: error.message,
        },
      });

      sendJson(res, error.status, { message: error.message });
      return;
    }

    console.error('Admin login failed', error);
    sendJson(res, 500, { message: 'Unable to sign in right now.' });
  }
}
