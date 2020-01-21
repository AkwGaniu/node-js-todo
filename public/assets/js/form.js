// Form Input handle
let nameField =  document.querySelector("#name")
let emailField = document.querySelector("#email")
let passField = document.querySelector("#pass")
let passConfirmField = document.querySelector("#passConfirm")
let submit = document.querySelector("#submit")
let login = document.querySelector("#login")
let userId
// 	// Defining error variables with a default value
let nameErr = emailErr = passErr  = passConfirmErr = true;


//// On submission of the form
if(submit) {
    submit.addEventListener("click", () => {
        generalValidation()
    })
}

if(login) {
    login.addEventListener("click", () => {
        generalLoginValidation()
    })
}


//Print Error message
const printError = (elementId, msg) => {
    document.querySelector(elementId).innerHTML = msg
}


//Name Validation
const validName = () => {
    let name = nameField.value

    if(name === "") {
        printError("#nameError", "Please enter your full name");
    } else {
        var regex = /^[a-zA-Z\s]+$/;                
        if(regex.test(name) === false) {
            printError("#nameError", "Please enter a valid name");
        } else {
            printError("#nameError", "");
            nameErr = false;
        }
    }
    return name
}


//Email  Validation
const validEmail = () => {
    let email = emailField.value

    if(email === "") {
        printError("#emailError", "Please enter your email address");
    } else {
        // Regular expression for basic email validation
        var regex = /^\S+@\S+\.\S+$/;
        if(regex.test(email) === false) {
            printError("#emailError", "Please enter a valid email address");
        } else{
            printError("#emailError", "");
            emailErr = false;
        }
    }
    return email
}

const validLoginEmail = () => {
    let email = emailField.value
    if(email === "") {
        emailField.style.border = "1.5px solid red"
    } else {
        // Regular expression for basic email validation
        var regex = /^\S+@\S+\.\S+$/;
        if(regex.test(email) === false) {
            emailField.style.border = "1.5px solid red"
        } else{
            emailField.style.border = "1.5px solid green"
            emailErr = false;
        }
    }
    return email

}


// Password validation
const validPassword = () => {
    let password = passField.value

    if(password === "") {
        printError("#passError", "Please enter a Password");
        passField.style.border = "1.5px solid red"
    } else {
        let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

        if (regex.test(password) === false) {
            printError("#passError", "Please enter a Password of at least one number, upprercase letter \n\r and special symbol which is not less than 8 characters");
            passField.style.border = "1.5px solid red"
        } else {
            passField.style.border = "1.5px solid green"
            printError("#passError", "")
            passErr = false
        }
    }

    return password
}

const validLoginPassword = () => {
    let password = passField.value
    if(password === "") {
        passField.style.border = "1.5px solid red"
    } else {
        let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

        if (regex.test(password) === false) {
            passField.style.border = "1.5x solid red"

        } else {
            passField.style.border = "1.5px solid green"
            passErr = false
        }
    }

    return password
}


// Confirm password
const validPasswordConfirm = () =>  {
    let confirmPass = passConfirmField.value
    let currentPassword = validPassword()

    if(confirmPass === currentPassword) {
        printError("#passConfirmError", "")
        passConfirmErr = false

    } else {
        printError("#passConfirmError", "This password does not match the initial Password")
    }

}


//General Validation
const generalValidation = () => {
    let name = validName()
    let email = validEmail()
    let password = validPassword()
    validPasswordConfirm()

    if( nameErr === false && emailErr === false && passErr  === false && passConfirmErr ===  false) {
        let url = "/register"
        let data = {
            name: name,
            email: email,
            password: password
        }
        let regReq = {
            method: "post",
            body: JSON.stringify(data),
            headers: {"Content-Type": "application/json"}
        }

        fetch(url, regReq)
        .then(resp => {
            if(resp.ok) {
                return resp.json()
            } else {
                return Promise.reject("Oops... An error occured. Please try again")
            }
        })
        .then(data => {
            if (data === "Success") {
                alert("Registration Successful, proceed to login")
                self.location = "/"
            }
        })
        .catch(error => {
            alert(error)
        })
        nameErr = emailErr = passErr  = passConfirmErr = true;
    } else {
        alert("Please check the form and do the needful")
        nameErr = emailErr = passErr  = passConfirmErr = true;
    }
}


