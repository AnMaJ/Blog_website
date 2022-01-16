const morgan=require('morgan');
const express=require('express');
const app = express();
const mongoose =require('mongoose');
const Blog = require('./models/blogs');
const blogRoutes=require('./routes/blog_routes');

const dbURI = "mongodb+srv://Jerry:1234map@cluster0.1anwk.mongodb.net/Jerr's_blogs?retryWrites=true&w=majority";
mongoose.connect(dbURI, {useNewUrlParser: true,useUnifiedTopology: true}).then((result)=> app.listen(3000)).catch((err)=>console.log(err));

app.set('view engine','ejs');

//static files
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'));

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
app.use((req,res)=>{
    res.status(404).render('404',{title: '404 page'});
});