const Router = require("@koa/router");
const router = new Router();
const net = require("net");

router.get("/", async (ctx, next) => {
  await ctx.render("index", {
    title: "Hello Koa 2!",
  });
});

function returnData(ctx) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let { address, content } = ctx.request.body;

      // 连接到服务器
      const client = new net.Socket();
      const SERVER_PORT = address.split(":")[1];
      const SERVER_ADDRESS = address.split(":")[0];

      client.connect(SERVER_PORT, SERVER_ADDRESS, () => {
        console.log("已连接到服务器");

        // 发送消息到服务器
        client.write(content + "\n");
      });

      // 接收服务器响应
      client.on("data", (data) => {
        console.log(`收到服务器的响应: ${data.toString()}`);

        resolve((ctx.body = data.toString()));
        // 关闭连接
        client.destroy();
      });

      // 处理错误事件
      client.on("error", (err) => {
        console.error(`客户端错误: ${err.message}`);

        reject((ctx.body = err.message));
        // 关闭连接
        client.destroy();
      });

      // 处理连接关闭事件
      client.on("close", () => {
        console.log("已断开与服务器的连接");
      });

    }, 1000);
  });
}

router.post("/send", async (ctx, next) => {
  await returnData(ctx);
});
module.exports = router;
