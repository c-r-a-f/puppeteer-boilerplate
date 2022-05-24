module.exports = {
  apps : [{
    name      : 'API',
    script    : './check.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }],
};
