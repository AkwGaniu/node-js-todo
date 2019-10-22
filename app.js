var express = require("express")
const dotenv = require('dotenv')
var todoController = require("./controllers/todoController")
var userRegController = require("./controllers/userRegController")
const mongoose = require('mongoose')

var app = express();

//Setting the view engine
app.set("view engine", "ejs")

//Set up the static files
app.use(express.static("./public"))

//Connect to database
mongoose.connect('mongodb://localhost:27017/todo', {useNewUrlParser: true}, {useUnifiedTopology: true})
mongoose.Promise = global.Promise
mongoose.connection.on("error", function(err) {
    console.error(err.message)
})
mongoose.connection.once("open", function() {
    console.log("We are connected")
})

//fire the controller functions
todoController(app)
userRegController(app) 

//CONFIGURE DOTENV
dotenv.config()

//Listen to a port 
const PORT = process.env.PORT || 3000

app.listen(PORT, (err) => {
    if(err) throw err
    console.log(`Wa are listening to port ${PORT}`)
})



