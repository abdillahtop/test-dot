
const axios = require('axios')
const validate = require('validate.js')
const wrapper = require('../helpers/wrapper')
const model = require('../models/model')
const amqp = require('amqplib/callback_api');

module.exports = {
  async insertDataPosts(payload) {
    const topic = 'insertDataPosts'
    amqp.connect('amqp://localhost', (err, connection) => {
      if (err) {
        console.log(err)
      }

      connection.createChannel(async (chanErr, channel) => {
        if (chanErr) {
          console.log(chanErr);
        }
        channel.assertQueue(topic)
        channel.consume(topic, async (msg) => {
          const value = JSON.parse(msg.content.toString())

          const valid = await model.findOne({
            where: {
              id: value.id
            }
          })

          if (validate.isEmpty(valid)) {
            const insert = model.create(value)

            if (insert.err) {
              console.log({
                success: false,
                data: '',
                message: 'Insert data failed',
                code: 500
              });
            }

            console.log({
              success: true,
              data: value,
              message: 'Insert data success',
              code: 200
            });
          }
          console.log({
            success: false,
            data: '',
            message: 'Data already update',
            code: 400
          });

        })
      })
    })
  }
}
