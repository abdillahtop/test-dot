
const eventHandler = require('./handler');

const init = () => {
  initEventListener();
};
const initEventListener = () => {
  eventHandler.insertDataPosts();
};

module.exports = {
  init: init
};
