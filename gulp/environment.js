var env = process.argv.slice(3);
var environment = (env[0]=='--env' && env[1]=='prod') ? env[1] : 'dev';

module.exports = {
    type: environment,
    isProd: environment == 'prod'
};
