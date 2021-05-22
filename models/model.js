const Sequelize = require('sequelize');
const db = require('../config/database');

const dot = db.define('posts', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER
  },
  title: {
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