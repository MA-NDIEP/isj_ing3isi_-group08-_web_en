document.addEventListener('DOMContentLoaded', () => {
    studentComments = JSON.parse(localStorage.getItem('studentComments')) || [];
});
// References to elements
const commentInput = document.getElementById('commentInput');
const submitCommentBtn = document.getElementById('submitCommentBtn');
const commentsList = document.getElementById('commentsList');
const viewStudentCommentsButton = document.getElementById('viewStudentCommentsButton');
const allCommentsModal = document.getElementById('allCommentsModal');
const allCommentsList = document.getElementById('allCommentsList');
const closeAllCommentsModal = document.getElementById('closeAllCommentsModal');
const clearCommentsButton = document.getElementById('clearCommentsButton');

let currentRole = null; // Track current role of the user
let studentComments = JSON.parse(localStorage.getItem('studentComments')) || []; // Load from localStorage
let commentCount = parseInt(localStorage.getItem('commentCount')) || 0; // Load comment count from localStorage

// Function to submit a comment
function submitComment() {
    const comment = commentInput.value.trim();
    if (comment) {
        if (currentRole === 'student') {
            alert('Well submitted');
            studentComments.push(comment); // Add comment to the array
            localStorage.setItem('studentComments', JSON.stringify(studentComments)); // Save to localStorage
            displayComment(comment);
            commentInput.value = ''; // Clear input

        } else {
            alert('Only students can submit comments.');
        }
    } else {
        alert('Please enter a comment.');
    }
}



// Function to toggle the view student comments button
function toggleViewStudentCommentsButton(role) {
    if (role === 'teacher') {
        viewStudentCommentsButton.classList.remove('hidden');
    } else {
        viewStudentCommentsButton.classList.add('hidden');
    }
}

// Function to display all student comments in the modal
function showAllStudentComments() {
    allCommentsList.innerHTML = ''; // Clear existing comments
    studentComments.forEach(comment => {
        const commentItem = document.createElement('li');
        commentItem.textContent = comment;
        allCommentsList.appendChild(commentItem);
    });
    allCommentsModal.classList.remove('hidden'); // Show modal
}

// Function to clear all comments and reset the count
function clearAllComments() {
    if (confirm('Are you sure you want to clear all comments? This action cannot be undone.')) {
        studentComments = []; // Clear the array
        localStorage.removeItem('studentComments'); // Remove from localStorage
        allCommentsList.innerHTML = ''; // Clear displayed comments
        alert('All comments have been cleared.');
        localStorage.setItem('commentCount', '0'); // Reset count in localStorage
    }
}

// Function to close the all comments modal
function closeAllComments() {
    allCommentsModal.classList.add('hidden'); // Hide modal
}

// Event listeners
submitCommentBtn.addEventListener('click', submitComment);
viewStudentCommentsButton.addEventListener('click', showAllStudentComments);
clearCommentsButton.addEventListener('click', clearAllComments);
closeAllCommentsModal.addEventListener('click', closeAllComments);

studentRoleBtn.addEventListener('click', () => {
    currentRole = 'student';
    toggleViewStudentCommentsButton('student');
});

