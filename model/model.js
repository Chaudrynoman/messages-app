const mongo = require('mongoose');
const logger = require('../logger/app.js');
const redisClient = require('redis').createClient;
const redis = redisClient(6379, 'localhost');
const {postsSchema} = require('./chatbox.js');
// connect to MongoDB
var dbo = null;
try{
    mongo.connect('mongodb://localhost:27017/chatbox', {
        useNewUrlParser: true
    }, async (err, db) => {
        if (err) {
            logger.error(err);
            process.exit(0);
        }
        logger.info('connected to the database');
    });
    redis.on("connect",async () => {
        logger.info('connected to Redis');
    });
    function getArticle(id) {
        return new Promise((resolve, reject) => {
            redis.lrange(`${id}`,"0","-1",(err, reply) => {
                if(err) {
                    logger.error(err);
                } else if(reply) {
                    resolve(reply);
                } else {
                    postsSchema.find({
                        key: id
                    },(err, articleData) => {
                        if(err) {
                            return reject(err);
                        }
                        if(articleData.length > 0) {
                            // set in redis
                            const messages=articleData[0].message;
                            messages.forEach(element => {
                                redis.rpush(id, element);
                            });
                            resolve(messages);
                        }
                        resolve(articleData);
                    });
                }
            });
        });
    }
}
catch(err){
    logger.error(err);
}
module.exports = {
    getArticle: getArticle
};