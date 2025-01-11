// script.js
document.addEventListener('DOMContentLoaded', () => {
    displayData();

    document.getElementById('userForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const Teacher = document.getElementById('Teacher').value;
        const Catalogue = document.getElementById('Catalogue').value;
        addUser({ name, Teacher, Catalogue });
    });

    function addUser(user) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        user.id = users.length ? users[users.length - 1].id + 1 : 1;
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        displayData();
        document.getElementById('userForm').reset();
    }

    function displayData() {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const tbody = document.querySelector('#dashboardTable tbody');
        tbody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.Teacher}</td>
                <td>${user.Catalogue}</td>
                <td><button onclick="deleteUser(${user.id})">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    }

    window.deleteUser = (id) => {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(user => user.id !== id);
        localStorage.setItem('users', JSON.stringify(users));
        displayData();
    };
});
