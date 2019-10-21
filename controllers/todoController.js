var mongoose = require("mongoose")
var bodyParser = require("body-parser")

//Create the database schema
let todoSchemma = new mongoose.Schema({
    item: String
})

//Create a models
var Todo = mongoose.model('Todo', todoSchemma)

//Export module data to the core application
module.exports = function(app) {
    app.use(bodyParser.json())

    app.get("/todo", function(req, res) {
        //Get items from the database and send them to the view
        Todo.find({}, function(err, data) {
            if(err) throw err
            res.render("todo", {todos: data})
        })
    })

    app.post("/todo", function(req, res) {
        // Get todo from the form and update the database
        Todo(req.body).save(function(err, data) {
            if(err) throw err
            res.json(data)
        })
    })

    app.delete("/todo", function(req, res) {
        //Get todos from the database and delete the specified todo
            let item =Todo.find({item: req.body.item.replace(/\-/g, " ")})
            
            item.deleteOne(function(err, data) {
            if(err) throw err
            res.json(data)
        })        
    })

    
}