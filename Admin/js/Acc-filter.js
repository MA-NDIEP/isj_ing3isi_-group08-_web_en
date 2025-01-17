function displayElements(filter = '') {
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
            <td><input type="checkbox" class="elementCheckbox" data-key="${key}"></td>
            <td>${element.name}</td>
            <td>${element.teacher}</td>
            <td>${element.catalogue}</td>
            <td><button class="resetPassword" data-key="${key}">Reset Password</button></td>
        `;
        elementList.appendChild(tr);
    }
}

document.getElementById('deleteSelected').addEventListener('click', function() {
    const checkboxes = document.querySelectorAll('.elementCheckbox:checked');
    checkboxes.forEach(checkbox => {
        const key = checkbox.getAttribute('data-key');
        localStorage.removeItem(key);
    });
    displayElements();
});

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('resetPassword')) {
        const key = event.target.getAttribute('data-key');
        const newPassword = prompt('Enter new password:');
        if (newPassword) {
            const element = JSON.parse(localStorage.getItem(key));
            element.password = newPassword;
            localStorage.setItem(key, JSON.stringify(element));
            alert('Password reset!');
        }
    }
});

document.getElementById('applyFilter').addEventListener('click', function() {
    const filterValue = document.getElementById('filter').value;
    displayElements(filterValue);
});

window.onload = function() {
    displayElements();
};
