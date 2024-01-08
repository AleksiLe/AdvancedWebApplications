if (document.readyState !== "loading") {
    initializeCodeLogin();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCodeLogin();
    });
  }
  
  
const container = document.getElementById('container')

function initializeCodeLogin() {
    const authToken = localStorage.getItem("auth_token");
    if(!authToken) return;
    console.log(authToken)
    fetch("/api/validateAuth", {
        method: "GET",
        headers: {
            "authorization": authToken
        }}).then(res => res.json())
        .then(res => {
            if (res.email != null) {
              container.innerHTML = `
                  <p>${res.email}</p>
                  <ul id="list"></ul>
                  <button id="logout">Log Out</button>
                  <input type="text" id="add-item" placeholder="Enter a todo">
                  `
              const logOutButton = document.getElementById('logout')
              logOutButton.addEventListener('click', () => {
                  localStorage.removeItem("auth_token");
                  window.location.href = "/"
              })
              const todoInput = document.getElementById('add-item')
              todoInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                  fetch("/api/todos", {
                    method: "POST",
                    headers: {
                      "authorization": authToken,
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      items: [todoInput.value]
                    })
                  })
                } 
              })
              const list = document.getElementById('list')
              fetch("/api/todos", {
                method: "GET",
                headers: {
                  "authorization": authToken
                }
              }).then(res => res.json())
              .then(res => {
                for(let i = 0; i < res.items.length; i++) {
                  let li = document.createElement('li')
                  li.innerHTML = res.items[i]
                  list.appendChild(li)
                }
              })
            }
        })


}



