const http =require('http');
const fs=require('fs');
const _=require('lodash');


const server=http.createServer((req,res)=>{
    //console.log(req.url,req.method);

    const num=_.random(0,20);
    console.log(num);
    const greet= _.once(()=>{
        console.log('hello');
    });
    greet();
    //greet();
    res.setHeader('Content-Type','text/html');
    let path='./views';
    switch(req.url){
        case '/':
            path=path+'/index.html';
            break;
        case '/about':
            path=path+'/about.html';
            break;
        default:
            path=path+'/404.html';
            res.statusCode=404;
            break;
    }

    fs.readFile(path,(err,data)=>{
        if(err){
            console.log(err);
            res.end();
        }else{
            //res.write(data);
            res.end(data);
        }
    });
});

server.listen(3000,'localhost',()=>{
    console.log('listening for requests on port 3000');
});