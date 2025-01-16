document.getElementById('elementForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const element = {
      name: document.getElementById('name').value,
      password: document.getElementById('password').value,
      attribute1: document.getElementById('attribute1').value,
      attribute2: document.getElementById('attribute2').value,
      attribute3: document.getElementById('attribute3').value
    };
    localStorage.setItem(element.name, JSON.stringify(element));
    alert('Element saved!');
  });


  window.onload = function() {
    const tableBody = document.getElementById('elementsTable').getElementsByTagName('tbody')[0];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const element = JSON.parse(localStorage.getItem(key));
      const row = tableBody.insertRow();
      row.insertCell(0).innerText = element.name;
      row.insertCell(1).innerText = element.attribute1;
      row.insertCell(2).innerText = element.attribute2;
      row.insertCell(3).innerText = element.attribute3;
    }
  };

//login form for experiment
  document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('loginName').value;
    const password = document.getElementById('loginPassword').value;
    const element = JSON.parse(localStorage.getItem(name));
    if (!element) {
      alert('No such account');
    } else if (element.password !== password) {
      alert('Wrong password');
    } else {
      window.location.href = 'Admin.html'; // Redirect to Page 2
    }
  });
