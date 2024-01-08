if (document.readyState !== "loading") {
    initializeCodeRegister();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCodeRegister();
    });
  }
  
  function initializeCodeRegister() {
    document.getElementById("register-form").addEventListener("submit", onSubmit);
}


function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    fetch("/api/user/register/", {
        method: "POST",
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.errors) {
                document.getElementById("error").innerHTML = "Password is not strong enough";
            }  else if (data.email) {
                document.getElementById("error").innerHTML = "Email already in use";
            } else if (data.success) {
                window.location.href="http://localhost:3000/login.html";
            }
        })

    }