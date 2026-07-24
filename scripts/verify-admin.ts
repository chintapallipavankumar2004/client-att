import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import { getScriptFirebaseAdminApp } from './firebaseAdmin.js';

dotenv.config({ path: '.env.local' });

const email = (process.argv[2] || process.env.SUPER_ADMIN_EMAIL || '').trim().toLowerCase();

async function verifyAdmin() {
  if (!email) {
    throw new Error('Provide an email: npm.cmd run verify:admin -- admin@example.com');
  }

  const app = getScriptFirebaseAdminApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const user = await auth.getUserByEmail(email);
  const profileSnapshot = await db.collection('admins').doc(user.uid).get();
  const profile = profileSnapshot.data();
  const claims = user.customClaims || {};
  const report = {
    email,
    uid: user.uid,
    firebaseUserExists: true,
    disabled: user.disabled,
    claims: {
      admin: claims.admin === true,
      role: claims.role || null,
    },
    adminProfile: {
      exists: profileSnapshot.exists,
      uidMatchesDocumentPath: profileSnapshot.ref.id === user.uid,
      emailMatches: profile?.email?.trim().toLowerCase() === email,
      role: profile?.role || null,
      roleMatchesClaims: profile?.role === claims.role,
      status: profile?.status || null,
      active: profile?.status === 'active',
    },
  };

  console.log(JSON.stringify(report, null, 2));

  if (
    user.disabled ||
    claims.admin !== true ||
    claims.role !== 'super_admin' ||
    !profileSnapshot.exists ||
    profile?.email?.trim().toLowerCase() !== email ||
    profile?.role !== 'super_admin' ||
    profile?.status !== 'active'
  ) {
    process.exitCode = 1;
  }
}

verifyAdmin().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
