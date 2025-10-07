# GitHub Pages Deployment Guide (Reusable)

This guide covers reliable ways to publish almost any project to GitHub Pages using either GitHub Actions (recommended) or a `gh-pages` branch. It includes decision points, templates, router/base-path tips, and troubleshooting.

## Project-Specific Notes (Magenta Converter)

- Site URL: `https://acidyq.github.io/magenta_converter`
- Pages type: Project Pages (base path `'/magenta_converter/'`)
- Next.js config: `apps/web/next.config.js` uses `output: 'export'`, sets `basePath`/`assetPrefix` automatically in GitHub Actions, and disables image optimization for static hosting.
- Build command: `npm run build:shared && npm run build --workspace @magenta-converter/web` (emits static site at `apps/web/out/`).
- Pages workflow: `.github/workflows/deploy.yml` runs the build, creates `.nojekyll`, and deploys `apps/web/out` with `actions/deploy-pages`.
- API access: set `NEXT_PUBLIC_API_URL` to your hosted API endpoint via repository or environment secrets before deployment; rewrites are dev-only.

These specifics show how to apply the generic guidance below to this repository.

## Quick Decision Tree

- What type of site?
  - Static files only (HTML/CSS/JS) → Project Pages or User/Org Pages
  - Built site (React/Vite/Next/Docusaurus/MkDocs/Hugo/Jekyll/etc.) → Use GitHub Actions to build and deploy

- What Pages type?
  - User/Org Pages (repo named `<user>.github.io`) → Deployed at `https://<user>.github.io/` (base path `/`)
  - Project Pages (any repo name) → Deployed at `https://<user>.github.io/<repo>/` (base path `/<repo>/`)

- Preferred deployment method?
  - GitHub Actions → Best for CI, reproducibility, monorepos
  - `gh-pages` branch → Simple/manual, works without Actions

## One‑Time GitHub Setup

1. Create or open your repository on GitHub.
2. Go to: Repository → Settings → Pages
3. Under “Build and deployment”, select “GitHub Actions” (recommended). If using a `gh-pages` branch, choose “Deploy from a branch” and set the branch/folder.
4. Optional: Set a custom domain and enable “Enforce HTTPS”.

## Project Pages Base Path

If your site lives at `https://<user>.github.io/<repo>/`, your app must serve under the base path `/<repo>/`.

- Vite: set `base: '/<repo>/'` in `vite.config.ts`
- React Router: `<BrowserRouter basename={import.meta.env.BASE_URL}>`
- Next.js (static export): `assetPrefix` or `basePath` (if using next export alternatives)
- Gatsby: set `pathPrefix: '/<repo>'` and build with `--prefix-paths`
- Docusaurus: set `baseUrl: '/<repo>/'`
- Static HTML: reference assets with relative paths or `/<repo>/...`

For User/Org Pages, base is `/` and the above base/pathPrefix settings should be adjusted or disabled accordingly.

## Option A: GitHub Actions (Recommended)

Use one of the templates below. All assume:

- Pages permissions granted: `permissions: contents: read, pages: write, id-token: write`
- Pages steps: `actions/upload-pages-artifact` then `actions/deploy-pages`
- Output directory set to your build output (e.g., `dist`, `build`, `site`, `public`)

Place the workflow at `.github/workflows/deploy.yml`.

### A1) Node + Static Build (Vite/React/Parcel/etc.)

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      # If using Vite Project Pages, ensure vite.config.ts has `base: '/<repo>/'`
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### A2) Jekyll (GitHub’s default static site engine)

```yaml
name: Deploy Jekyll to GitHub Pages
on: { push: { branches: [ main ] }, workflow_dispatch: {} }
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: actions/configure-pages@v5
      - uses: actions/jekyll-build-pages@v1
        with:
          source: ./
          destination: ./_site
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./_site }
  deploy:
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### A3) Hugo

```yaml
name: Deploy Hugo to GitHub Pages
on: { push: { branches: [ main ] }, workflow_dispatch: {} }
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: peaceiris/actions-hugo@v3
        with: { hugo-version: '0.133.0' }
      - run: hugo --minify
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./public }
  deploy:
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### A4) MkDocs (Python)

