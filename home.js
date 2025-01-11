document.addEventListener('DOMContentLoaded', () => {
    const signInModal = document.getElementById('signInModal');
    const signInButton = document.getElementById('signInButton');
    function toggleModal(modal, show) {
        modal.classList.toggle('hidden', !show);
    }
    signInButton.addEventListener('click', () => toggleModal(signInModal, true));

});