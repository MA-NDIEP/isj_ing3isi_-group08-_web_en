let profile = document.querySelector('.prof');

let body = document.querySelector('body');

document.querySelector('#user-btn').onclick = ()=>{
    profile.classList.toggle('active');
    search.classList.remove('active');
}

let search = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = ()=>{
    search.classList.toggle('active');
    profile.classList.remove('active');

}

let menu = document.querySelector('.navbar');


document.querySelector('#menu-btn').onclick = ()=>{
    body.classList.toggle('actif');
    menu.classList.toggle('active');
    //menu.style(`.navbar.active{padding-left:0;}`);
}

window.onscroll = ()=>{
    body.classList.remove('active');
    search.classList.remove('active');
    profile.classList.remove('active');
}