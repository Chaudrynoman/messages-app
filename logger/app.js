const buildDevLogger=require('./dev-logger');
const buildProLogger=require('./prod-logger');

let logger=null;

if(process.env.NODE_ENV === 'production') {
    logger=buildDevLogger();
}
else{
    logger=buildProLogger();
}
module.exports=logger;