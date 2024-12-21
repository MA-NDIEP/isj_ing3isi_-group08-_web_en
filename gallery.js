document.addEventListener('DOMContentLoaded', () => {
    // Predefined names for students and teachers
    const students = ['John Doe', 'Jane Smith', 'Alice Johnson']; // Predefined student names
    const teachers = ['Mr. Adams', 'Ms. Brown', 'White'];   // Predefined teacher names

    // Variables for UI elements
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoryGroups = document.querySelectorAll('.category-group');
    const videoItems = document.querySelectorAll('.video-item');
    const signInButton = document.getElementById('signInButton');
    const uploadVideoButton = document.getElementById('uploadVideoButton');
    const signInModal = document.getElementById('signInModal');
    const uploadModal = document.getElementById('uploadModal');
    const signInConfirmButton = document.getElementById('signInConfirm');
    const usernameInput = document.getElementById('username');
    const studentRoleBtn = document.getElementById('studentRoleBtn');
    const teacherRoleBtn = document.getElementById('teacherRoleBtn');
    const userAcronymDisplay = document.getElementById('userAcronym');
    const videoGallery = document.getElementById('video-gallery');
    const commentSection = document.getElementById('commentSection');
    const commentInput = document.getElementById('commentInput');
    const submitCommentBtn = document.getElementById('submitCommentBtn');
    const commentsList = document.getElementById('commentsList');

    let currentUser = null;
    let currentRole = null; // Store user role (student/teacher)

    // Category filtering logic
    function filterVideos(category) {
        if (category === 'all') {
            categoryGroups.forEach(group => group.classList.remove('hidden'));
        } else {
            categoryGroups.forEach(group => {
                if (group.dataset.category === category) {
                    group.classList.remove('hidden');
                } else {
                    group.classList.add('hidden');
                }
            });
        }
    }

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.dataset.category;
            filterVideos(category);
        });
    });

    // Search functionality
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('input', event => {
        const query = event.target.value.toLowerCase();
        videoItems.forEach(item => {
            const title = item.querySelector('h3').innerText.toLowerCase();
            if (title.includes(query)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });

    // Toggle modal visibility
    function toggleModal(modal, show) {
        modal.classList.toggle('hidden', !show);
    }

    // Sign-In Logic - Show role selection modal
    signInButton.addEventListener('click', () => {
        toggleModal(signInModal, true); // Show sign-in modal
    });

    // Role selection - Student
    studentRoleBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (students.includes(username)) {
            currentUser = username;
            currentRole = 'student';
            alert(`Welcome, ${username}! You are signed in as a student.`);
            toggleModal(signInModal, false); // Hide the modal
            signInButton.classList.add('hidden'); // Hide sign-in button
            commentSection.classList.remove('hidden'); // Show comment section for students
            uploadVideoButton.classList.add('hidden'); // Hide upload video button for students
        } else {
            alert('Name not recognized. Please enter a valid student name.');
        }
    });

    // Role selection - Teacher
    teacherRoleBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (teachers.includes(username)) {
            currentUser = username;
            currentRole = 'teacher';
            alert(`Welcome, ${username}! You are signed in as a teacher.`);
            toggleModal(signInModal, false); // Hide the modal
            signInButton.classList.add('hidden'); // Hide sign-in button
            commentSection.classList.add('hidden'); // Hide comment section for teachers
            uploadVideoButton.classList.remove('hidden'); // Show upload video button for teachers
        } else {
            alert('Name not recognized. Please enter a valid teacher name.');
        }
    });

    // Handle comment submission
    submitCommentBtn.addEventListener('click', () => {
        const commentText = commentInput.value.trim();
        if (commentText) {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');
            commentDiv.textContent = commentText;
            commentsList.appendChild(commentDiv);
            commentInput.value = ''; // Clear comment input field
        } else {
            alert('Please write a comment before submitting.');
        }
    });

    // Upload Video Logic (Only for teachers)
    uploadVideoButton.addEventListener('click', () => {
        if (currentRole !== 'teacher') {
            alert('Only teachers can upload videos.');
            return;
        }
        toggleModal(uploadModal, true);
    });

    // Upload Video Modal Confirmation
    document.getElementById('uploadConfirm').addEventListener('click', () => {
        if (currentRole !== 'teacher') {
            alert('Only teachers can upload videos.');
            return;
        }

        const videoIdInput = document.getElementById('videoIdInput').value.trim();
        const category = document.getElementById('videoCategoryInput').value;

        if (videoIdInput && category) {
            const youtubeId = extractYouTubeId(videoIdInput);
            if (youtubeId) {
                addVideoToCategory(youtubeId, category);
                toggleModal(uploadModal, false);
                alert('Video added successfully!');
            } else {
                alert('Invalid YouTube link or ID.');
            }
        } else {
            alert('Please provide all the details.');
        }
    });

    // Extract YouTube video ID from URL or direct ID
    function extractYouTubeId(input) {
        const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = input.match(regex);
        return match ? match[1] : input.length === 11 ? input : null;
    }

    // Add video dynamically to the category
