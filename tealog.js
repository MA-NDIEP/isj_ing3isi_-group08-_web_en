
let eyeicon = document.getElementById("hide");
let password = document.getElementById("password");


     eyeicon.onclick = function () {
     if (password.type == "password") {
      password.type = "text"
         } else {
        password.type = "password"
          }
        }

const teachers = [{ teacher: "Dr NAHA", pass: "1234" },
{ teacher: "Dr KACFAH", pass: "5678" },
{ word: "Mr kougang", clues: "2468" },]

document.getElementById("login").addEventListener("submit", function(event){
    event.preventDefault();
    console.log(event)
    const username = document.getElementById("Username").value;
    console.log(username)
    const password = document.getElementById("password").value;
    isPresent = false;
    teachers.forEach(teachers => {
      if(teachers.teacher == username){
        if(teachers.pass == password){
          isPresent = true
        }
      }
    })
    if (isPresent) {

        window.location.href = "Webdev/html/work.html ";
      }else{
        alert("Incorrect identifications");
      }


 } );
