const mongo = require('mongoose');
const redisClient = require('redis').createClient;
const redis = redisClient(6379, 'localhost');
const {postsSchema} = require('./chatbox.js');
// connect to MongoDB
var dbo = null;
mongo.connect('mongodb://localhost:27017/chatbox', {
    useNewUrlParser: true
}, (err, db) => {
    if (err) {
        console.log(chalk.red(err));
        process.exit(0);
    }
    console.log('connected to the database');
});

redis.on("connect", () => {
    console.log('connected to Redis');
});

function getArticle(id) {
    return new Promise((resolve, reject) => {
        redis.lrange(`${id}`,"0","-1",(err, reply) => {
            if(err) {
                console.log(err);
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

module.exports = {
    getArticle: getArticle
};