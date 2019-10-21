document.addEventListener("DOMContentLoaded", function() {

    var item = document.querySelector("#todo")
    var submit = document.querySelector("button")
    var todos = document.querySelectorAll("li")


    submit.addEventListener("click", function(e) {
        e.preventDefault()
        var todo = item.value
        if(todo === "") {
            alert("We cannot add an empty todo task")
        } else {
            var url = "/todo"

            let fetchData = {
                method: "post",
                body: JSON.stringify({item: todo}),
                headers: {"Content-Type": "application/json"}
            }
            
            fetch(url, fetchData)
            .then(response =>{
                if(response.ok) {
                    return response.json()
                } else {
                    return Promise.reject("Oops.. Something went wrong")
                }
            })
            .then(function(data) {
                location.reload()
            })
            .catch(function(error) {
                console.log(error)
            })
        }
    })

    todos.forEach(function(todo) {
       todo.addEventListener("click", function() {
        let confirmMsg = confirm(`Are you sure you want to delete this entry?`)
        
        if(confirmMsg) {
            var li = this.innerText.replace(/ /g, "-")
            var url = "/todo"

            let fetchData = {
                method: "delete",
                body: JSON.stringify({item: li}),
                headers: {"Content-Type": "application/json"}
            }

            fetch(url, fetchData)
            .then(response =>{
                if(response.ok) {
                    return response.json()
                } else {
                    return Promise.reject("Oops.. Something went wrong")
                }
            })
            .then(function(data) {
            location.reload()
            })
            .catch(function(error) {
                console.log(error)
            })

        } else {
            return
        }

        })
    })
})