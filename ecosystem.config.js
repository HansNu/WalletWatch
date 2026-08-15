// PM2 process file. From the repo root on the EC2 instance:
//   pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'walletwatch',
      cwd: './server',
      script: 'index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
