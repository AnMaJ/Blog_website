const morgan=require('morgan');
const express=require('express');
const app = express();
const mongoose =require('mongoose');
const Blog = require('./models/blogs');
const cookieParser=require('cookie-parser');
const blogRoutes=require('./routes/blog_routes');
const authRoutes=require('./routes/auth_routes');
const { requireAuth,checkUser }=require('./middleware/auth_middleware');

const dbURI = "mongodb+srv://Jerry:1234map@cluster0.1anwk.mongodb.net/Jerr's_blogs?retryWrites=true&w=majority";
mongoose.connect(dbURI, {useNewUrlParser: true,useUnifiedTopology: true}).then((result)=> app.listen(3000)).catch((err)=>console.log(err));

app.set('view engine','ejs');

//static files and function invocations
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.get('*',checkUser);
app.get('/add-blog',(req,res)=>{
    const blog=new Blog({
        title:'new blog 2',
        snippet:'more about my new blog',
        body: 'hey that is my blog'
    });
    blog.save()
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        console.log(err);
    });
});

app.get('/all-blogs',(req,res)=>{
    Blog.find()
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.get('/single-blog',(req,res)=>{
    Blog.findById("61e2b1b157215531b309e4b9")
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.get('/',(req,res)=>{
    res.redirect('/blogs');
    //sets uo status code as well as header
});
app.get('/about',(req,res)=>{
    res.render('about',{title: 'About'});
});
app.use('/blogs',blogRoutes);
app.use(authRoutes);
app.use('/set-cookies',(req,res)=>{
    //res.setHeader('Set-Cookie','newUser=true');
    res,cookie("newUser",true, {maxAge: 1000*60*60*24, httpOnly: true});
    res.send('you got the cookie');
});
app.get('/read-cookies',(req,res)=>{
    const cookies=req.cookies;
    console.log(cookies.newUser);
    res.json(cookies);
});

app.use((req,res)=>{
    res.status(404).render('404',{title: '404 page'});
});