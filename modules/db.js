const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const config = require('../config')

class DB {
  static instance = null

  static getInstance() {
    if (!DB.instance) {
      DB.instance = new DB()
    }

    return DB.instance
  }

  constructor() {
    this.dbClient = null
    this.connect()
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (this.dbClient) {
        return resolve(this.dbClient)
      }

      const url = 'mongodb://' + config.mongoDB.host + ':' + config.mongoDB.port

      // 连接数据库
      MongoClient.connect(url, (err, client) => {
        if (!err) {
          console.log('Connected successfully to server')
          const db = client.db(config.mongoDB.database)
          this.dbClient = db
          resolve(this.dbClient)
        } else {
          reject(err)
        }
      })
    })
  }

  find(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        const result = db.collection(collectionName).find(json)
        result.toArray((err, response) => {
          if (!err) {
            resolve(response)
          } else {
            reject(err)
          }
        })
      })
    })
  }

  insertOne(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).insertOne(json, (err, result) => {
          if (!err) {
            resolve(result)
          } else {
            reject(err)
          }
        })
      })
    })
  }

  insertMany(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).insertMany(json, (err, result) => {
          if (!err) {
            resolve(result)
          } else {
            reject(err)
          }
        })
      })
    })
  }

  update(collectionName, json, updateJson) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).updateOne(
          json,
          {
            $set: updateJson,
          },
          (err, result) => {
            if (!err) {
              resolve(result)
            } else {
              reject(err)
            }
          }
        )
      })
    })
  }

  deleteOne(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).deleteOne(json, (err, result) => {
          if (!err) {
            resolve(result)
          } else {
            reject(err)
          }
        })
      })
    })
  }

  deleteMany(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).deleteMany(json, (err, result) => {
          if (!err) {
            resolve(result)
          } else {
            reject(err)
          }
        })
      })
    })
  }

  // mongodb 里面查询 _id，把字符串转成对象
  getObjectID(id) {
    return new ObjectID(id)
  }
}

module.exports = DB.getInstance()
