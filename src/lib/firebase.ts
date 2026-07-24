import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { DEVELOPMENT_ADMIN_MODE } from '../shared/adminMode';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// DEVELOPMENT ONLY — do not initialize Firebase Authentication for the CMS demo.
export const auth = DEVELOPMENT_ADMIN_MODE ? null : getAuth(app);
export const googleProvider = DEVELOPMENT_ADMIN_MODE ? null : new GoogleAuthProvider();

// Test Firestore connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

testConnection();
