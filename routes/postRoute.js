const express = require('express');

const path = require('path');
const router = express.Router()
const Post = require('../models/post')


const { upload } = require("../config/cloudinary");







router.get('/', async (req, res) => {
    let posts = await Post.find()
    res.render('index', { posts })
})





router.get('/post/new', (req, res) => {
    res.render('newPost');
})



router.post('/post/new', upload.single('photo'), async (req, res) => {
    const { type, title, description, location, contact, authorEmail } = req.body;


    const photoUrl = req.file ? req.file.path : "";
    console.log("🧩 Type of req.file:", typeof req.file);
    console.log("🧩 req.file full JSON:", JSON.stringify(req.file, null, 2));
    console.log("🧩 req.file raw (no stringify):", req.file);



    const newPost = new Post({
        type,
        title,
        description,
        location,
        contact,
        photoUrl,
        authorEmail


    });
    await newPost.save();
    console.log("🧩 typeof req.file:", typeof (req.file));

    res.redirect('/')



})

router.post('/post/:id/delete', async (req, res) => {
    const { email } = req.body;
    const post = await Post.findById(req.params.id);

    if (post.authorEmail === email) {
        await Post.findByIdAndDelete(req.params.id);
        res.send('Post deleted successfully!');
    } else {
        res.send('Error: Email does not match. Cannot delete this post.');
    }
});


router.get('/post/:id', async (req, res) => {

    const post = await Post.findById(req.params.id);
    if (!post) return res.error(404).send('the post you are looking for doesnt exist')

    res.render('postDetails', { post: post })



})


module.exports = router;