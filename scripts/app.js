/**
 * Dynamic Blog Website
 * Combined JavaScript file for blog functionality
 */

// ========== BLOG STORAGE FUNCTIONS ==========

// Initialize posts array in localStorage if it doesn't exist
function initializeStorage() {
  if (!localStorage.getItem("blogPosts")) {
    localStorage.setItem("blogPosts", JSON.stringify([]));
  }
}

// Get all posts from localStorage
function getAllPosts() {
  initializeStorage();
  return JSON.parse(localStorage.getItem("blogPosts"));
}

// Get a specific post by ID
function getPost(id) {
  const posts = getAllPosts();
  return posts.find((post) => post.id === id);
}

// Save a new post to localStorage
function savePost(post) {
  const posts = getAllPosts();

  // Create a new post object with a unique ID
  const newPost = {
    id: generateId(),
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl || "",
    date: new Date().toISOString(),
  };

  // Add the new post to the beginning of the array (most recent first)
  posts.unshift(newPost);

  // Save the updated posts array back to localStorage
  localStorage.setItem("blogPosts", JSON.stringify(posts));

  return newPost;
}

// Update an existing post in localStorage
function updatePost(id, updatedPost) {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.id === id);

  if (index !== -1) {
    posts[index] = {
      ...posts[index],
      title: updatedPost.title,
      content: updatedPost.content,
      imageUrl: updatedPost.imageUrl || "",
    };

    localStorage.setItem("blogPosts", JSON.stringify(posts));
    return true;
  }

  return false;
}

// Delete a post from localStorage
function deletePost(id) {
  const posts = getAllPosts();
  const filteredPosts = posts.filter((post) => post.id !== id);

  localStorage.setItem("blogPosts", JSON.stringify(filteredPosts));
}

// Generate a unique ID for new posts
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Format date for display
function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

// ========== PAGE SPECIFIC FUNCTIONS ==========

// Check which page we're on
function initializePage() {
  const path = window.location.pathname;

  // Extract the page name from the path
  const pageName = path.split("/").pop();

  if (pageName === "" || pageName === "index.html") {
    initializeHomePage();
  }
  // Other pages will be handled as they are created
}

// ========== HOME PAGE FUNCTIONS ==========

// Initialize the home page
function initializeHomePage() {
  const postsContainer = document.getElementById("posts-container");
  const noPostsMessage = document.getElementById("no-posts-message");

  if (!postsContainer) return; // Not on home page

  displayPosts(postsContainer, noPostsMessage);
}

// Display all blog posts on the home page
function displayPosts(postsContainer, noPostsMessage) {
  const posts = getAllPosts();

  // Show or hide the "no posts" message
  if (posts.length === 0) {
    if (noPostsMessage) noPostsMessage.style.display = "block";
  } else {
    if (noPostsMessage) noPostsMessage.style.display = "none";

    // Create HTML for each post
    posts.forEach((post) => {
      const postCard = createPostCard(post);
      postsContainer.appendChild(postCard);
    });
  }
}

// Create a post card element
function createPostCard(post) {
  const postCard = document.createElement("div");
  postCard.className =
    "bg-white rounded-lg shadow-md p-6 mb-6 transform transition hover:-translate-y-1 hover:shadow-lg";

  // Create a preview of the content (first 150 characters)
  const contentPreview =
    post.content.length > 150
      ? post.content.substring(0, 150) + "..."
      : post.content;

  postCard.innerHTML = `
        <h3 class="text-xl font-semibold text-gray-800 mb-2">${post.title}</h3>
        <div class="text-sm text-gray-500 mb-4">${formatDate(post.date)}</div>
        <div class="text-gray-600 mb-4 line-clamp-3">${contentPreview}</div>
        <div class="flex justify-end">
            <a href="post.html?id=${
              post.id
            }" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Read More</a>
        </div>
    `;

  return postCard;
}

// Initialize the page when DOM content is loaded
document.addEventListener("DOMContentLoaded", initializePage);
