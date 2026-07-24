# Secure admin deployment

## Required Vercel environment variables

Add these values to **Production**, **Preview**, and local development as appropriate:

- `FIREBASE_PROJECT_ID` — Firebase project ID.
- `FIREBASE_CLIENT_EMAIL` — service-account client email.
- `FIREBASE_PRIVATE_KEY` — service-account private key. Store it as one value with escaped `\n` line breaks.
- `FIREBASE_WEB_API_KEY` — the Firebase Web API key from Project settings.
- `ADMIN_SESSION_SECRET` — a new random secret of at least 32 bytes. Generate one with `openssl rand -base64 48`.

No Firebase Admin credential or session secret may be exposed with a `VITE_` prefix.

## Create the first Super Admin

1. In Firebase Console, enable **Authentication → Sign-in method → Email/Password**.
2. Create the administrator in **Authentication → Users**, using a long unique password.
3. From a trusted local Admin SDK script or Cloud Function, set the user custom claims:

   ```ts
   await getAuth().setCustomUserClaims('<FIREBASE_UID>', {
     admin: true,
     role: 'super_admin',
   });
   ```

4. Create `admins/<FIREBASE_UID>` in Firestore with at least `{ email, name, role: 'super_admin', status: 'active' }`.
5. Sign in at `/admin/login`. The first successful sign-in completes the audit/session profile fields automatically.

Never place a default password or an administrator email in frontend source code or environment files committed to Git.

## Firestore rules

Deploy the included rule file after custom claims are configured:

```bash
firebase deploy --only firestore:rules
```

CMS collection writes are restricted to Firebase users with `request.auth.token.admin == true`. Orders, customers and reviews are served through server APIs; direct client access is denied except for the public storefront reads that the application requires.

## Vercel deployment

1. Import the repository into Vercel and set all required environment variables.
2. Deploy. `vercel.json` keeps Vite SPA URLs working, while `middleware.ts` redirects unauthenticated `/admin/*` requests to `/admin/login` before the app is served.
3. Confirm Firebase Authentication's authorized domains include the Vercel production domain and any custom domain.
4. Test an incognito session: `/admin/dashboard` must redirect to `/admin/login`; sign in must enter the dashboard; sign out must return to login and invalidate the server-side session.

## Before production

- Configure a Firebase App Check / CAPTCHA strategy for public order and review endpoints if the site is exposed broadly.
- Add a transactional payment provider and calculate final prices server-side before accepting paid orders.
- Set up monitoring/alerts for failed admin logins and serverless API errors.
