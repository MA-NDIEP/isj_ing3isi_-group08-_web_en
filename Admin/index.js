// script.js
document.addEventListener('DOMContentLoaded', () => {
    let db;
    const request = indexedDB.open('dashboardDB', 1);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const objectStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('Teacher', 'Teacher', { unique: false });
        objectStore.createIndex('Catalogue', 'Catalogue', { unique: false });
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        displayData();
    };

    request.onerror = (event) => {
        console.error('Database error:', event.target.errorCode);
    };

    document.getElementById('userForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const Teacher = document.getElementById('Teacher').value;
        const Catal = document.getElementById('Catalogue').value;
        addUser({ name, age });
    });

    function addUser(user) {
        const transaction = db.transaction(['users'], 'readwrite');
        const objectStore = transaction.objectStore('users');
        const request = objectStore.add(user);

        request.onsuccess = () => {
            displayData();
            document.getElementById('userForm').reset();
        };

        request.onerror = (event) => {
            console.error('Add user error:', event.target.errorCode);
        };
    }

    function displayData() {
        const transaction = db.transaction(['users'], 'readonly');
        const objectStore = transaction.objectStore('users');
        const request = objectStore.getAll();

        request.onsuccess = (event) => {
            const users = event.target.result;
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
        };
    }

    window.deleteUser = (id) => {
        const transaction = db.transaction(['users'], 'readwrite');
        const objectStore = transaction.objectStore('users');
        objectStore.delete(id).onsuccess = () => {
            displayData();
        };
    };
});
