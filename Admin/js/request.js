let db;
const request = indexedDB.open('myDatabase', 1);

request.onupgradeneeded = function(event) {
        const db = event.target.result;
        const store = db.createObjectStore('myStore', { keyPath: 'id', autoIncrement: true });
        store.createIndex('topic', 'topic', { unique: false });
    };

request.onsuccess = function(event) {
    db = event.target.result;
    displayElements(db);
};

request.onerror = function(event) {
    console.error('Database error:', event.target.errorCode);
};

function displayElements(db) {
    const transaction = db.transaction(['myStore'], 'readonly');
    const objectStore = transaction.objectStore('myStore');
    const request = objectStore.getAll();

    request.onsuccess = function(event) {
        const items = event.target.result;
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';
        items.forEach(items=>{
            const recordElement = document.createElement('div');
                recordElement.className = 'record';
                recordElement.innerHTML = `<strong>Topic:</strong> ${items.topic}<br><strong>Content:</strong> ${items.content}<br><button class="delete" data-id="${items.id}">Delete</button>`;
                resultsContainer.appendChild(recordElement);
        });

        document.querySelectorAll('.delete').forEach(button => {
            button.onclick = function() {
                const id = Number(this.getAttribute('data-id'));
                const transaction = db.transaction(['myStore'], 'readwrite');
                const store = transaction.objectStore('myStore');
                store.delete(id);
                transaction.oncomplete = function() {
                    displayElements(db);
                };
            };
        });
    };

}