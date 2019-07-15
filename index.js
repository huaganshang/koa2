const koa = require('koa');
const router = require('./routes/index');
const config = require('./config');

const app = new koa();
app.use(router.routes()).use(router.allowedMethods());

app.listen(config.port, '0.0.0.0', () => {
    console.log(`server is running at ${config.host}:${config.port}`);
});