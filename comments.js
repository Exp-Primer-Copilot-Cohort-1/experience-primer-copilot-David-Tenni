//create web server
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Comment = require('../models/comment');
var Post = require('../models/post');
var mongoose = require('mongoose');

//get comments
router.get('/comments', function(req, res, next){
    Comment.find(function(err, comments){
        if(err){return next(err);}
        res.json(comments);
    });
});

//post comments
router.post('/comments', function(req, res, next){
    var comment = new Comment(req.body);
    comment.save(function(err, comment){
        if(err){return next(err);}
        res.json(comment);
    });
});

//pre-load comment objects
router.param('comment', function(req, res, next, id){
    var query = Comment.findById(id);
    query.exec(function(err, comment){
        if(err){return next(err);}
        if(!comment){return next(new Error('can\'t find comment'));}
        req.comment = comment;
        return next();
    });
});

//get comment by id
router.get('/comments/:comment', function(req, res){
    res.json(req.comment);
});

//upvote comment
router.put('/comments/:comment/upvote', function(req, res, next){
    req.comment.upvote(function(err, comment){
        if(err){return next(err);}
        res.json(comment);
    });
});

//post comment on post
router.post('/posts/:post/comments', function(req, res, next){
    var comment = new Comment(req.body);
    comment.post = req.post;
    comment.save(function(err, comment){
        if(err){return next(err);}
        req.post.comments.push(comment);
        req.post.save(function(err, post){
            if(err){return next(err);}
            res.json(comment);
        });
    });
});

//pre-load post objects
router.param('post', function(req, res, next, id){
    var query = Post.findById(id);
    query.exec(function(err, post){
        if(err){return next(err);}
        if(!post){return next(new Error('can\'t find post'));}
        req.post = post;
        return next();
    });
});

//get post by id
router.get('/posts/:post', function(req, res){
    res.json(req.post);
});

//upvote post
router.put('/posts/:post/upvote', function(req, res, next){
    req.post.upvote(function(err, post){
        if