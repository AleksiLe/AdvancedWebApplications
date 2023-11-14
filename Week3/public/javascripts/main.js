const inputName = document.getElementById("input-name")
const inputTask = document.getElementById("input-task")
const submit = document.getElementById("submit-data")
const statusMsg = document.getElementById("status")

submit.addEventListener("click", () => {
    const name = inputName.value
    const task = inputTask.value
    fetch("/todo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name: name, todo: task})
    })
    .then((res) => res.json())
    .then((res) => {
        statusMsg.innerHTML = res.status
    }) 
})

const searchName = document.getElementById("search-name")
const searchButton = document.getElementById("search")
const result = document.getElementById("result")

searchButton.addEventListener("click", () => {
    const name = searchName.value
    fetch(`/user/${name}`)
    .then((res) => res.json())
    .then((res) => {
        if(res.status == "User not found") {
            result.innerHTML = "User not found!"
            return
        }
        const list = document.createElement('ul')
        list.innerHTML = ""
        for (let i = 0; i < res.todo.length; i++) {
            const li = document.createElement("li")
            li.addEventListener("click", () => {
                fetch('/user', {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({name: res.name, todo: res.todo[i]})
                })
                .then((res) => res.json())
                .then((res) => {
                    result.innerHTML = res.status
                    return
                })
            })
            li.setAttribute("id", "delete-task")
            li.setAttribute("class", "delete-task")
            li.innerHTML = res.todo[i]
            list.appendChild(li)
        }
        result.innerHTML = 'Name: ' + res.name
        const deleteButton = document.createElement("button")
        deleteButton.innerHTML = "Delete user"
        deleteButton.setAttribute("id", "delete-user")
        deleteButton.addEventListener("click", () => {
            fetch(`/user/${res.name}`, {
                method: "DELETE"
            })
            .then((res) => res.json())
            .then((res) => {
                result.innerHTML = res.status
                return
            })
        })
        result.appendChild(list)
        result.appendChild(deleteButton)
    }) 
})