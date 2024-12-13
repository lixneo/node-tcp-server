const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
app.use(views(__dirname + "/views", { extension: "ejs" }));

const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

const index = require('./routes/index')
app.use(index.routes(), index.allowedMethods());

module.exports = app;