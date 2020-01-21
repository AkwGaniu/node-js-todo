var mongoose = require("mongoose")
var nodemailer = require("nodemailer")
let jwt = require('jsonwebtoken')
let bcrypt = require('bcryptjs')
var bodyParser = require("body-parser")


//CREATE USER SCHEMA
let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: {
        type: String,
        max: 225,
        min: 8
    }
})

//CREATE USER MODEL
let User = mongoose.model("User", userSchema)

// Create transporter for Email sending
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASS
    }
})

//Export module data to the core application
module.exports = function(app) {
    app.use(bodyParser.json())

    app.get("/register", function(req, res) {
        res.render("registration")
    })

    app.get("/passReset", function(req, res) {
        res.render("passReset")
    })

    app.get("/", function(req, res) {
        res.render("login")
    })

    app.get("/verify-user", function(req, res) {
        res.render("verifyToken")
    })

    app.post("/", async function(req, res) {
        //Get user details from the login page and validate the login
        const user = await User.findOne({email: req.body.email}, {name: false})
        if (!user) return res.status(404).json("Invalid email")

        // CONFIRM USER PASSWORD
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) return res.status(404).json("Invalid passsword")
        res.json("Success")
        
    })

    app.post("/passReset", function(req, res) {
        //Get user details from the login page and validate the login
        User.find({email: req.body.email}, {name: false, password: false}, (err, data) => {
            if(err) throw err
            if(data.length === 0) {
                res.status(200).json("emailNotExist")
            } else {
                //JWT TOKEN GENERATION
                const token = jwt.sign({userId: data[0]._id}, process.env.JSON_SECRET, {expiresIn: "32 minutes"})
                // Email configuration
                const emailConfig = {
                    from: process.env.SENDER_EMAIL,
                    to: data[0].email,
                    subject: "Password Reset Link",
                    html: `
                        <p style="background-color: grey; color: white; font-size: 18px">
                        Follow the link below to reset your password.\n
                        Copy the token below and use it to reset your password.
                        The token expires after 30 minutes counting from the moment you recieved this mail</p>
                        <p style="background-color: grey; color: blue; font-size: 16px">
                        ${token}\n 
                        Folow this link to <a href="http://localhost:3000/verify-user" target="_blank" rel="noopener noreferrer">Reset Password</a>
                        </p>
                        
                    `
                }

                transporter.sendMail(emailConfig, (err, info) => {
                    if(err) {
                        res.json(err)
                    } else {
                        res.json(info)
                    }
                })
            }
        })
        
    })

    app.post("/register", async function(req, res) {
        
        //HASH USER PASSWORD
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(req.body.password, salt)

        //Get user details from the form and update the database
        User.find({email: req.body.email}, {name: false, password: false}, (err, data)  => {
            if(err) throw err
            if(data.length === 0) {
                const record = {
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPass
                }

                User(record).save((err, data) => {
                if(err) throw err
                res.status(200).json("Success")
                })
            } else {
                res.status(200).json("Email already exist, Please proceed to login")
            }
        })
        
    })

    app.post("/validate-token", function(req, res) {
        try{
        let validToken = jwt.verify(req.body.passToken, process.env.JSON_SECRET)
        res.json(validToken)
        }
        catch(err) {
            res.status(400).json(err)
        }
        
 
    })

    app.post("/update-pass", async function(req, res) {
        let newPass = {password: req.body.password}
        let query = {_id: req.body.userId}
        
        await User.updateOne(query, newPass, (err) => {
            if (err) throw err
            res.status(200).json("1 record updated")
        })
 
    })
}