document.addEventListener('DOMContentLoaded', () => {
    displayData();
    populateCatalogueDropdown();

    function showPopup() {
        document.querySelector('.popup').classList.add('active');
    }

    function closePopup() {
        document.querySelector('.popup').classList.remove('active');
    }

    window.showPopup = showPopup;
    window.closePopup = closePopup;

    window.addElement = function() {
        const name = document.getElementById('name').value;
        const teacher = document.getElementById('teacher').value;
        const catalogue = document.getElementById('catalogue').value;
        if (name && teacher && catalogue) {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = { id: users.length ? users[users.length - 1].id + 1 : 1, name, teacher, catalogue };
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            displayData();
            closePopup();
        } else {
            alert('Please fill in all fields');
        }
    };

    function displayData() {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const tbody = document.querySelector('#dashboardTable tbody');
        tbody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.teacher}</td>
                <td>${user.catalogue}</td>
                <td><button onclick="deleteUser(${user.id})">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    }

    window.deleteUser = function(id) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(user => user.id !== id);
        localStorage.setItem('users', JSON.stringify(users));
        displayData();
    };

    function populateCatalogueDropdown() {
        const catalogueDropdown = document.getElementById('catalogue');
        let catalogues = JSON.parse(localStorage.getItem('catalogues')) || [];
        catalogueDropdown.innerHTML = '';
        catalogues.forEach((catalogue, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = catalogue;
            catalogueDropdown.appendChild(option);
        });
    }
});
