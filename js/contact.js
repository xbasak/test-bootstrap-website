document.addEventListener('DOMContentLoaded', () => {
    const commentForms = document.querySelectorAll('.comment-form');
    // const commentsList = document.getElementById('commentsList');
    // const phoneError = document.getElementById('phoneError');

    commentForms.forEach(form => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const postId = form.getAttribute('data-post-id');
            const name = document.getElementById(`name-${postId}`).value;
            const email = document.getElementById(`email-${postId}`).value;
            const phone = document.getElementById(`phone-${postId}`).value;
            const gender = document.querySelector('input[name="gender"]:checked').value;
            const commentText = document.getElementById(`commentText-${postId}`).value;

            // if (!validatePhone(phone)) {
            //     phoneError.style.display = 'block';
            //     return;
            // } else {
            //     phoneError.style.display = 'none';
            // }

            const newComment = {
                id: Date.now(),
                postId,
                name,
                email,
                phone,
                gender,
                text: commentText,
                timestamp: new Date().toISOString()
            };
            saveComment(newComment);
            displayComments(postId);
            form.reset();
        });
    });

    function validatePhone(phone) {
        const phoneRegex = /^[0-9]{9}$/;
        return phoneRegex.test(phone);
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }


    function saveComment(comment) {
        let comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.push(comment);
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    function updateLocalStorage(commentToUpdate) {
        let comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments = comments.map(comment => comment.id === commentToUpdate.id ? commentToUpdate : comment);
        localStorage.setItem('comments', JSON.stringify(comments));
    }
    function deleteComment(commentId, postId) {
        let comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments = comments.filter(comment => comment.id !== commentId);
        localStorage.setItem('comments', JSON.stringify(comments));
        displayComments(postId);
    }

    function displayComments(postId) {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        const postComments = comments.filter(comment => comment.postId === postId);
        const commentsList = document.getElementById(`commentsList-${postId}`);
        commentsList.innerHTML = '';

        postComments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('d-flex', 'mb-4','comment-container');
            const genderIcon = getGenderIcon(comment.gender);
            const commentHTML = `
                <div class="flex-shrink-0"><img class="rounded-circle" src="assets/img/user2.png" alt="..." /></div>
                <div class="ms-3">
                    <div class="fw-bold">${comment.name} <img src="${genderIcon}" alt="${comment.gender}" style="width: 20px; height: 20px;"> 
                    <div class="text-muted fst-italic">${new Date(comment.timestamp).toLocaleString()}</div></div>
                    <div><i>Email: ${comment.email}</i></div>
                    <div><i>Telefon: ${comment.phone}</i></div>
                    <p class="comment-text">${comment.text}</p>
                    <button class="btn btn-secondary btn-sm edit-button" data-id="${comment.id}">Edytuj</button>
                    <button class="btn btn-danger btn-sm delete-button" data-id="${comment.id}">Usuń</button>
                </div>
            `;
            commentDiv.innerHTML = commentHTML;
            commentsList.appendChild(commentDiv);
        });

        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const commentId = Number(event.target.getAttribute('data-id'));
                const postId = event.target.getAttribute('data-post-id');
                const commentToEdit = comments.find(comment => comment.id === commentId);
                if (commentToEdit) {
                    const gender = prompt('Edytuj płeć (male/female/other)', commentToEdit.gender);
                    const name = prompt('Edytuj imię', commentToEdit.name);
                    const email = prompt('Edytuj e-mail', commentToEdit.email);
                    const phone = prompt('Edytuj numer telefonu', commentToEdit.phone);
                    const text = prompt('Edytuj komentarz', commentToEdit.text);
                    
                    if (gender && name && email && validateEmail(email) && validatePhone(phone) && text) {
                        commentToEdit.gender = gender;
                        commentToEdit.name = name;
                        commentToEdit.email = email;
                        commentToEdit.phone = phone;
                        commentToEdit.text = text;
                        updateLocalStorage(commentToEdit);
                        displayComments(postId);
                    } else {
                        alert('Proszę wprowadzić poprawne dane.');
                    }
                }
            });
        });
        
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const commentId = Number(event.target.getAttribute('data-id'));
                const postId = event.target.getAttribute('data-post-id');
                if (confirm('Czy na pewno chcesz usunąć ten komentarz?')) {
                    deleteComment(commentId,postId);
                }
            });
        });

    }
    function getGenderIcon(gender) {
        const icons = {
            male: 'assets/img/male.png',
            female: 'assets/img/female.png',
            other: 'assets/img/other.png'
        };
        return icons[gender];
    }
    

    commentForms.forEach(form => {
        const postId = form.getAttribute('data-post-id');
        displayComments(postId);
    });
});
