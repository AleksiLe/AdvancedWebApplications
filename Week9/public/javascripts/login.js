if (document.readyState !== "loading") {
    initializeCodeLogin();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCodeLogin();
    });
  }
  
  function initializeCodeLogin() {
    document.getElementById("login-form").addEventListener("submit", onSubmit);
}


function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    fetch("/api/user/login/", {
        method: "POST",
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if(data.token) {
                storeToken(data.token);
                window.location.href="http://localhost:3000/";
            } else {
                if (data.message) {
                    document.getElementById("error").innerHTML = "Invalid credentials";
                }  
            }

        })

}

function storeToken(token) {
    localStorage.setItem("auth_token", token);
}
