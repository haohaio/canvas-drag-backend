const path = require('path')

var app = {
  port: '3000',
  logPath: path.resolve(__dirname, './logs/koa-template.log'),
  mongoDB: {
    database: 'web',
    host: '127.0.0.1',
    port: 27017,
  },
}

module.exports = app
