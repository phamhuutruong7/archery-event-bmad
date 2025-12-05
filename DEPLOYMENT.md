# GitHub Pages Deployment Guide

## Overview
This project is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` or `features/using-ui-ux-pro` branches.

## Deployment URL
Once deployed, your application will be available at:
**https://phamhuutruong7.github.io/archery-event-bmad/**

## Setup Instructions

### 1. Enable GitHub Pages
Run these commands to enable GitHub Pages for your repository:

```bash
# Navigate to the repository root
cd D:\Projects\archery-event-bmad

# Enable GitHub Pages with GitHub CLI
gh api repos/phamhuutruong7/archery-event-bmad/pages -X POST -f source[branch]=gh-pages -f source[path]=/
```

Or manually via GitHub website:
1. Go to: https://github.com/phamhuutruong7/archery-event-bmad/settings/pages
2. Under "Build and deployment":
   - Source: **GitHub Actions**
3. Save the settings

### 2. Push Changes
```bash
# Add all changes
git add .

# Commit changes
git commit -m "Setup GitHub Pages deployment"

# Push to trigger deployment
git push origin features/using-ui-ux-pro
```

### 3. Monitor Deployment
- Go to: https://github.com/phamhuutruong7/archery-event-bmad/actions
- Watch the "Deploy to GitHub Pages" workflow
- Wait for the green checkmark (usually takes 2-3 minutes)

## Configuration Files Created

### 1. `.github/workflows/deploy.yml`
- Automated GitHub Actions workflow
- Builds the Vue.js app on every push
- Deploys to GitHub Pages

### 2. `frontend/vite.config.ts`
- Updated with `base: '/archery-event-bmad/'` for production
- Configured build output directory

### 3. `frontend/public/404.html`
- SPA fallback for client-side routing
- Handles page refreshes on GitHub Pages

### 4. `frontend/index.html`
- Added script to restore routes after 404 redirect
- Ensures Vue Router works correctly

## Important Notes

### Mock Server Limitation
⚠️ GitHub Pages only supports static files. Your mock server (`frontend/mock-server/`) won't work.

**Options:**
1. **Use Static Data (Temporary)**: Modify your app to use local JSON data
2. **Deploy Mock Server Separately**: Use free services like:
   - Vercel: https://vercel.com
   - Render: https://render.com
   - Railway: https://railway.app
3. **Switch to Hash Router**: Change from `createWebHistory` to `createWebHashHistory`

### Testing on Mobile
Once deployed:
1. Open the URL on your mobile browser
2. The app will be fully responsive
3. You can add it to your home screen (PWA-like experience)

### Local Testing
Test the production build locally before deploying:
```bash
cd frontend
npm run build
npm run preview
```

## Troubleshooting

### If deployment fails:
1. Check workflow logs at: https://github.com/phamhuutruong7/archery-event-bmad/actions
2. Ensure GitHub Pages is enabled in repository settings
3. Verify the branch name matches the workflow configuration

### If routes don't work:
- Clear browser cache
- Check browser console for errors
- Verify base path in vite.config.ts matches repository name

### If assets don't load:
- Check that all imports use relative paths or `@/` alias
- Verify the base URL configuration

## Next Steps

1. **Enable GitHub Pages** (see Setup Instructions above)
2. **Push your changes** to trigger the first deployment
3. **Wait for deployment** (check Actions tab)
4. **Test on mobile** by visiting the deployment URL
5. **Consider deploying mock server** separately if you need backend functionality

## Manual Deployment (Alternative)
If you prefer manual deployment:
```bash
cd frontend
npm run build
# Then manually upload the 'dist' folder to GitHub Pages
```

---
For more information, see: https://vitejs.dev/guide/static-deploy.html#github-pages
