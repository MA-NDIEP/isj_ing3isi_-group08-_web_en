document.addEventListener('DOMContentLoaded', () => {
    const students = ['Ramzy', 'Jane Smith', 'Alice Johnson'];
    const teachers = ['Mr. Adams', 'Ms. Brown', 'steph'];

    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoryGroups = document.querySelectorAll('.category-group');
    const signInButton = document.getElementById('signInButton');
    const uploadVideoButton = document.getElementById('uploadVideoButton');
    const signInModal = document.getElementById('signInModal');
    const uploadModal = document.getElementById('uploadModal');
    const usernameInput = document.getElementById('username');
    const studentRoleBtn = document.getElementById('studentRoleBtn');
    const teacherRoleBtn = document.getElementById('teacherRoleBtn');
    const commentSection = document.getElementById('commentSection');
    const commentInput = document.getElementById('commentInput');
    const submitCommentBtn = document.getElementById('submitCommentBtn');
    const signOutButton = document.getElementById('signOutButton');
    const videoGallery = document.getElementById('video-gallery');
    const enrollmentModal = document.getElementById('enrollmentModal');
    const enrollConfirmButton = document.getElementById('enrollConfirm');
    const signInConfirm = document.getElementById('signInConfirm');
    const teacherCategoryDropdown = document.getElementById('teacherCategoryDropdown');
    const resetEnrollmentButton = document.getElementById('resetEnrollmentButton');
    let enrolledCourses = [];
    let currentUser = null;
    let currentRole = null;
    let teacherCategory = null;

    const loadVideosFromStorage = () => {
        const storedVideos = JSON.parse(localStorage.getItem('videos')) || [];
        storedVideos.forEach(video => addVideoToCategory(video.id, video.category, false, video.name));
    };

    const loadCommentsFromStorage = () => {
        const storedComments = JSON.parse(localStorage.getItem('comments')) || {};
        Object.keys(storedComments).forEach(videoId => {
            const comments = storedComments[videoId];
            comments.forEach(comment => addCommentToVideo(videoId, comment));
        });
    };

    const saveVideosToStorage = () => {
        const videos = [];
        const videoItems = document.querySelectorAll('.video-item');
        videoItems.forEach(item => {
            const videoId = item.dataset.videoId;
            const category = item.closest('.category-group').dataset.category;
            const name = item.querySelector('h3').textContent;
            videos.push({ id: videoId, category, name });
        });
        localStorage.setItem('videos', JSON.stringify(videos));
    };

    const saveCommentsToStorage = () => {
        const comments = {};
        const videoItems = document.querySelectorAll('.video-item');
        videoItems.forEach(item => {
            const videoId = item.dataset.videoId;
            const videoComments = item.querySelectorAll('.comment');
            comments[videoId] = Array.from(videoComments).map(comment => comment.textContent);
        });
        localStorage.setItem('comments', JSON.stringify(comments));
    };

    const updateEnrollmentCounts = () => {
        // Retrieve counts from local storage
        const enrollmentCounts = JSON.parse(localStorage.getItem('enrollmentCounts')) || {};

        // Reset counts
        enrolledCourses.forEach(course => {
            enrollmentCounts[course] = (enrollmentCounts[course] || 0) + 1;
        });

        // Save back to local storage
        localStorage.setItem('enrollmentCounts', JSON.stringify(enrollmentCounts));
    };

    const showEnrollmentSummary = () => {
        const enrollmentCounts = JSON.parse(localStorage.getItem('enrollmentCounts')) || {};
        const enrollmentSummaryList = document.getElementById('enrollmentSummaryList');
        enrollmentSummaryList.innerHTML = '';

        Object.entries(enrollmentCounts).forEach(([category, count]) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${category}: ${count} enrollment(s)`;
            enrollmentSummaryList.appendChild(listItem);
        });

        toggleModal(document.getElementById('enrollmentSummaryModal'), true);
    };

    document.getElementById('resetEnrollmentButton').addEventListener('click', resetEnrollmentCounts);
    document.getElementById('closeSummaryButton').addEventListener('click', () => {
        toggleModal(document.getElementById('enrollmentSummaryModal'), false);
    });

   // Adjusting "All Videos" category for students
function filterVideos(category) {
    if (category === 'all') {
        if (currentRole === 'student') {
            categoryGroups.forEach(group => {
                const groupCategory = group.dataset.category;
                if (enrolledCourses.includes(groupCategory)) {
                    group.classList.remove('hidden');
                } else {
                    group.classList.add('hidden');
                }
            });
        } else {
            categoryGroups.forEach(group => group.classList.remove('hidden'));
        }
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
            const category = button.dataset.category;
            if (currentRole === 'student' && category !== 'all' && !enrolledCourses.includes(category)) {
                alert(`You did not enroll for the ${category} course.`);
                return;
            }

            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterVideos(category);
        });
    });

    function toggleModal(modal, show) {
        modal.classList.toggle('hidden', !show);
    }

    signInButton.addEventListener('click', () => toggleModal(signInModal, true));

    signOutButton.addEventListener('click', () => {

        // Reset variables
   currentUser = null;
   currentRole = null;
   enrolledCourses = [];
   teacherCategory = null;

   // Reset UI components
   signInButton.classList.remove('hidden');
   signOutButton.classList.add('hidden');
   uploadVideoButton.classList.add('hidden');
   commentSection.classList.add('hidden');
   teacherCategoryDropdown.classList.add('hidden');
   const teacherAcronym = document.querySelector('.teacher-acronym');
   if (teacherAcronym) teacherAcronym.remove();

   // Clear enrollment modal selections
   const enrollmentForm = document.getElementById('enrollmentForm');
   if (enrollmentForm) {
       const checkboxes = enrollmentForm.querySelectorAll('input[type="checkbox"]');
       checkboxes.forEach(checkbox => (checkbox.checked = false));
   }

   // Hide edit and delete buttons for videos
   const videoItems = document.querySelectorAll('.video-item');
   videoItems.forEach(item => {
       const actionsDiv = item.querySelector('.video-actions');
       if (actionsDiv) {
           actionsDiv.remove(); // Completely remove the action buttons
       }
   });
   toggleResetButton(null); // Hide reset button
   alert('You have successfully signed out.');
   });

    // Show enrollment modal after student signs in
    studentRoleBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (students.includes(username)) {
        currentUser = username;
        currentRole = 'student';
        alert(`Welcome, ${username}! Please enroll in your courses.`);
        toggleModal(signInModal, false);
        toggleModal(enrollmentModal, true);
    } else {
        alert('Name not recognized. Please enter a valid student name.');
    }});

    // Confirm enrollment
    enrollConfirmButton.addEventListener('click', () => {
        const selectedCourses = Array.from(document.querySelectorAll('#enrollmentForm input:checked')).map(input => input.value);
        if (selectedCourses.length === 0) {
            alert('Please select at least one course.');
            return;
        }

        enrolledCourses = selectedCourses;
        alert(`You have successfully enrolled in: ${enrolledCourses.join(', ')}.`);
        toggleModal(enrollmentModal, false);

        updateEnrollmentCounts(); // Update counts here
        filterEnrolledVideos();
    });


// Filter videos based on enrollment
function filterEnrolledVideos() {
    categoryGroups.forEach(group => {
        const category = group.dataset.category;
        if (enrolledCourses.includes(category)) {
            group.classList.remove('hidden');
        } else {
            group.classList.add('hidden');
        }
    });
}

    studentRoleBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (students.includes(username)) {
            currentUser = username;
            currentRole = 'student';
            alert(`Welcome, ${username}! You are signed in as a student.`);
            toggleModal(signInModal, false);
            signInButton.classList.add('hidden');
            signOutButton.classList.remove('hidden');
            commentSection.classList.remove('hidden');
            uploadVideoButton.classList.add('hidden');
            toggleResetButton('student'); // Hide reset button
            hideTeacherActions();
        } else {
            alert('Name not recognized. Please enter a valid student name.');
        }
    });

    teacherRoleBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (teachers.includes(username)) {
            currentUser = username;
            currentRole = 'teacher';
            const acronym = username.split(' ').map(word => word[0]).join('');
            const commentCount = Object.values(JSON.parse(localStorage.getItem('comments')) || {}).flat().length;
            commentSection.classList.add('hidden');
            // Show the category dropdown and confirm button
            teacherCategoryDropdown.classList.remove('hidden');
            signInConfirm.classList.remove('hidden');
            console.log('Dropdown visibility toggled for teacher.');
            const headerBar = document.querySelector('.header-bar');
            toggleResetButton('teacher'); // Show reset button
            headerBar.innerHTML += `
                <div class="teacher-acronym">
                    ${acronym}
                    <span id="commentCountIcon">🗨️ ${commentCount}</span>
                </div>`;

        } else {
            alert('Name not recognized. Please enter a valid teacher name.');
        }
    });


    signInConfirm.addEventListener('click', () => {
        teacherCategory = document.getElementById('teacherCategory').value;
        if (!teacherCategory) {
            alert('Please select a category before proceeding.');
            return;
        }

        alert(`Welcome, ${currentUser}! You are signed in as a teacher of ${teacherCategory}.`);
        toggleModal(signInModal, false);
        signInButton.classList.add('hidden');
        signOutButton.classList.remove('hidden');
        uploadVideoButton.classList.remove('hidden');
        // Show enrollment summary automatically
        showEnrollmentSummary();
        enableTeacherActions(); // Call to initialize teacher privileges
    });

    function enableTeacherActions() {
        const videoItems = document.querySelectorAll('.video-item');
        videoItems.forEach(item => {
            let actionsDiv = item.querySelector('.video-actions');
            const category = item.closest('.category-group').dataset.category;
            if (!actionsDiv) {
                actionsDiv = document.createElement('div');
                actionsDiv.classList.add('video-actions');
                actionsDiv.innerHTML = `
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                `;
                item.appendChild(actionsDiv);
            }

            const editButton = actionsDiv.querySelector('.edit-btn');
            const deleteButton = actionsDiv.querySelector('.delete-btn');

            editButton.addEventListener('click', () => {
                const newName = prompt('Enter new name for this video:');
                if (newName) {
                    item.querySelector('h3').textContent = newName;
                }

                const updateLink = confirm('Do you want to update the video link as well?');

                if (updateLink) {
                    const newVideoId = prompt('Enter new video ID or URL:');
                    const newYouTubeId = extractYouTubeId(newVideoId);
                    if (newYouTubeId) {
                        item.querySelector('iframe').src = `https://www.youtube.com/embed/${newYouTubeId}`;
                        item.dataset.videoId = newYouTubeId; // Update dataset to reflect new video ID
                    } else {
                        alert('Invalid YouTube link or ID.');
                    }
                }

                // Save the updated video details to local storage
                saveUpdatedVideoToStorage(item);
            });

            deleteButton.addEventListener('click', () => {
                const confirmation = confirm('Are you sure you want to delete this video?');
                if (confirmation) {
                    const videoId = item.dataset.videoId;
                    item.remove();
                    deleteVideoFromStorage(videoId);
                }
            });

            actionsDiv.classList.remove('hidden');
        });
    }

    function hideTeacherActions() {
        const videoItems = document.querySelectorAll('.video-item');
        videoItems.forEach(item => {
            const actionsDiv = item.querySelector('.video-actions');
            if (actionsDiv) {
                actionsDiv.classList.add('hidden');
            }
        });
    }

    function saveUpdatedVideoToStorage(videoItem) {
        const videoId = videoItem.dataset.videoId;
        const category = videoItem.closest('.category-group').dataset.category;
        const videoName = videoItem.querySelector('h3').textContent;

        const videos = JSON.parse(localStorage.getItem('videos')) || [];
        const videoIndex = videos.findIndex(video => video.id === videoId);

        if (videoIndex !== -1) {
            videos[videoIndex] = { id: videoId, category, name: videoName };
        } else {
            videos.push({ id: videoId, category, name: videoName });
        }

        localStorage.setItem('videos', JSON.stringify(videos));
    }

    function deleteVideoFromStorage(videoId) {
        const videos = JSON.parse(localStorage.getItem('videos')) || [];
        const filteredVideos = videos.filter(video => video.id !== videoId);
        localStorage.setItem('videos', JSON.stringify(filteredVideos));

        const comments = JSON.parse(localStorage.getItem('comments')) || {};
        delete comments[videoId];
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    uploadVideoButton.addEventListener('click', () => toggleModal(uploadModal, true));

    document.getElementById('uploadConfirm').addEventListener('click', () => {
        const videoIdInput = document.getElementById('videoIdInput').value.trim();
        const category = document.getElementById('videoCategoryInput').value.trim();

        const youtubeId = extractYouTubeId(videoIdInput);
        if (youtubeId && category) {
            addVideoToCategory(youtubeId, category);
            saveVideosToStorage();
            toggleModal(uploadModal, false);
            alert('Video added successfully!');
        } else {
            alert('Invalid details. Please try again.');
        }
    });

    function extractYouTubeId(input) {
        const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = input.match(regex);
        return match ? match[1] : input.length === 11 ? input : null;
    }

    function addVideoToCategory(youtubeId, category, save = true, name = 'New Video') {
        let categoryGroup = document.querySelector(`.category-group[data-category="${category}"]`);
        if (!categoryGroup) {
            categoryGroup = document.createElement('div');
            categoryGroup.classList.add('category-group');
            categoryGroup.dataset.category = category;
            categoryGroup.innerHTML = `<h2>${category} Videos</h2><div class="video-grid"></div>`;
            videoGallery.appendChild(categoryGroup);
        }

        const videoGrid = categoryGroup.querySelector('.video-grid');
        const newVideo = document.createElement('div');
        newVideo.classList.add('video-item');
        newVideo.dataset.videoId = youtubeId;
        newVideo.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${youtubeId}" frameborder="0" allowfullscreen></iframe>
            <h3>${name}</h3>
            <div class="comments-list"></div>
        `;

        videoGrid.appendChild(newVideo);
        if (currentRole === 'teacher') {
            enableTeacherActions();
        }

        if (save) saveVideosToStorage();
    }

    function addCommentToVideo(videoId, commentText) {
        const videoItem = document.querySelector(`.video-item[data-video-id="${videoId}"]`);
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.textContent = commentText;

        const commentsList = videoItem.querySelector('.comments-list');
        commentsList.appendChild(commentDiv);
    }

    submitCommentBtn.addEventListener('click', () => {
        const commentText = commentInput.value.trim();
        const videoId = commentInput.dataset.videoId;
        if (commentText) {
            const comments = JSON.parse(localStorage.getItem('comments')) || {};
            if (!comments[videoId]) {
                comments[videoId] = [];
            }
            comments[videoId].push(`${currentUser}: ${commentText}`);
            localStorage.setItem('comments', JSON.stringify(comments));

            addCommentToVideo(videoId, `${currentUser}: ${commentText}`);
            commentInput.value = '';
        } else {
            alert('Please write a comment before submitting.');
        }
    });

    function updateCommentCount() {
        const commentCount = Object.values(JSON.parse(localStorage.getItem('comments')) || {}).flat().length;
        const commentCountIcon = document.getElementById('commentCountIcon');
        if (commentCountIcon) {
            commentCountIcon.textContent = `🗨️ ${commentCount}`;
        }
    }
    // Add event listener to the reset button
resetEnrollmentButton.addEventListener('click', resetEnrollmentCounts);

function toggleResetButton(role) {
    if (role === 'teacher') {
        resetEnrollmentButton.classList.remove('hidden');
    } else {
        resetEnrollmentButton.classList.add('hidden');
    }
}

    // Function to reset the enrollment counter
    function resetEnrollmentCounts() {
        localStorage.removeItem('enrollmentCounts');
        alert('Enrollment counts have been reset.');
    }


    loadVideosFromStorage();
    loadCommentsFromStorage();
});
