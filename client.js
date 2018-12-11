const amqp = require("amqplib");
const open = amqp.connect("amqp://localhost");
const tasks = "my-rabbit";
open
  .then(function(result) {
    return result.createChannel().then(function(channel) {
      return channel.assertQueue(tasks, { durable: false }).then(function() {
        channel.sendToQueue(tasks, new Buffer("hello world"), {});
        console.log("我已经发完消息啦。。。。。");
        return channel.close();
      });
    }).finally(function (){
        result.close()
    });
  })
  .catch(console.log);
