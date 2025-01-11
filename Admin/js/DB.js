// Open IndexedDB
const request = indexedDB.open('myData', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    const store = db.createObjectStore('Store', { keyPath: 'id', autoIncrement: true });
    store.createIndex('topic', 'topic', { unique: false });
};

request.onsuccess = function(event) {
    const db = event.target.result;
    displayItems(db);

    // Add item
    document.getElementById('addForm').onsubmit = function(event) {
        event.preventDefault();
        const topic = document.getElementById('topic').value;
        const content = document.getElementById('content').value;
        const transaction = db.transaction(['Store'], 'readwrite');
        const store = transaction.objectStore('Store');
        store.add({ topic: topic, content: content });
        transaction.oncomplete = function() {
            displayItems(db);
        };
    };
};

request.onerror = function(event) { console.error('Error fetching data:', event.target.errorCode); };

// Display items
function displayItems(db) {
    const transaction = db.transaction(['Store'], 'readonly');
    const store = transaction.objectStore('Store');
    const request = store.getAll();

    request.onsuccess = function(event) {
        const items = event.target.result;
        const itemList = document.getElementById('itemList');
        itemList.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${item.topic}</strong><p>${item.content}</p><button class="delete" data-id="${item.id}">Delete</button>`;
            itemList.appendChild(li);
        });

        // Add delete functionality
        document.querySelectorAll('.delete').forEach(button => {
            button.onclick = function() {
                const id = Number(this.getAttribute('data-id'));
                const transaction = db.transaction(['Store'], 'readwrite');
                const store = transaction.objectStore('Store');
                store.delete(id);
                transaction.oncomplete = function() {
                    displayItems(db);
                };
            };
        });
    };
}
