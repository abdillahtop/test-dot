const Sequelize = require('sequelize');
const db = require('../config/database');

const dot = db.define('comment', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  postId: {
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  body: {
    type: Sequelize.STRING
  }
});

dot.sync().then(() => {
  console.log('table created');
});

module.exports = dot;