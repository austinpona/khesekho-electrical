# Khesekho Electrical

Professional electrical services website — domestic, commercial & industrial. Midrand, South Africa.

- **Live site:** [GitHub Pages](#) (after you enable Pages)
- Contact form opens WhatsApp: **076 332 3230**

## Push to GitHub & host on GitHub Pages

1. **Create a new repo on GitHub**
   - Go to [github.com/new](https://github.com/new)
   - Repository name: `khesekho-electrical` (or any name you like)
   - Leave "Add a README" **unchecked** (this folder already has files)
   - Create repository

2. **Connect and push** (run in this folder in terminal):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/khesekho-electrical.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

3. **Turn on GitHub Pages**
   - In the repo: **Settings** → **Pages**
   - Under "Build and deployment": **Source** = "Deploy from a branch"
   - **Branch:** `main` → folder: **/ (root)** → Save
   - In 1–2 minutes the site will be at:  
     `https://YOUR_USERNAME.github.io/khesekho-electrical/`
