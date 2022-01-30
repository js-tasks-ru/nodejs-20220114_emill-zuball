const path = require('path');
const Koa = require('koa');
const app = new Koa();
const EventEmitter = require('events');

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const chatEmitter = new EventEmitter();

router.get('/subscribe', async (ctx, next) => {
  await new Promise((resolve, reject) => {
    chatEmitter.once('message', ({message}) => {
      ctx.body = message;
      resolve(ctx);
    });
  });
});

router.post('/publish', async (ctx, next) => {
  if (ctx.request.body.message) {
    chatEmitter.emit('message', ctx.request.body);
    ctx.status = 200;
    ctx.body = 'ok';
  } else {
    ctx.status = 400;
    ctx.body = 'The message must be passed';
  }
});

app.use(router.routes());

module.exports = app;
