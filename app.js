const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lorem Ipsum Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const postSchema = {
  title: String,
  body: String
};
const Post = mongoose.model("Post", postSchema);


const userdataSchema = {
  firstName: String,
  lastName: String,
  gmail: String,
  password: String,
  age:Number,
  gender:String
};
const Userdata = mongoose.model("Userdata", userdataSchema);




app.get("/", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const userdata = new Userdata({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    gmail: req.body.gmail,
    password: req.body.password,
    age: req.body.age,
    gender:req.body.gender
  });
  userdata.save();
  res.render("success");

});


app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {
  Userdata.find({}, function(err, userdatas) {
    const gmail = req.body.gmail;
    const password = req.body.password;

    userdatas.forEach(function(userdata) {
      if ((gmail === userdata.gmail) && (password === userdata.password)) {
        res.redirect("/home");
      }
      else{
        console.log(err);
      }
    });
    res.render("failure");
  });
});


app.get("/home", function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/posts/:postName", function(req, res) {

  Post.find({}, function(err, posts) {
    const requestedTitle = _.lowerCase(req.params.postName);

    posts.forEach(function(post) {
      const storedTitle = _.lowerCase(post.title);

      if (storedTitle === requestedTitle) {
        res.render("post", {
          title: post.title,
          body: post.body
        });
      }
    });
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    body: req.body.postBody
  });
  post.save();
  res.redirect("/home");
});

app.get("/profile", function(req, res) {
  res.render("profile");
});




app.listen(1234, function() {
  console.log("Server started on port 1234");
});
