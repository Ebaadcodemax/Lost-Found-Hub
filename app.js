const express = require('express')

const bodyparser = require('body-parser')
const path = require('path')
const Post = require('./models/post')
const postRoutes=require('./routes/postRoute');
const app = express();


require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Atlas connected ✅"))
.catch(err => console.log("MongoDB connection error:", err));




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