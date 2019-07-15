const Router = require('koa-router');
const User = require('../app/controllers/user');

var router = new Router();
router.get('/user/getList', User.getList);

module.exports = router