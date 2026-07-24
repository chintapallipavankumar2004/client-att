function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  firebaseProjectId: requireEnv('FIREBASE_PROJECT_ID'),
  firebaseClientEmail: requireEnv('FIREBASE_CLIENT_EMAIL'),
  firebasePrivateKey: requireEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
  firebaseWebApiKey: requireEnv('FIREBASE_WEB_API_KEY'),
  adminSessionSecret: requireEnv('ADMIN_SESSION_SECRET'),
  nodeEnv: process.env.NODE_ENV || 'development',
};
