
//Add new Catalogue
function addCatalogue() {
    const catalogueName = prompt("Enter catalogue name:");
    if (catalogueName) {
        let catalogues = JSON.parse(localStorage.getItem('catalogues')) || [];
        catalogues.push(catalogueName);
        localStorage.setItem('catalogues', JSON.stringify(catalogues));
        alert('Catalogue added successfully!');
    }
}

function showPopup() {
    const popup = document.querySelector('.container1');
    const catalogueList = document.querySelector('.cata');
    catalogueList.innerHTML = '';
    let catalogues = JSON.parse(localStorage.getItem('catalogues')) || [];
    catalogues.forEach((catalogue, index) => {
        const div = document.createElement('div');
        div.innerHTML = `<input type="checkbox" id="catalogue-${index}" value="${catalogue}"> <label for="catalogue-${index}">${catalogue}</label>`;
        catalogueList.appendChild(div);
    });
    popup.classList.add('active');
}

function closePopup() {
    const popup = document.querySelector('.container1');
    popup.classList.remove('active');
}

function deleteSelected() {
    let catalogues = JSON.parse(localStorage.getItem('catalogues')) || [];
    const checkboxes = document.querySelectorAll('#catalogueList input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        const index = catalogues.indexOf(checkbox.value);
        if (index > -1) {
            catalogues.splice(index, 1);
        }
    });
    localStorage.setItem('catalogues', JSON.stringify(catalogues));
    showPopup();
}


function   add1(){
    const varl = prompt('Enter a new Catalogue');
}




