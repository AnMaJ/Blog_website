const express=require('express');
const router=express.Router();
const Blog = require('../models/blogs');
const blogController= require('../controller/blog_controller');


router.get('/',blogController.blog_index);

router.get('/create',blogController.create_blog);

router.post('/',blogController.post_blog);

router.get('/:id',blogController.blog_details);

router.delete('/:id',blogController.delete_blog);

module.exports=router;