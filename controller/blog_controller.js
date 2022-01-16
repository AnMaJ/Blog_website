const Blog = require('../models/blogs');

const blog_index =(req,res)=>{
    Blog.find()
    .sort({createdAt:-1})
    .then((result)=>{
        res.render('index',{title: 'All Blogs',blogs:result});
    })
    .catch((err)=>{
        console.log(err);
    });
}

const blog_details= (req,res)=>{
    const id=req.params.id;
    Blog.findById(id)
    .then((result)=>{
        res.render('details',{blog: result,title:"Blog Details"});
    })
    .catch((err)=>{
        res.render('404',{title: 'Blog not found :('})
        console.log(err);
    });
}

const post_blog= (req,res)=>{
    const blog=new Blog(req.body);
    blog.save()
    .then((result)=>{
        res.redirect('/blogs');
    })
    .catch((err)=>{
        console.log(err);
    })
}

const create_blog=(req,res)=>{
    res.render('create',{title: 'Create your own blog'});
}

const delete_blog=(req,res)=>{
    const id=req.params.id;
    Blog.findByIdAndDelete(id)
    .then((result)=>{
        res.json({redirect:'/blogs'});
    })
    .catch((err)=>{
        console.log(err);
    });
}
module.exports={
    blog_index,
    blog_details,
    post_blog,
    create_blog,
    delete_blog
}