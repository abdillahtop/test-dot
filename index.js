const express = require('express');
const observer = require('./event/observer')

const db = require('./config/database');

db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes/main'));

const PORT = process.env.PORT || 9000;

app.listen(PORT, ()=> {
  observer.init()
  console.log(`Server started on port ${PORT}`)
});