var convict = require('convict');

var config = convict({
  flowthings: {
    account: 'account_name',
    token: 'accounttoken'
  }
});

module.exports = config;
