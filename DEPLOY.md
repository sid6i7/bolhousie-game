# Deployment Guide for Bolhousie MVP

Built with Next.js + PeerJS. No external backend required.

## 1. Run Locally (Testing)

You can run the game on your computer to test it.

1. Open your terminal in the project folder.
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000 in your browser.
4. **To test multiplayer:**
   - Open one tab/window as **Host** (Create Game).
   - Copy the Game ID.
   - Open a **New Incognito Window** (or a different browser) as **Player**.
   - Paste the Game ID and Join.
   - You should see sync happen almost instantly!

## 2. Deploy to Vercel (Production)

Vercel is the best way to host Next.js apps for free.

### Option A: Via Command Line (Fastest)

1. Open terminal in the project folder.
2. Run:
   ```bash
   npx vercel
   ```
   (You might need to log in to Vercel).
3. Keep pressing **Enter** to accept all defaults.
   - Set up and deploy? [Y/n] -> **Y**
   - Which scope? -> **Enter**
   - Link to existing project? -> **N**
   - Project name? -> **bolhousie** (or Enter)
   - In which directory? -> **./** (Enter)
   - Want to modify settings? -> **N**
4. Wait ~1 minute. It will give you a `Production: https://bolhousie-xyz.vercel.app` URL.
5. Share that URL with friends!

### Option B: Via Vercel Dashboard

1. Push this code to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your GitHub repository.
4. Click **Deploy**.
5. Done!

## Note on PeerJS
Since this uses peer-to-peer WebRTC, it might sometimes fail behind strict corporate firewalls. But for typical home/mobile data usage, it works perfectly.
