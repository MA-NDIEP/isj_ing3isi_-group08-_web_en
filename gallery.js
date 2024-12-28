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

    let currentUser = null;
    let currentRole = null;

    const loadVideosFromStorage = () => {
        const storedVideos = JSON.parse(localStorage.getItem('videos')) || [];
        storedVideos.forEach(video => addVideoToCategory(video.id, video.category, false));
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
            videos.push({ id: videoId, category });
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
            filterVideos(button.dataset.category);
        });
    });

    function toggleModal(modal, show) {
        modal.classList.toggle('hidden', !show);
    }

    signInButton.addEventListener('click', () => toggleModal(signInModal, true));

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
            hideTeacherActions(); // Ensure teacher actions are hidden
        } else {
            alert('Name not recognized. Please enter a valid student name.');
        }
    });

    teacherRoleBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (teachers.includes(username)) {
            currentUser = username;
            currentRole = 'teacher';
            alert(`Welcome, ${username}! You are signed in as a teacher.`);
            toggleModal(signInModal, false);
            signInButton.classList.add('hidden');
            signOutButton.classList.remove('hidden');
            commentSection.classList.add('hidden');
            uploadVideoButton.classList.remove('hidden');
            enableTeacherActions(); // Show teacher actions
        } else {
            alert('Name not recognized. Please enter a valid teacher name.');
        }
    });

    function enableTeacherActions() {
        const videoItems = document.querySelectorAll('.video-item');
        videoItems.forEach(item => {
            let actionsDiv = item.querySelector('.video-actions');
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
                const newCategory = prompt('Enter new category for this video:');
                const newVideoId = prompt('Enter new video ID or URL:');
                const newYouTubeId = extractYouTubeId(newVideoId);
                if (newYouTubeId) {
                    item.querySelector('iframe').src = `https://www.youtube.com/embed/${newYouTubeId}`;
                    item.closest('.category-group').dataset.category = newCategory;
                    item.querySelector('h3').textContent = `Updated Video in ${newCategory}`;
                    saveVideosToStorage();
                } else {
                    alert('Invalid YouTube link or ID.');
                }
            });

            deleteButton.addEventListener('click', () => {
                const videoId = item.dataset.videoId;
                item.remove();
                deleteVideoFromStorage(videoId);
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

    function addVideoToCategory(youtubeId, category) {
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
            <h3>New Video</h3>
            <div class="comments-list"></div>
        `;

        videoGrid.appendChild(newVideo);
        if (currentRole === 'teacher') {
            enableTeacherActions();
        }
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
            addCommentToVideo(videoId, commentText);
            saveCommentsToStorage();
            commentInput.value = '';
        } else {
            alert('Please write a comment before submitting.');
        }
    });

    loadVideosFromStorage();
    loadCommentsFromStorage();
});
