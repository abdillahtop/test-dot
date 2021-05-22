const express = require('express');
const router = express.Router();
const axios = require('axios')
const model = require('../models/model');
const modelComment = require('../models/model_comment');
const validate = require('validate.js')
const wrapper = require('../helpers/wrapper');
const producer = require('../helpers/rabbitmq/producer')

router.post('/posts/v1/add', async (req, res) => {
  let count = 0
  const getData = await model.findAll()
  if (validate.isEmpty(getData)) {
    const data = await axios.get(`https://jsonplaceholder.typicode.com/posts`)
    count = data.data.length
  } else {
    count = getData[getData.length - 1].id
  }

  let payload = {
    id: await count + 1,
    title: req.query.title,
    body: req.query.body,
    userId: parseInt(req.query.userId)
  }
  producer.rabbitSendProducer({
    topic: 'insertDataPosts',
    body: payload
  })

  return wrapper.data(res, true, payload, 'Insert data success')
})

router.delete('/posts/v1/delete/:id', async (req, res) => {
  const id = req.params.id
  const valid = await model.findOne({
    where: {
      id
    }
  })

  if (validate.isEmpty(valid)) {
    return wrapper.error(res, false, 'Data not found', 404)
  }

  const result = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`)

  const deleting = await model.destroy({ where: { id } })
  if (result.err || deleting.err) {
    return wrapper.error(res, false, 'Internal server error', 500)
  }

  return wrapper.data(res, true, 'Success', 'Delete data success')

})

router.patch('/posts/v1/update-patch', async (req, res) => {
  let payload = {
    id: parseInt(req.query.id),
    title: req.query.title,
    body: req.query.body
  }

  const valid = await model.findOne({ where: { id: payload.id } })

  if (validate.isEmpty(valid)) {
    return wrapper.error(res, false, 'Data not found', 404)
  }

  const data = await axios.patch(`https://jsonplaceholder.typicode.com/posts/${payload.id}`, {
    title: payload.title,
    body: payload.body
  }, {
    headers: {
      'content-type': 'application/json; charset=UTF-8',
    }
  })

  const updating = await model.update({ title: payload.title, body: payload.body }, {
    where: {
      id: payload.id
    }
  })
  if (updating.err || data.err) {
    return wrapper.error(res, false, 'Internal server error', 500)
  }
  return wrapper.data(res, true, data.data, 'Updatert data success')
})

router.get('/posts/v1/all', async (req, res) => {

  const getData = await model.findAll()

  const data = await axios.get(`https://jsonplaceholder.typicode.com/posts`)

  if (!validate.isEmpty(getData)) {
    getData.map(value => {
      data.data.find(val => {
        if (val.id === value.id) {
          return {
            userId: value.userId,
            id: value.id,
            title: value.title,
            body: value.body
          }
        }
      })
      data.data.push({
        userId: value.userId,
        id: value.id,
        title: value.title,
        body: value.body
      })
    })
  }

  return wrapper.data(res, true, data.data, 'Get all data success')
})

router.get('/posts/v1/:id', async (req, res) => {
  const getOneData = await model.findOne({ where: { id: req.params.id } })
  let oneData = getOneData
  if (validate.isEmpty(getOneData)) {
    const data = await axios.get(`https://jsonplaceholder.typicode.com/posts/${req.params.id}`)
      .then(response => { return response })
      .catch(err => { return err })
    oneData = data.data
  }

  if (validate.isEmpty(oneData)) {
    return wrapper.error(res, false, 'Data not found', 404)
  }

  const dataOut = {
    userId: oneData.userId,
    id: oneData.id,
    title: oneData.title,
    body: oneData.body
  }
  return wrapper.data(res, true, dataOut)

})

router.post('/posts/v1/comment/add', async (req, res) => {

  let count = 0
  const getData = await modelComment.findAll()
  if (validate.isEmpty(getData)) {
    const data = await axios.get(`https://jsonplaceholder.typicode.com/comments`)
    count = data.data.length
  } else {
    count = getData[getData.length - 1].id
  }

  let payload = {
    postId: parseInt(req.query.postId),
    id: await count + 1,
    name: req.query.name,
    email: req.query.email,
    body: req.query.body,
  }

  const insert = await modelComment.create(payload)

  if (insert.err) {
    return wrapper.error(res, false, 'Internal server error', 500)
  }

  return wrapper.data(res, true, payload, 'Insert data comment success')
})

router.patch('/posts/v1/comment/update-patch/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  let payload = {
    postId: parseInt(req.query.postId),
    name: req.query.name,
    email: req.query.email,
    body: req.query.body,
  }

  let valid = await modelComment.findOne({ where: { id } })

  if (validate.isEmpty(valid)) {
    const data = await axios.get(`https://jsonplaceholder.typicode.com/comments`)
    const checkData = await data.data.find(val => {
      return val.id === id
    })
    if (validate.isEmpty(checkData)) {
      return wrapper.error(res, false, 'Data not found', 404)
    }

    const payload = {
      postId: parseInt(req.query.postId),
      id: checkData.id,
      name: req.query.name,
      email: req.query.email,
      body: req.query.body,
    }

    const insert = await modelComment.create(payload)
    if (insert.err) {
      return wrapper.error(res, false, 'Internal server error', 500)
    }

    delete payload.id
    return wrapper.data(res, true, payload, 'Updatert data comment success')

  }

  const updating = await modelComment.update(payload, {
    where: {
      id
    }
  })
  if (updating.err) {
    return wrapper.error(res, false, 'Internal server error', 500)
  }
  return wrapper.data(res, true, payload, 'Updatert data comment success')
})



module.exports = router;