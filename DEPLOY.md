# Deploying WalletWatch to EC2 (single process, client served by Express)

This app now runs as **one Node process**: Express serves the API under `/api`
and also serves the built React app (`client/dist`) as static files, with an
SPA fallback to `index.html` for client-side routing. No separate Netlify /
Fly.io deploy is needed anymore.

## One-time setup on the instance

```bash
# Node + git (adjust for your AMI; example is Amazon Linux)
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs git

# PM2 to keep the process alive across reboots/crashes
sudo npm install -g pm2

# Swap space — recommended on t3.micro (1 GiB RAM), especially if you're
# running more than one app on the box. 1 GiB swap is a reasonable start.
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
```

## Deploy

```bash
git clone https://github.com/HansNu/WalletWatch.git
cd WalletWatch

# server env vars
cp server/.env.example server/.env
# edit server/.env with real SUPABASE_URL / SUPABASE_KEY, and PORT if needed

npm run install:all   # installs client + server deps
npm run build          # vite build -> client/dist

pm2 start ecosystem.config.js
pm2 save                # persist the process list
pm2 startup             # follow the printed command to enable pm2 on boot
```

The app is now listening on `PORT` (default 3000) at `http://<instance>:3000`.

## Putting Nginx in front (recommended if you're also running another app)

Point Nginx at port 3000 for this app and at whatever port your other app
uses, routed by domain/subdomain (or path, if you don't have a second
domain/subdomain available):

```nginx
server {
    listen 80;
    server_name walletwatch.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Reload with `sudo nginx -t && sudo systemctl reload nginx`. Add a second
`server {}` block (different `server_name` or port) for your other project.

If you don't have a spare domain/subdomain, you can instead expose each app
on a distinct port (e.g. this app on 3000, the other on 3001) and open both
ports in the EC2 security group — Nginx is nicer (one port, TLS via
Let's Encrypt, no port juggling for users) but not strictly required.

## Redeploying after changes

```bash
cd WalletWatch
git pull
npm run install:all
npm run build
pm2 restart walletwatch
```

## What changed from the old Netlify + Fly.io split

- `server/index.js` now does `express.static(client/dist)` plus an SPA
  fallback route, instead of only exposing `/api/*`.
- `client/src/constants/urlConstant.js` now points at the relative path
  `/api/` instead of the hardcoded `https://walletwatch.fly.dev/` (which was
  also missing the `/api` prefix the server actually expects). Same-origin
  requests mean no CORS configuration is needed in production.
- `client/vite.config.js`'s dev proxy now forwards `/api` (matching the code)
  to `http://localhost:3000` instead of the old unused `/WalletAPI` -> 4200
  proxy.
- Root-level `package.json` and `ecosystem.config.js` added as convenience
  for installing/building/running both halves together via PM2.
- `server/.gitignore` fixed (previously contained literal quote characters
  around `node_modules`, so git wasn't actually ignoring it) and now also
  ignores `.env`.

`client/netlify.toml` and `client/public/_redirects` are no longer used but
were left in place in case you ever want to go back to a split deploy.
