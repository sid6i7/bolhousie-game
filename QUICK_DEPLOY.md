# Quick Deployment Guide - Bolhousie 🎲

For a **one-time, quick deployment**, use **Railway** for both services.

## Step 1: Deploy the PeerJS Server (2 min)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub Repo"**
3. Select this repo, but configure:
   - **Root Directory**: `peerserver`
4. Railway will auto-detect Node.js and start deployment
5. Once deployed, click on the service → **Settings** → **Networking**
6. Click **"Generate Domain"** to get a public URL
7. **Copy the URL** (e.g., `bolhousie-peerserver-production.up.railway.app`)

## Step 2: Deploy the Next.js App (3 min)

### Option A: Railway (same platform)
1. In the same Railway project, click **"New"** → **"GitHub Repo"**
2. Select this repo again, configure:
   - **Root Directory**: `.` (leave empty/root)
3. Go to **Variables** and add:
   ```
   NEXT_PUBLIC_PEER_HOST=your-peerserver-url.up.railway.app
   NEXT_PUBLIC_PEER_PORT=443
   NEXT_PUBLIC_PEER_SECURE=true
   ```
   (Replace with your actual peer server URL from Step 1, **without https://**)
4. Generate a domain for this service too
5. Done! 🎉

### Option B: Vercel (faster for Next.js)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import this GitHub repo
3. Add environment variables before deploying:
   ```
   NEXT_PUBLIC_PEER_HOST=your-peerserver-url.up.railway.app
   NEXT_PUBLIC_PEER_PORT=443
   NEXT_PUBLIC_PEER_SECURE=true
   ```
4. Click **Deploy**
5. Done! 🎉

## Quick Test

1. Open the Next.js app URL
2. Create a game as Host
3. Open another browser/incognito window
4. Join with the game code
5. Both should connect successfully!

## Troubleshooting

- **Peer connection fails**: Make sure the environment variables are set correctly
- **CORS errors**: Railway handles CORS automatically
- **WebSocket errors**: Ensure `NEXT_PUBLIC_PEER_SECURE=true` for HTTPS deployments

---

**Total time: ~5 minutes** ⚡
