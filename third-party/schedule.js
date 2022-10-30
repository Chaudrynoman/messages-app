const schedule=require('node-schedule');
const {postsSchema} = require('../model/chatbox.js');
const redis = require("redis");
const client = redis.createClient();
try{
  schedule.scheduleJob('data-save-mongo','0 0 * * *',()=>{
    client.keys('*',(err,data)=>{
      logger.info(data);
      data.map(async x=>{
        client.lrange(`${x}`,"0","-1", async (err,data)=>{
          logger.info(data);
          const date=new Date();
          const newdata=await postsSchema.findOne({key: x});
          if(newdata){
            newdata.message=data;
            newdata.save();
          }
          else{
            const newmsg=new postsSchema({
              date:date,
              key:x,
              message:data
            });
            newmsg.save();
          }
        })
      });
    });
    logger.info("Time to save Data plz do this");
  });
}
catch(err){
  logger.error(err);
}
