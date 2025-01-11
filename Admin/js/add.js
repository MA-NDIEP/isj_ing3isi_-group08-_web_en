let db;
const request = indexedDB.open('myDatabase', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    const store = db.createObjectStore('myStore', { keyPath: 'id', autoIncrement: true });
    store.createIndex('topic', 'topic', { unique: false });
    store.createIndex('name', 'name', { unique: true });
    store.createIndex('password', 'password', { unique: false });
};

request.onsuccess = function(event) {
    db = event.target.result;
};

request.onerror = function(event) {
    console.error('Database error:', event.target.errorCode);
};

document.getElementById('addElementForm').onsubmit = function(event) {
    event.preventDefault();
    const topic = document.getElementById('topic').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const content = document.getElementById('content').value;
    addElement({ topic, name, password, content });
};

function addElement(element) {
    const transaction = db.transaction(['myStore'], 'readwrite');
    const store = transaction.objectStore('myStore');
    store.add(element);
    transaction.oncomplete = function() {
        alert('Element added successfully!');
        document.getElementById('addElementForm').reset();
    };
}
