import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { env } from './env';

const adminApp =
  getApps()[0] ||
  initializeApp({
    credential: cert({
      projectId: env.firebaseProjectId,
      clientEmail: env.firebaseClientEmail,
      privateKey: env.firebasePrivateKey,
    }),
    projectId: env.firebaseProjectId,
  });

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
