const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router()
const Post = require('../models/post')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // save in public/images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique filename
    }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Only images allowed!');
    }
};

const upload = multer({ storage, fileFilter });







router.get('/', async (req, res) => {
    let posts = await Post.find()
    res.render('index', { posts })
})





router.get('/post/new', (req, res) => {
    res.render('newPost');
})



router.post('/post/new', upload.single('photo'), async (req, res) => {
    const { type, title, description, location, contact, authorEmail } = req.body;
    let photoUrl = '';
    if (req.file) {
        photoUrl = '/images/' + req.file.filename;
    }


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
    res.redirect('/')


})

router.post('/post/:id/delete', async (req, res) => {
    const { email } = req.body; 
    const post = await Post.findById(req.params.id);

    if(post.authorEmail === email) {
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