var vars = require('./vars');

if (process.env.NODE_ENV === 'test'){
  module.exports = require('./test/config');
  return;
}

module.exports = {
  mongo_url: process.env.MONGOHQ_URL || 'mongodb://localhost:27017/gtfs',
  agencies: vars.agencies
};