function addVideoToCategory(youtubeId, category) {
    let categoryGroup = document.querySelector(`.category-group[data-category="${category}"]`);
    if (!categoryGroup) {
        // If category group doesn't exist, create it
        categoryGroup = document.createElement('div');
        categoryGroup.classList.add('category-group');
        categoryGroup.dataset.category = category;
        categoryGroup.innerHTML = `<h2>${category} Videos</h2><div class="video-grid"></div>`;
        videoGallery.appendChild(categoryGroup);
    }

    const videoGrid = categoryGroup.querySelector('.video-grid');
    const newVideo = document.createElement('div');
    newVideo.classList.add('video-item');
    newVideo.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${youtubeId}" frameborder="0" allowfullscreen></iframe>
        <h3>New Video</h3>
    `;

    // Only show Edit and Delete buttons if the user is a teacher
    if (currentRole === 'teacher') {
        newVideo.innerHTML += `
            <div class="video-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
    }

    videoGrid.appendChild(newVideo);

    // Handle delete button
    const deleteButton = newVideo.querySelector('.delete-btn');
    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            if (currentRole === 'teacher') {
                // Confirm deletion and remove the video
                const confirmation = confirm('Are you sure you want to delete this video?');
                if (confirmation) {
                    newVideo.remove(); // Remove the video item from the grid
                    alert('Video deleted successfully!');
                }
            } else {
                alert('Only teachers can delete videos.');
            }
        });
    }

    // Handle edit button
    const editButton = newVideo.querySelector('.edit-btn');
    if (editButton) {
        editButton.addEventListener('click', () => {
            if (currentRole === 'teacher') {
                // Allow the teacher to edit the video title and/or video link
                const newTitle = prompt('Enter a new title for this video:', newVideo.querySelector('h3').innerText);
                const newVideoLink = prompt('Enter a new YouTube video URL:', `https://www.youtube.com/watch?v=${youtubeId}`);

                if (newTitle && newVideoLink) {
                    const newVideoId = extractYouTubeId(newVideoLink); // Extract the YouTube ID from the new link
                    if (newVideoId) {
                        // Update the iframe with the new video ID
                        newVideo.querySelector('iframe').src = `https://www.youtube.com/embed/${newVideoId}`;
                        newVideo.querySelector('h3').innerText = newTitle;
                        alert('Video updated successfully!');
                    } else {
                        alert('Invalid YouTube URL.');
                    }
                }
            } else {
                alert('Only teachers can edit videos.');
            }
        });
    }


        // Edit button handler
        editButton.addEventListener('click', () => {
            const newTitle = prompt('Enter new video title:', newVideo.querySelector('h3').innerText);
            if (newTitle) {
                newVideo.querySelector('h3').innerText = newTitle;
            }
        });

        // Delete button handler
        deleteButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this video?')) {
                newVideo.remove();
            }
        });
    }

    // Pause all other videos when one video starts playing
    videoItems.forEach(item => {
        const video = item.querySelector('video');
        if (video) {
            video.addEventListener('play', () => {
                videoItems.forEach(otherItem => {
                    const otherVideo = otherItem.querySelector('video');
                    if (otherVideo !== video) {
                        otherVideo.pause();
                    }
                });
            });
        }
    });
});
