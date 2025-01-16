document.getElementById("addElementForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var username = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    var confirm = document.getElementById("confirm").value;
    var email = document.getElementById("email").value;

    if (password !== confirm) {
        alert("Passwords do not match.");
        return;
    }

    // Create a new user object
    const user = {
        username: username,
        password: password,
        email: email
    };

    // Fetch the existing student data from local storage
    let studentData = JSON.parse(localStorage.getItem("studentData")) || [];

    // Check if the username already exists
    if (studentData.some(student => student.key === username)) {
        alert("Username already exists. Please choose another.");
        return;
    }

    // Add the new student to the array
    studentData.push({ key: username });

    // Save the updated student data back to local storage
    localStorage.setItem("studentData", JSON.stringify(studentData));

    // Save the new user's detailed information in local storage
    localStorage.setItem(username, JSON.stringify(user));

    alert("Sign-up successful! Please login.");
    window.location.href = "./Login.html";
});
