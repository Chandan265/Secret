// Import required dependencies
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const ejs = require('ejs');

// Create an instance of the Express application
const app = express();

console.log(process.env.USER_APIV);
// Middleware
app.use(express.static("public"));
app.set('view engine', 'ejs'); // Set the view engine to EJS
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

mongoose.connect('mongodb://127.0.0.1/UserDB', {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
  email:String,
  password:String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

// Routes
app.get('/', (req, res) => {
  res.render("home");
});

app.get("/login",(req,res) =>{
  res.render("login");
});

app.get("/register", (req,res) => {
  res.render("register");
});

app.post("/register", async (req,res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  try{
      await newUser.save();
      res.render("secrets");
  }catch(err){
    console.error(err);
    res.send("err")
  }
});

app.post("/login", async (req,res) => {
  const Username = req.body.username;
  const password = req.body.password;
try{
  const foundUser = await User.findOne({ email: Username });
  if(foundUser && foundUser.password === password){
    res.render("secrets");
  }
}catch(err){
  console.log(err);
}

});



// Start the server
const port = 3000; // Choose a port number
app.listen(port, () => {
  console.log("Server started on port 3000");
});
