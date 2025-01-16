

    let eyeicon = document.getElementById("hide");
    let password = document.getElementById("password");


         eyeicon.onclick = function () {
         if (password.type == "password") {
          password.type = "text"
             } else {
            password.type = "password"
              }
            }

    document.getElementById("loginform").addEventListener("submit", function(event){
      event.preventDefault();
      var username = document.getElementById("Username").value;


      var password = document.getElementById("password").value;

      var user = localStorage.getItem(username);

      if(user){
        var parsedUser = JSON.parse(user);
        if(parsedUser.password === password){
          localStorage.setItem("user", JSON.stringify(parsedUser));
          window.location.href = "./course.html";
        }else{
          alert("Incorrect pasword");
        }
      }else{
        alert("user not found");
      }

    });

