//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const mongoose=require("mongoose");
const ejs = require("ejs");
const encrypt=require("mongoose-encryption");
const app = express();
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/usersDB");
const userschema=new mongoose.Schema({
    email: String,
    password:String
});

const secret="Thisisourlittlesecret";
userschema.plugin(encrypt,{secret:process.env.SECRET , encryptedFields:["password"]});
const User=mongoose.model("User",userschema);


app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({

  extended: true

}));



app.get("/", function(req, res){

  res.render("home");

});



app.get("/login", function(req, res){

  res.render("login");

});



app.get("/register", function(req, res){

  res.render("register");

});

app.get("/logout", function(req, res){

  res.render("home");

});


app.post("/register",function(req,res)
{
    const newuser=new User(
        {
            email:req.body.username,
            password: req.body.password
        }
    );
    newuser.save(function(err)
    {
      if(err)
      {
        res.send(err);
      }
      else res.render("secrets");
    });
});
app.post("/login",function(req,res)
{
    User.findOne({email:req.body.username},function(err,result)
    {
        if(result)
        {   if(result.password===req.body.password)
              res.render("secrets");
            else res.redirect("/login");
        }
        else
        res.redirect("/login");
    })
})





app.listen(3000, function(){

  console.log("Server started on port 3000.");

});

