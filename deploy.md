## Deploying to GitHub Pages

1. **Install dependencies**  
   - Run `pnpm install` locally to ensure the lockfile and `node_modules` are ready.

2. **Build the site**  
   - Execute `pnpm run build`. This produces the `dist/` folder that the workflow later publishes.

3. **Verify the GitHub Actions workflow**  
   - Make sure `.github/workflows/deploy.yml` matches the steps you expect:
     * Node.js 20 is set up.
     * `pnpm` is installed globally (`npm install -g pnpm@10`).
     * Dependencies installed via `pnpm install`.
     * Site built via `pnpm run build`.
     * `peaceiris/actions-gh-pages@v4` publishes `./dist`.

4. **Set up repository secrets**  
   - GitHub provides `GITHUB_TOKEN` automatically, so no extra secret is required for this workflow.

5. **Push to the `main` branch**  
   - The workflow runs on every push to `main`. Commit your changes and push:  
     `git add . && git commit -m "Deploy prep" && git push origin main`

6. **Monitor the deployment job**  
   - Visit the repository’s **Actions** tab, open the latest **Deploy to GitHub Pages** run, and confirm the `build-and-deploy` job succeeds.

7. **Check the published site**  
   - Once the workflow finishes, GitHub Pages hosts the site under `<username>.github.io/<repo>`. Confirm the updated content is live.

8. **Troubleshooting tips**  
   - If `pnpm` cannot be found, rerun `npm install -g pnpm@10` locally and ensure your environment matches the workflow commands.
   - For build failures, inspect `pnpm run build` locally before pushing.