```yaml
name: Deploy MkDocs to GitHub Pages
on: { push: { branches: [ main ] }, workflow_dispatch: {} }
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: pip install mkdocs mkdocs-material
      - run: mkdocs build --clean
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./site }
  deploy:
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### A5) Docusaurus/Gatsby/Next (Static Export)

Use the Node template (A1) and adjust build commands/output:

- Docusaurus: `npm run build` → `build` directory, set `url` and `baseUrl` in `docusaurus.config.js`
- Gatsby: `gatsby build --prefix-paths` → `public` directory, set `pathPrefix`
- Next.js (static export): Use `next export` (or a static adapter) → `out` directory; note base path if hosting under `/<repo>/`

Update `actions/upload-pages-artifact` `path` accordingly.

## Option B: Deploy via `gh-pages` Branch (No Actions)

Good for simple static sites or when Actions is disabled.

### B1) Using the `gh-pages` npm package (Node builds)

1. Install: `npm i -D gh-pages`
2. Add scripts to `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Build and publish: `npm run deploy`
4. In GitHub → Settings → Pages, set Source = `gh-pages` branch, root `/`.

### B2) Manual subtree deploy (any build tool)

```bash
git subtree push --prefix dist origin gh-pages
# or force-update
git push -f origin `git subtree split --prefix dist main`:gh-pages
```

Then set Pages Source = `gh-pages` branch.

## SPA Routing and 404 Handling

For SPAs using client-side routing:

- Project Pages require either:
  - Correct base path in router/build (see “Project Pages Base Path”), and
  - A fallback to `index.html` for unknown paths.

Options:
- Add a `404.html` that redirects to `/index.html` preserving the path, e.g. the "SPA 404 redirect" snippet (searchable) or use framework-provided adapters.
- For React Router + Vite, set `basename` and ensure your router can handle deep links; GitHub Pages serves `404.html` on unknown routes.

Also add a `.nojekyll` file at the site root to prevent Jekyll from ignoring asset paths that start with `_`.

## Custom Domains

1. Add a `CNAME` file in your published output (e.g., in `public/CNAME` or generated into `dist`) containing your domain.
2. Configure DNS:
   - Apex domain: `A` records to GitHub Pages IPs (see GitHub docs), or ALIAS/ANAME if supported.
   - Subdomain: `CNAME` to `<user>.github.io`.
3. In Settings → Pages, set your custom domain and enable “Enforce HTTPS”.

## Monorepo Tips

- Set `defaults.run.working-directory` in the workflow or per-step `working-directory`.
- Use path filters to limit workflow to a subfolder:

```yaml
on:
  push:
    branches: [ main ]
    paths:
      - "apps/docs/**"
      - ".github/workflows/deploy.yml"
```

- Upload only the subproject’s build output as the artifact.

## Permissions and Security

- Required for Pages deploy via Actions: `pages: write`, `id-token: write`, `contents: read`.
- Do not commit secrets. Use GitHub Secrets for tokens/keys if your build needs them.
- Consider `concurrency` to avoid overlapping deploys on rapid pushes.

## Troubleshooting

- 404 on deep links (SPA): ensure base path is set and add `404.html` redirect; include `.nojekyll`.
- Deployed URL wrong: verify repository type (User/Org vs Project) and base/pathPrefix.
- Workflow “Failed to create deployment”: Pages not enabled or missing permissions; check Settings → Pages set to “GitHub Actions”.
- Assets 404 after rename: update base/pathPrefix and clear caches; ensure artifact `path` matches actual output dir.
- Jekyll processing issues: add a `.nojekyll` file at the site root of the deployed output.
- Custom domain not HTTPS: verify DNS, wait for certificate provisioning, ensure “Enforce HTTPS” is enabled.

## Verification Checklist (Copy/Paste)

- [ ] Pages enabled in Settings with correct source
- [ ] Workflow commits on default branch
- [ ] Correct output directory uploaded
- [ ] Base/pathPrefix configured for Project Pages
- [ ] `.nojekyll` present if needed
- [ ] Router handles deep links (SPA)
- [ ] Custom domain `CNAME` file and DNS set

---
Last updated: 2025-10-06
