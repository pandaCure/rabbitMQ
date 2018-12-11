const amqp = require("amqplib");
const open = amqp.connect("amqp://localhost");
const tasks = "my-rabbit";
open
  .then(function(connect) {
    process.on("SIGINT", function() {
      connect.close();
    });
    return connect.createChannel().then(function(channel) {
      const ok = channel
        // 设置持久化  是不是持久的队列?
        .assertQueue(tasks, {
          durable: false
        })
        .then(function() {
          return channel.consume(
            tasks,
            function(msg) {
              console.log(
                `我正在消费这条queen的结果：`,
                msg.content.toString()
              );
              if (msg.content.toString()) {
                connect.close();
              }
            },
            // 设置对生产者的回应信息
            { noAck: true }
          );
        });
      return ok.then(function(resulte) {
        console.log("等待消息队列的到来");
      });
    });
  })
  .catch(console.warn);
