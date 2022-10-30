const express = require("express");
const app = express();
const PORT = 5000;
const http = require("http");
const socketio = require("socket.io");
const models = require('./model/model.js');
const userRoutes = require('./routes/user');
const isauth=require('./middleware/is-auth');
const redis = require("redis");
const compression = require('compression')
const client = redis.createClient();
const server = http.createServer(app);
const io = socketio(server).listen(server);
require('./third-party/schedule');
const logger = require('./logger/app');
let romm1;
let romm2;
let newromm;
try{
    app.set("view engine", "ejs");
    app.use(compression());
    app.use(express.urlencoded({ extended: false }));
    app.use(userRoutes);
    io.on("connection", async socket => {
        sendMessage(socket);
        socket.on("message", ({ message, from }) => {
            client.rpush(`${newromm}`, `${from}:${message}`);
            io.emit("message", { newromm,from, message });
        });
    });
    server.listen(PORT, () => {
        logger.log('info',`Server at ${PORT}`);
    });
    async function sendMessage(socket) {
        const articleData = await models.getArticle(newromm);
        if(articleData.length>0){
            articleData.forEach(element => {
                const usernameMessage = element.split(":");
                const redisUsername = usernameMessage[0];
                const redisMessage = usernameMessage[1];
                socket.emit("message", {
                    romm: newromm,
                    from: redisUsername,
                    message: redisMessage
                });
            });
        }
    }
    app.get("/chat",isauth, async(req, res) => {
        const username1 = req.query.username1;
        const username2=req.query.username2;
        romm1=username1+username2;
        romm2=username2+username1;
        await client.exists(`${romm1}`,(err,data)=>{
            if(data===1){
                logger.info("exist");
                newromm=romm1;
                logger.info(newromm);
                res.render("chat", { username1, username2 });
            }
            else{
                client.exists(`${romm2}`, (err,data)=>{
                    if(data===1){
                        logger.info("exist2");
                        newromm=romm2;
                        logger.info(newromm);
                        res.render("chat", { username1, username2 });
                    }
                    else{
                        logger.info("not exist newly added!");
                        newromm=romm1;
                        logger.info(newromm);
                        io.emit("joined", username1);
                        res.render("chat", { username1, username2 });
                    }
                });     
            }
        }); 
    });
}
catch(err){
    logger.error(err);
}
