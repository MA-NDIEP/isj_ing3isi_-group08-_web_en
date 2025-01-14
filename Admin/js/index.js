// script.js
document.addEventListener('DOMContentLoaded', () => {
    displayData();

    document.querySelector('.view').addEventListener('click', function() {
        const catalogues = JSON.parse(localStorage.getItem('catalogues')) || [];
        const container = document.createElement('div');

        catalogues.forEach((catalogue, index) => {
            const catalogueDiv = document.createElement('div');
            catalogueDiv.textContent = catalogue;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                catalogues.splice(index, 1);
                localStorage.setItem('catalogues', JSON.stringify(catalogues));
                catalogueDiv.remove();
            });

            catalogueDiv.appendChild(deleteButton);
            container.appendChild(catalogueDiv);
        });

        document.querySelector('#h3').appendChild(container);
    });

    document.querySelector('.view').addEventListener('click', function() {
        document.querySelector('.container2').classList.toggle('active');
    });

    document.querySelector('.no-btn1').addEventListener('click', function() {
        document.querySelector('.container2').classList.remove('active');
    });




        // display catalogues
        const catalogueSelect = document.getElementById('Catalogue');
        const catalogues = JSON.parse(localStorage.getItem('catalogues')) || [];
        catalogues.forEach(catalogue => {
            const option = document.createElement('option');
            option.value = catalogue;
            option.textContent = catalogue;
            catalogueSelect.appendChild(option);
        });


        document.querySelector('#userForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const url = document.getElementById('url').value;
            const catalogue = document.getElementById('Catalogue').value;

            const videos = JSON.parse(localStorage.getItem('videos')) || [];
            videos.push({ name, url, catalogue});
            localStorage.setItem('videos', JSON.stringify(videos));

            alert('Course Save successfully!!');
        });



    function uploadCat(){
        let cat = JSON.parse(localStorage.getItem(Catalogue));
        const Option = document.getElementById('Catalogue');
        cat.forEach(item => {
            Option.innerHTML = `<option>${item.Catalogue}</option>`
        });
    }


    function addUser(user) {
        let users = JSON.parse(localStorage.getItem('videos')) || [];
        user.id = users.length ? users[users.length - 1].id + 1 : 1;
        users.push(user);
        localStorage.setItem('videos', JSON.stringify(users));
        displayData();
        document.getElementById('userForm').reset();
    }

    function displayData() {
        let users = JSON.parse(localStorage.getItem('videos')) || [];
        const tbody = document.querySelector('#dashboardTable tbody');
        tbody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.url}</td>
                <td>${user.Catalogue}</td>
                <td><button onclick="deleteUser(${user.id})">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    }



    /*function displayElements(filter = '') {
        let users = JSON.parse(localStorage.getItem('videos')) || [];
        const tbody = document.querySelector('#dashboardTable tbody');
        const elementList = document.getElementById('elementList');
        elementList.innerHTML = '';
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const element = JSON.parse(localStorage.getItem(key));
            if (filter && !Object.values(element).some(value => value.includes(filter))) {
                continue;
            }
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${element.name}</td>
                <td>${element.teacher}</td>
                <td>${element.catalogue}</td>
                <td><button onclick="deleteUser(${user.id})">Delete</button></td>

            `;
            elementList.appendChild(tr);
        }
    }*/

    //localStorage.setItem('key', 'naha')

    //window.onload = function() {
    //    displayElements(localStorage.getItem('key'));
    //};


    window.deleteUser = (id) => {
        let users = JSON.parse(localStorage.getItem('videos')) || [];
        users = users.filter(user => user.id !== id);
        localStorage.setItem('videos', JSON.stringify(users));
        displayData();
    };
});
