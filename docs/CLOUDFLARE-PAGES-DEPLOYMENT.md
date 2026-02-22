# Cloudflare Pages Deployment Guide

**Article-to-Flashcards Web UI**

---

## Prerequisites

- Git account (GitHub, GitLab, Bitbucket)
- Cloudflare account (free tier)
- GitHub repository created

---

## Deployment Steps

### Step 1: Push to GitHub

1. Create a new GitHub repository
2. Name it: `article-to-flashcards`
3. Push your code to GitHub

```bash
cd /home/clawdonaws/.openclaw/workspace/article-to-flashcards
git init
git add .
git commit -m "Initial commit: Article-to-Flashcards v1.0.0"
git remote add origin https://github.com/YOUR_USERNAME/article-to-flashcards.git
git branch -M main
git push -u origin main
```

### Step 2: Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **Pages**
3. Click **Create a project**
4. Select **Connect to Git**
5. Authorize GitHub/GitLab
6. Select the `article-to-flashcards` repository
7. Click **Begin setup**

### Step 3: Configure Build Settings

For **Cloudflare Pages**, you need to configure:

**Project Name:**
- `article-to-flashcards-dashboard`

**Framework Preset:**
- None (Next.js)

**Build Command:**
```bash
cd web-ui && npm install && npm run build
```

**Build Output Directory:**
```
web-ui/.next
```

**Environment Variables:**
- No environment variables needed for this version

**Root Directory:**
```
web-ui
```

### Step 4: Deploy

1. Click **Save and Deploy**
2. Cloudflare will automatically:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Build the project (`npm run build`)
   - Deploy to production

3. Wait 2-3 minutes for deployment to complete

### Step 5: View Your Site

Once deployment is complete:
1. Click the project name
2. Click **Preview deployment**
3. Your site will be available at:
   ```
   https://article-to-flashcards-dashboard.pages.dev
   ```

---

## Custom Domain (Optional)

1. In Cloudflare Pages project settings
2. Click **Custom Domains**
3. Add your domain
4. Follow Cloudflare's DNS configuration

---

## Update Deployment

### Automatic Updates

Cloudflare Pages automatically updates when you push to GitHub:
1. Push changes to your `main` branch
2. Cloudflare detects the push
3. Automatically builds and deploys
4. New deployment URL is updated

### Manual Deployment

1. Go to Cloudflare Pages Dashboard
2. Select your project
3. Click **Continue deployment**
4. Make changes
5. Click **Save and Deploy**

---

## Deployment Settings

### Build Configuration

```yaml
Framework Preset: None
Build Command: cd web-ui && npm install && npm run build
Build Output Directory: web-ui/.next
Root Directory: web-ui
```

### Environment Variables

No environment variables needed for v1.0.0.

### Build Logs

- View build logs in Cloudflare Dashboard
- Monitor build status and errors
- Check for deployment failures

---

## Troubleshooting

### Build Fails

**Issue:** Build command fails

**Solution:**
1. Check build logs in Cloudflare Dashboard
2. Verify package.json exists and has correct dependencies
3. Try running build command manually:
   ```bash
   cd web-ui
   npm install
   npm run build
   ```

### Deployment Timeouts

**Issue:** Build exceeds 10-minute timeout

**Solution:**
1. Optimize dependencies
2. Reduce build size
3. Use GitHub Actions for custom builds

### 404 After Deployment

**Issue:** Site returns 404

**Solution:**
1. Check build output directory: `.next/`
2. Verify Next.js configuration
3. Check Cloudflare Pages settings

### Environment Variables Issues

**Issue:** Environment variables not loading

**Solution:**
1. Add variables in Cloudflare Pages Settings → Environment Variables
2. Restart deployment
3. Clear browser cache

---

## Post-Deployment

### 1. Test the Site

1. Open your deployment URL
2. Test all features:
   - Dashboard loads
   - Task filtering works
   - Progress bars display correctly
   - Responsive design works

### 2. Set Up Monitoring

1. Enable analytics in Cloudflare Pages
2. Set up error tracking (Sentry recommended)
3. Monitor uptime

### 3. Set Up Notifications

1. Enable email notifications for deployments
2. Set up Slack/Discord webhooks
3. Monitor deployment status

---

## Deployment Checklist

- [x] Repository created and pushed to GitHub
- [x] Cloudflare Pages project created
- [x] Build settings configured
- [x] Build command: `cd web-ui && npm install && npm run build`
- [x] Build output: `web-ui/.next`
- [x] Root directory: `web-ui`
- [x] Deployment completed successfully
- [x] Site is accessible at deployment URL
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled (optional)
- [ ] Notifications configured (optional)

---

## Next Updates

### Update Web UI

1. Make changes to web UI
2. Push to GitHub
3. Cloudflare auto-deploys

### Update Extension

1. Build extension: `cd extension && npm run build`
2. Create ZIP: `cd dist && zip -r ../article-to-flashcards-v1.0.0.zip * && cd ..`
3. Upload to Chrome Web Store

---

## URL Reference

| Environment | URL |
|-------------|-----|
| Production | `https://article-to-flashcards-dashboard.pages.dev` |
| Staging | `https://article-to-flashcards-dashboard.staging.pages.dev` |

---

## Support

- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- Next.js Deployment: https://nextjs.org/docs/deployment
- GitHub Help: https://docs.github.com/en/actions

---

**Last Updated:** 2026-02-22
**Version:** 1.0.0
