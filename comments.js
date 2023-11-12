//create web server
var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');

//create server
var server = app.listen(3000, function () {
    console.log('Server is running..');
});

//set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//set static path
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

//connect to mongodbd
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/comments', { useNewUrlParser: true });

//create schema
var commentSchema = new mongoose.Schema({
    name: String,
    comment: String,
    created_at: { type: Date, default: Date.now }
});

//create model
var Comment = mongoose.model('Comment', commentSchema);

//create routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/comments', (req, res) => {
    Comment.find({}, (err, data) => {
        if (err) throw err;
        res.render('comments', { comments: data });
    });
});

app.post('/comments', (req, res) => {
    var newComment = Comment(req.body).save((err, data) => {
        if (err) throw err;
        res.json(data);
    });
});

app.delete('/comments/:id', (req, res) => {
    Comment.find({ _id: req.params.id }).deleteOne((err, data) => {
        if (err) throw err;
        res.json(data);
    });
});
