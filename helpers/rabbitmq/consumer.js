const amqp = require('amqplib/callback_api')

const rabbitConsumer = async (data) => {
  const record = data.topic
  amqp.connect('amqp://localhost', (err, connection) => {
    if (err) {
      console.log(err)
    }

    connection.createChannel(async (chanErr, channel) => {
      if (chanErr) {
        console.log(chanErr);
      }
      channel.assertQueue(record)
      channel.consume(record, (msg) => {
        return msg.content.toString()
      })
    })
  })
}

module.exports = { rabbitConsumer }