const generalLoginValidation = () => {
    let email = validLoginEmail()
    let password = validLoginPassword()

    if(emailErr === false && passErr  === false) {
        let url = "/"
        let data = {
            email: email,
            password: password
        }
        
        let regReq = {
            method: "post",
            body: JSON.stringify(data),
            headers: {"Content-Type": "application/json"}
        }

        fetch(url, regReq)
        .then(resp => {
            if(resp.ok) {
                return resp.json()
            } else {
                return Promise.reject("Email or password incorrect, Please check your input and try again")
            }
        })
        .then(data => {
            self.location = "/todo"
        })
        .catch(error => {
            alert(error)
        })
        nameErr = emailErr = passErr  = passConfirmErr = true;
    } else {
        alert("Please provide valid login details")
        nameErr = emailErr = passErr  = passConfirmErr = true;
    }
}


const resetPassword = () => {
    let email = validLoginEmail()
    if(emailErr === false) {

        let data = {
            email: email
        }
        let = url = "/passReset"
        let regReq = {
            method: "post",
            body: JSON.stringify(data),
            headers: {"Content-Type": "application/json"}
        }

        fetch(url, regReq)
        .then(resp => {
            if(resp.ok) {
                return resp.json()
            } else {
                return Promise.reject("Oops... An error occured. Please check your network and try again")
            }
        })
        .then(data => {
            if(data === "emailNotExist") {
                alert("Please Enter the email address you registered with")
            }
            else if(data.code) {
                console.log(data)
                alert("Could not connect to the email server at the moment. please check your connection and try again")
                
            } else if (data.accepted) {
                alert("Password reset link sent. check your mail for the reset link")
                self.location = "/"
            } else {
                alert("Ooops!!!. Something went wrong, Please try again")
                self.location = "/"
            }
        })
        .catch(error => {
            alert(error)
        })
        nameErr = emailErr = passErr  = passConfirmErr = true;
    } else {
        alert("Please enter the email address you registered with")
        nameErr = emailErr = passErr  = passConfirmErr = true;
    }
}


const verifyToken = () => {
    let passwordField = document.querySelectorAll('.hide')
    let tokenField = document.querySelectorAll('.jwt')

    
    let token = document.querySelector("#token").value
    if(token !== "") {
        let data = {
            passToken: token
        }
        let = url = "/validate-token"
        let regReq = {
            method: "post",
            body: JSON.stringify(data),
            headers: {"Content-Type": "application/json"}
        }

        fetch(url, regReq)
        .then(resp => {
            if(resp.ok) {
                return resp.json()
            } else {
                return Promise.reject("Oops... Token Expired, Please start the process again.")

            }
        })
        .then(data => {

            for (let pass of passwordField) {
                pass.classList.remove("hide")
                pass.classList.add("show")
            }

            for (let token of tokenField) {
                token.classList.add("hide")
            }
             userId = data.userId
        })
        .catch(error => {
            alert(error)
            self.location = "/"
        })
    } else {
        alert("Paste your password reset key to continue")
    }
}

const changePassword = () => {

    let pass = validPassword()
    validPasswordConfirm()

    
    if(pass !== "") { 
        let data = {
            password: pass,
            userId: userId
        }
        let = url = "/update-pass"
        let regReq = {
            method: "post",
            body: JSON.stringify(data),
            headers: {"Content-Type": "application/json"}
        }

        fetch(url, regReq)
        .then(resp => {
            if(resp.ok) {
                return resp.json()
            } else {
                return Promise.reject("Oops... Something went wrong, please try again.")
            }
        })
        .then(data => {
            alert("Password changed successfull, proceed to log in")
            self.location = "/"
        })
        .catch(error => {
            alert(error)
        })
    } else {
        alert("Both fields are required")
    }
}