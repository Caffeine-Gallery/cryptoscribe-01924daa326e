import { backend } from 'declarations/backend';

let quill;

document.addEventListener('DOMContentLoaded', async () => {
  initQuill();
  setupEventListeners();
  await loadPosts();
});

function initQuill() {
  quill = new Quill('#editor', {
    theme: 'snow'
  });
}

function setupEventListeners() {
  document.getElementById('newPostBtn').addEventListener('click', togglePostForm);
  document.getElementById('blogForm').addEventListener('submit', handleSubmit);
}

function togglePostForm() {
  const form = document.getElementById('postForm');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function handleSubmit(event) {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const body = quill.root.innerHTML;

  await backend.addPost(title, body, author);
  
  document.getElementById('blogForm').reset();
  quill.setContents([]);
  togglePostForm();
  await loadPosts();
}

async function loadPosts() {
  const posts = await backend.getPosts();
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = '';

  posts.sort((a, b) => b.timestamp - a.timestamp).forEach(post => {
    const postElement = document.createElement('article');
    postElement.innerHTML = `
      <h2>${post.title}</h2>
      <p class="meta">By ${post.author} on ${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</p>
      <div class="content">${post.body}</div>
    `;
    postsContainer.appendChild(postElement);
  });
}
