const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
// connecting mongoose
mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});

// creating schema with mongoose

const postSchema=new mongoose.Schema({
  title:String,
  content:String
});
// Creating A mongoose  model 
const Post=mongoose.model("Post",postSchema);


// using lodash module that is installed via npm
const _=require("lodash");
// setting view engine to use ejs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
// to enable express to access local files other than just only main js file
app.use(express.static("public"));



const homeStarting="* Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta omnis, dolor saepe deserunt atque ipsa enim reiciendis neque minima libero excepturi magnam molestiae et? Veritatis corrupti quis exercitationem neque voluptatum?Natus quo, sit laborum itaque, libero minima dolores error non nobis fuga deserunt eos corrupti exercitationem quaerat adipisci, maiores velit! "
const aboutStarting="** Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta omnis, dolor saepe deserunt atque ipsa enim reiciendis neque minima libero excepturi magnam molestiae et? Veritatis corrupti quis exercitationem neque voluptatum?Natus quo, sit laborum itaque, libero minima dolores error non nobis fuga deserunt eos corrupti exercitationem quaerat adipisci, maiores velit! "
const contactStarting="*** Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta omnis, dolor saepe deserunt atque ipsa enim reiciendis neque minima libero excepturi magnam molestiae et? Veritatis corrupti quis exercitationem neque voluptatum?Natus quo, sit laborum itaque, libero minima dolores error non nobis fuga deserunt eos corrupti exercitationem quaerat adipisci, maiores velit! "

// setting up the get requests
app.get("/",function(req,res){

// rendering ejs files with dynamic contents from data in DB
// here posts in below function is array of post document created when a post is composed .
// Reading from DB 
Post.find({},function(err,posts){
    if(!err){
        res.render("home",{
            content:homeStarting,
            arrPosts:posts
        });
    }
     });
   

});

app.get("/about",function(req,res){
    res.render("about",{content:aboutStarting});
});

app.get("/contact",function(req,res){
    res.render("contact",{content:contactStarting});
});

app.get("/compose",function(req,res){
    res.render("compose");
});
// setting up the post requests
// post request from compose page.Each time triggered creates a post document and saves in DB

app.post("/compose",function(req,res){

// creating documents for collections

const post=new Post({
    title:(req.body.postTitle),
    content:(req.body.postContent)
 });

    post.save(function(err){
        if(!err){
          res.redirect("/");
       }
    });
 

});
// express routing Parameters
app.get("/posts/:postId",function(req,res){
// using lowdash functionality(lowerCase) for loewercasing string 
//   storing post id when clicked on link to redirect to a new post page based on id stored in params
    const reqId=(req.params.postId);
  
    Post.findOne({_id:reqId},function(err,post){
        if(!err){
            res.render("post",{separateTitle:post.title,separateContent:post.content});
        }
     
    });
});
// creating server port
app.listen(5000,function(){
    console.log("server is up and running");
});