import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}.`);
  }

  return value;
}

async function bootstrap() {
  const projectId = required('FIREBASE_PROJECT_ID');
  const clientEmail = required('FIREBASE_CLIENT_EMAIL');
  const privateKey = required('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n');
  const email = required('SUPER_ADMIN_EMAIL').toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const name = process.env.SUPER_ADMIN_NAME?.trim() || 'Super Admin';

  const app =
    getApps()[0] ||
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
  const auth = getAuth(app);
  const db = getFirestore(app);

  let user;
  try {
    user = await auth.getUserByEmail(email);
  } catch (error: any) {
    if (error?.code !== 'auth/user-not-found') {
      throw error;
    }

    if (!password || password.length < 12) {
      throw new Error('Set SUPER_ADMIN_PASSWORD to a unique password of at least 12 characters to create this user.');
    }

    user = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: true,
    });
  }

  await auth.setCustomUserClaims(user.uid, {
    admin: true,
    role: 'super_admin',
  });

  const now = new Date().toISOString();
  await db.collection('admins').doc(user.uid).set(
    {
      id: user.uid,
      email,
      name,
      role: 'super_admin',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    { merge: true },
  );

  console.log(`Super Admin ready: ${email} (${user.uid})`);
}

bootstrap().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
