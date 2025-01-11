
const canvas = document.getElementById('diskGraph');
const ctx = canvas.getContext('2d');
const data = [
    { value: 10, color: 'red', label: 'Partition 1' },
    { value: 20, color: 'blue', label: 'Partition 2' },
    { value: 30, color: 'green', label: 'Partition 3' },
    { value: 40, color: 'yellow', label: 'Partition 4' }
];

const totalValue = data.reduce((acc, item) => acc + item.value, 0);
let startAngle = 0;
const maxRadius = canvas.width / 2;
const maxPartitionValue = Math.max(...data.map(item => item.value));
const maxPartitionRadius = (maxPartitionValue / totalValue) * maxRadius;

data.forEach((item, index) => {
    const sliceAngle = (item.value / totalValue) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;
    const radius = (item.value / totalValue) * maxRadius;

    // Draw partition
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = item.color;
    ctx.fill();

    // Draw black line between partitions
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.lineTo(
        canvas.width / 2 + maxPartitionRadius * Math.cos(startAngle),
        canvas.height / 2 + maxPartitionRadius * Math.sin(startAngle)
    );
    ctx.strokeStyle = 'black';
    ctx.stroke();

    startAngle = endAngle;

    const keyDiv = document.createElement('div');
    keyDiv.textContent = `${item.label}: ${item.value}`;
    keyDiv.style.color = item.color;
    document.getElementById('key').appendChild(keyDiv);
});

// Draw circle surrounding the disk
ctx.beginPath();
ctx.arc(canvas.width / 2, canvas.height / 2, maxPartitionRadius, 0, 2 * Math.PI);
ctx.strokeStyle = 'black';
ctx.stroke();

// IndexedDB setup
const request = indexedDB.open('diskGraphDB', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    const objectStore = db.createObjectStore('partitions', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('value', 'value', { unique: false });
    objectStore.createIndex('color', 'color', { unique: false });
    objectStore.createIndex('label', 'label', { unique: false });
};

request.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction(['partitions'], 'readwrite');
    const objectStore = transaction.objectStore('partitions');

    data.forEach(item => {
        objectStore.add(item);
    });

    transaction.oncomplete = function() {
        console.log('All data added to IndexedDB');
    };
};

request.onerror = function(event) {
    console.error('Error opening IndexedDB:', event.target.errorCode);
};
