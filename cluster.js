const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const index=require('./index');

if(cluster.isMaster){
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit',()=>{
        console.log(`worker died`);
        cluster.fork();
    });
}
else{
    index;
}