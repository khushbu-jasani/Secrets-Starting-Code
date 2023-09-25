//jshint esversion:6
import 'dotenv/config';
import express  from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import md5 from "md5";


const app = express();

console.log(md5("123456"));

app.use(express.static("public"));
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});

const userschema = new mongoose.Schema ({
    email: String,
    password: String
});


const User = new mongoose.model("User", userschema);



app.get("/", function(req, res){
    res.render("home");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/register", function(req, res){
    const newUser= new User({
    email: req.body.username,
    password: md5(req.body.password)
    });
    newUser.save().then(() =>{
        res.render("secrets");
    }).catch((err) =>{
        console.log(err);
    })
    });

    app.post("/login", function(req, res){
        const username = req.body.username;
        const password = md5(req.body.password)

        User.findOne({email: username}).then((foundUser) =>{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        })
        .catch((error) =>{
            console.log(error);
        });
    });



app.listen(3000, function(){
    console.log("Server started on port 3000.");
});
