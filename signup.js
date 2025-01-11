document.getElementById("addElementForm").addEventListener("submit", function(event){
    event.preventDefault();
    var username = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    var confirm = document.getElementById("confirm").value;
    var email = document.getElementById("email").value;

    if(password !== confirm){
        alert("passwords donot match");
        return;
    }
    const user = {
        username: username,
        password: password,
        email: email
    };
    localStorage.setItem(username, JSON.stringify(user));
    alert("sign up successful, please login")
    window.location.href = "./Login.html";
});