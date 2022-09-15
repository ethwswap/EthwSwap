module.exports = {
  apps: [
    {
      name: "ETHW-Swap",
      script: ".output/server/index.mjs",
      watch: true,
      env: {
        "PORT": 3000,
        "NODE_ENV": "development"
      },
      env_production: {
        "PORT": 3000,
        "NODE_ENV": "production",
      }
    }
  ]
}