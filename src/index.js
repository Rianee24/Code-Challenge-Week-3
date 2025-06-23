const API_URL = 'http://localhost:3000/posts';

document.addEventListener('DOMContentLoaded', main);

function main() {
  displayPosts();
  addNewPostListener();
}

function displayPosts() {
  fetch(API_URL)
    .then(res => res.json())
    .then(posts => {
      const list = document.getElementById('post-list');
      list.innerHTML = '';
      posts.forEach(post => {
        const div = document.createElement('div');
        div.textContent = post.title;
        div.classList.add('post-title');
        div.dataset.id = post.id;
        div.addEventListener('click', () => handlePostClick(post.id));
        list.appendChild(div);
      });

      if (posts.length > 0) {
        handlePostClick(posts[0].id); 
      }
    });
}

function handlePostClick(postId) {
  fetch(`${API_URL}/${postId}`)
    .then(res => res.json())
    .then(post => {
      const detail = document.getElementById('post-detail');
      detail.innerHTML = `
        <h2>${post.title}</h2>
        <img src="${post.image}" alt="${post.title}" style="max-width: 100%;">
        <p>${post.content}</p>
        <p><strong>Author:</strong> ${post.author}</p>
        <button id="edit-button">Edit</button>
        <button id="delete-button">Delete</button>
        <button id="minimize-button">Minimize</button> <!-- 👈 Add this -->
      `;

      setupEditForm(post);
      setupDelete(post.id);

      document.getElementById('minimize-button').addEventListener('click', () => {
        document.getElementById('post-detail').innerHTML = '<p>Post hidden. Click a title to view again.</p>';
      });
    });
}

function addNewPostListener() {
  const form = document.getElementById('new-post-form');
  form.addEventListener('submit', e => {
    e.preventDefault();

    const newPost = {
  title: form['new-title'].value,
  content: form['new-content'].value,
  author: form['new-author'].value,
  image: form['new-image'].value
};


    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
    .then(res => res.json())
    .then(post => {
      displayPosts(); 
      form.reset();
    });
  });
}

function setupEditForm(post) {
  const editForm = document.getElementById('edit-post-form');
  editForm.classList.remove('hidden');
  editForm['edit-title'].value = post.title;
  editForm['edit-content'].value = post.content;

  const submitHandler = e => {
    e.preventDefault();
    const updatedPost = {
      title: editForm['edit-title'].value,
      content: editForm['edit-content'].value
    };

    fetch(`${API_URL}/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPost)
    })
    .then(res => res.json())
    .then(() => {
      displayPosts();
      handlePostClick(post.id);
      editForm.classList.add('hidden');
    });
  };

  editForm.onsubmit = submitHandler;

  document.getElementById('cancel-edit').onclick = () => {
    editForm.classList.add('hidden');
  };
}

function setupDelete(postId) {
  const deleteBtn = document.getElementById('delete-button');
  deleteBtn.onclick = () => {
    fetch(`${API_URL}/${postId}`, { method: 'DELETE' })
      .then(() => {
        displayPosts();
        document.getElementById('post-detail').innerHTML = '<p>Post deleted.</p>';
      });
  };
}

