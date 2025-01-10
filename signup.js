let db;
const request = indexedDB.open('myDatabase', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    const store = db.createObjectStore('myStore', { keyPath: 'id', autoIncrement: true });
    store.createIndex('email', 'email', { unique: false });
    store.createIndex('name', 'name', { unique: false });
    store.createIndex('password', 'password', { unique: false });
    store.createIndex('confirm', 'confirm', { unique: false });
};

        request.onsuccess = function(event) {
            db = event.target.result;
        };

        request.onerror = function(event) {
            console.error('Database error:', event.target.errorCode);
        };

        document.getElementById('addElementForm').onsubmit = function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const name = document.getElementById('name').value;
            const password = document.getElementById('password').value;
            const confirm = document.getElementById('confirm').value;
            addElement({ email, name, password, confirm });
        };

        function addElement(element) {

            const transaction = db.transaction(['myStore'], 'readwrite');
            alert('jdfkfvkl');
            const store = transaction.objectStore('myStore');

            store.add(element);
            transaction.oncomplete = function() {
                alert('Element added successfully!');
                document.getElementById('addElementForm').reset();
            };
        }