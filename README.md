# Shortly

Shortly is a polished single-file URL-shortener frontend built with HTML, CSS, vanilla JavaScript ES modules, Firebase Authentication, and Firebase Realtime Database.

## Included files

- `index.html` — complete responsive landing page, authentication modal, dashboard, analytics view, account settings, legal pages, and `/s/{alias}` development redirect resolver.
- `database.rules.json` — UID-scoped Realtime Database rules with server-stored plan protection, alias ownership, reserved aliases, indexes, and default deny behavior.
- `firebase.json` — Firebase Hosting rewrites, caching, CSP, and security headers.

## Important production architecture note

A single static HTML file cannot securely deliver the complete production architecture described in the original brief. In particular, static Firebase Hosting cannot independently resolve unlimited wildcard subdomains such as `https://alias.shortly.app`.

For a real production deployment:

1. Keep Firebase Hosting for the application.
2. Use Firebase Authentication for accounts.
3. Move link creation, editing, deletion, plan checks, rate limiting, blocked-domain checks, analytics writes, and redirect resolution into Firebase Cloud Functions using Admin SDK.
4. Route `*.shortly.app` through a Cloudflare Worker.
5. Make the Worker call the trusted `resolveShortLink` function and return its 302/307 response.
6. Do not allow public browser writes to analytics in the production rules.

The current single-file build is suitable as a working Firebase demo/MVP and UI foundation. The path fallback is implemented as `/s/{alias}`.

## Firebase configuration

The supplied Firebase web configuration is already present in `index.html`. Firebase client configuration is public by design. Never commit Firebase Admin SDK service-account JSON, private keys, payment secrets, or privileged server credentials.

Confirm the Realtime Database URL in Firebase Console. The current code uses:

```text
https://chatapp-70e6e-default-rtdb.firebaseio.com
```

Replace it in `index.html` if your database was created in a different region or uses a different URL.

## Firebase Console setup

1. Open Firebase Console and select `chatapp-70e6e`.
2. Open **Authentication → Sign-in method**.
3. Enable **Email/Password**.
4. Enable **Google** and choose the support email.
5. Enable **Anonymous** so guest-created links remain attached to an anonymous UID.
6. Add your Firebase Hosting domain and final custom domain under Authentication authorized domains.
7. Open **Realtime Database** and create a database.
8. Open **Rules**, paste `database.rules.json`, and publish.
9. Do not use test mode rules.

## Run locally

ES modules must be served through HTTP rather than opened directly as a `file://` page.

```bash
python -m http.server 5500
```

Open:

```text
http://localhost:5500
```

For the development redirect fallback:

```text
http://localhost:5500/s/example-alias
```

A local static server may require SPA fallback configuration for direct `/s/...` navigation. Firebase Hosting provides the required rewrite through `firebase.json`.

## Deploy to Firebase Hosting

Install and authenticate the Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
```

Choose project `chatapp-70e6e`, then deploy:

```bash
firebase deploy --only database,hosting
```

## Set a test user to Premium

The browser is intentionally unable to upgrade its own plan. Use a trusted admin environment.

### Firebase Console method

1. Sign in once with the test account.
2. Copy its UID from **Authentication → Users**.
3. In Realtime Database, open `users/{uid}/plan`.
4. Change the value from `free` to `premium`.
5. Refresh the application.

Only trusted project administrators should perform this operation.

### Admin SDK example

Run this only on a trusted machine or server with Admin credentials:

```js
import admin from "firebase-admin";

admin.initializeApp();
await admin.database().ref(`users/${uid}/plan`).set("premium");
```

Never place Admin credentials in `index.html`.

## Custom domain and wildcard DNS

For the root application, connect `shortly.app` to Firebase Hosting according to the domain verification records supplied by Firebase.

For wildcard short links:

1. Put the domain behind Cloudflare DNS.
2. Add a proxied wildcard DNS record for `*.shortly.app`.
3. Deploy a Cloudflare Worker route for `*.shortly.app/*`.
4. Extract and normalize the first hostname label in the Worker.
5. Forward the alias to a Firebase HTTPS Function.
6. Return only the trusted redirect response or the branded unavailable-link page.

Do not point wildcard traffic directly at static Firebase Hosting and claim that dynamic aliases are securely resolved.

## Security checklist

- Email/password, Google, and anonymous authentication enabled.
- User plan is stored in `users/{uid}/plan` and cannot be modified by that user.
- Custom aliases require `premium` or `admin` in database rules.
- Alias claims use Realtime Database transactions.
- Unsupported protocols, credentials, localhost, private ranges, and redirect loops are rejected client-side.
- Production Cloud Functions must repeat every validation server-side.
- Unknown database roots are denied by default.
- Admin credentials and service-account keys are absent from frontend code.
- CSP, referrer policy, permissions policy, frame protection, and no-sniff headers are configured.
- Detailed analytics should be written only by trusted backend infrastructure in production.
- Add App Check, backend rate limiting, abuse monitoring, and an automated analytics-retention job before public launch.

## Testing checklist

- Register with email and password.
- Log in and sign out.
- Sign in with Google.
- Create a guest link, then link the anonymous account during registration.
- Reject `javascript:`, `data:`, `file:`, `ftp:`, and malformed URLs.
- Reject embedded credentials, localhost, private IP ranges, and Shortly destinations.
- Confirm free users cannot enable the custom-alias input.
- Change a test plan to Premium and create a valid custom alias.
- Attempt a duplicate alias from another account.
- Copy and open a short link.
- Disable and re-enable a link.
- Edit a destination.
- Delete a link.
- Confirm one account cannot read another account’s `userLinks`.
- Test dashboard layout at 320px, mobile, tablet, and desktop widths.
- Test keyboard focus, modal closing, and reduced-motion mode.
- Verify `/s/{alias}` on Firebase Hosting.

## Future backend endpoints

For the production version, implement trusted Firebase HTTPS functions for:

- `createShortLink`
- `updateShortLink`
- `toggleShortLink`
- `deleteShortLink`
- `getUserLinks`
- `getLinkAnalytics`
- `resolveShortLink`
- `deleteUserAccountData`

These functions should verify ID tokens, enforce ownership and plans, apply rate limits, claim aliases atomically, write trusted timestamps, maintain privacy-conscious analytics, and return standardized safe errors.