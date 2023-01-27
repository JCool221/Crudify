const { connect, connection } = require('mongoose');

connect('mongodb://localhost/crudapi_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
