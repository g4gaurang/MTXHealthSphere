# MTX HealthSphere

Interactive landing-page prototype for the MTX HealthSphere Information Exchange \& Engagement Platform.

## Local setup

```bash
npm install
npm run dev
```

Run `npm run build` for a production build and `npm run preview` to inspect it locally.

## Product and content assumptions

* HealthSphere is positioned as an information exchange and engagement platform.
* Salesforce Health Cloud, Salesforce Marketing Cloud, MuleSoft, approved secure file transfer, and configurable healthcare integration components are the current implementation foundation.
* EHRs, HIEs, master patient index services, claims platforms, and other designated clinical systems remain external authoritative sources where applicable.
* Interface behavior and standards support depend on source capabilities and deployed configuration.
* Product capabilities are distinct from implementation and managed services.

## Healthcare-data safeguards

* Demonstration records, interface volumes, profiles, analytics, and workflows are synthetic.
* The prototype contains no patient names, birth dates, medical record numbers, diagnoses, addresses, or contact details.
* Identity exceptions require an authorized review step; the prototype does not merge records automatically.
* Engagement controls demonstrate consent, preference, quiet-hour, template, approval, exit, and frequency configuration.
* The prototype does not transmit or retain form data and cannot send communications.
* AI examples are operational assistance patterns and do not make clinical decisions or contact patients independently.

## Build and deployment

Vite uses `/MTXHealthSphere/` as its production base path. Static assets use relative references where needed. The site is a single page with anchor navigation, so browser refreshes do not require a route fallback.

The GitHub Actions workflow builds the project and deploys `dist` to GitHub Pages after changes reach `main`. In repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions** once if it is not already selected.

Expected public URL:

`https://g4gaurang.github.io/MTXHealthSphere/`

## Commands

* `npm run dev` \- local development
* `npm run build` \- TypeScript and production build
* `npm run lint` \- static code checks
* `npm run preview` \- local production preview
