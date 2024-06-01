document.getElementById('fetch-posts').addEventListener('click', fetchPosts);

function fetchPosts() {
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(async data => {
      const postsContainer = document.getElementById('posts-container');
      postsContainer.innerHTML = '';

      const users = await fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json());

      data.forEach(post => {
        const user = users.find(user => user.id === post.userId);

        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
          <h2>${post.title}</h2>
          <p>By: ${user.name} - ${user.email}</p>
          <p>${post.body}</p>
          <button data-post-id="${post.id}">VIEW DETAILS</button>
        `;
        postsContainer.appendChild(postElement);

        const detailsButton = postElement.querySelector('button');
        detailsButton.addEventListener('click', () => showPostDetails(post.id, postElement)); 
      });
    })
    .catch(error => console.error('Error fetching posts:', error));
}

async function showPostDetails(postId, postElement) {
  const postDetails = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then(response => response.json());

  const comments = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    .then(response => response.json());

  const detailsContainer = document.createElement('div'); 
  detailsContainer.classList.add('post-details'); 

  detailsContainer.innerHTML = `
    <h3>Post Details</h3>
    <p>Title: ${postDetails.title}</p>
    <p>Body: ${postDetails.body}</p>
  `;

  const commentsList = document.createElement('ul');
  commentsList.classList.add('comments-list');
  comments.forEach(comment => {
    const commentItem = document.createElement('li');
    commentItem.textContent = `${comment.name} - ${comment.body}`;
    commentsList.appendChild(commentItem);
  });

  detailsContainer.appendChild(commentsList); 

  postElement.appendChild(detailsContainer);
}
