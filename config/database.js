const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

module.exports =  new Sequelize('dot','root','', {
  host: 'localhost',
  dialect: 'mysql'
});