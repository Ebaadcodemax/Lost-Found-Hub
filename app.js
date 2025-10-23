const express = require('express')
const mongoose = require('mongoose');
const bodyparser = require('body-parser')
const path = require('path')
const Post = require('./models/post')
const postRoutes=require('./routes/postRoute');
const app = express();



mongoose.connect('mongodb://127.0.0.1:27017/losthub', {

}).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/', postRoutes);
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');



app.get('/', async (req, res) => {
    const posts=(await Post.find()).toSorted({datePosted:-1})
    res.render('index',{posts})
})





app.get('/post/new', (req, res) => {
    res.render('newPost');
})



app.post('/post/new', async (req, res) => {
    const{type, title, description, location, contact }=req.body;

    const newPost=new Post({
        type,
        title,description,
        location,
        contact

    });

    await newPost.save();
    res.redirect('/')


})


app.get('/post/:id', async (req, res) => {

    const post=await Post.findById(req.params.id);
    if(!post) return res.error(404).send('the post you are looking for doesnt exist')

    res.render('postDetails',{post:post})



})


app.listen(3000, () => {
    console.log('port started')
})