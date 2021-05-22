const amqp = require('amqplib/callback_api')

const rabbitSendProducer = async (data) => {
  const buffer = new Buffer.from(JSON.stringify(data.body));
  const record = data.topic
  amqp.connect('amqp://localhost', (err, connection) => {
    if (err) {
      console.log(err)
    }

    connection.createChannel((chanErr, channel) => {
      if (chanErr) {
        console.log(chanErr);
      }
      channel.assertQueue(record)
      channel.sendToQueue(record, buffer)
      console.log('Topic has been record');
    })
  })
}

module.exports = { rabbitSendProducer }
