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

// ========== HELPER FUNCTIONS ==========

// Get URL parameter by name
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// ========== PAGE SPECIFIC FUNCTIONS ==========

// Check which page we're on
function initializePage() {
  const path = window.location.pathname;

  // Extract the page name from the path
  const pageName = path.split("/").pop();

  if (pageName === "" || pageName === "index.html") {
    initializeHomePage();
  } else if (pageName === "new-post.html") {
    initializeNewPostPage();
  } else if (pageName === "post.html") {
    initializePostPage();
  }
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

// ========== NEW POST PAGE FUNCTIONS ==========

// Initialize the new post page
function initializeNewPostPage() {
  const newPostForm = document.getElementById("new-post-form");

  if (!newPostForm) return; // Not on new post page

  // Add submit event listener to the form
  newPostForm.addEventListener("submit", handleNewPostSubmit);
}

// Handle new post form submission
function handleNewPostSubmit(event) {
  event.preventDefault();

  // Get form elements
  const titleInput = document.getElementById("post-title");
  const contentInput = document.getElementById("post-content");
  const imageInput = document.getElementById("post-image");

  // Get form values
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const imageUrl = imageInput.value.trim();

  // Validate form
  let isValid = true;

  // Validate title
  if (!title) {
    document.getElementById("title-error").classList.remove("hidden");
    titleInput.classList.add("border-red-500");
    isValid = false;
  } else {
    document.getElementById("title-error").classList.add("hidden");
    titleInput.classList.remove("border-red-500");
  }

  // Validate content
  if (!content) {
    document.getElementById("content-error").classList.remove("hidden");
    contentInput.classList.add("border-red-500");
    isValid = false;
  } else {
    document.getElementById("content-error").classList.add("hidden");
    contentInput.classList.remove("border-red-500");
  }

  // If form is valid, save the post
  if (isValid) {
    // Create new post object
    const newPost = {
      title: title,
      content: content,
      imageUrl: imageUrl,
    };

    // Save the post
    const savedPost = savePost(newPost);

    // Redirect to the homepage
    window.location.href = "index.html";
  }
}

// ========== POST PAGE FUNCTIONS ==========

// Initialize the post page
function initializePostPage() {
  // Get post ID from URL
  const postId = getUrlParameter("id");

  if (!postId) {
    // No post ID provided, redirect to home
    window.location.href = "index.html";
    return;
  }

  // Get the post from storage
  const post = getPost(postId);

  if (!post) {
    // Post not found, show error message
    document.getElementById("post-not-found").classList.remove("hidden");
    document.getElementById("post-content-container").classList.add("hidden");
    return;
  }

  // Display the post
  displayPost(post);

  // Set up event listeners for actions
  setupPostPageActions(post);
}

// Display a post on the post page
function displayPost(post) {
  // Set the page title
  document.title = `${post.title} - My Dynamic Blog`;

  // Set the post content
  document.getElementById("post-title-display").textContent = post.title;
  document.getElementById("post-date-display").textContent = formatDate(
    post.date
  );
  document.getElementById("post-content-display").textContent = post.content;

  // Handle post image if it exists
  if (post.imageUrl && post.imageUrl.trim() !== "") {
    const imageContainer = document.getElementById("post-image-container");
    const imageElement = document.getElementById("post-image-display");

    imageElement.src = post.imageUrl;
    imageElement.alt = post.title;
    imageContainer.classList.remove("hidden");
  }
}

// Set up post page event listeners
function setupPostPageActions(post) {
  // Edit button
  const editButton = document.getElementById("edit-post-btn");
  if (editButton) {
    editButton.addEventListener("click", () => {
      showEditMode(post);
    });
  }

  // Delete button
  const deleteButton = document.getElementById("delete-post-btn");
  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      showDeleteConfirmation(post.id);
    });
  }

  // Edit form
  const editForm = document.getElementById("edit-post-form");
  if (editForm) {
    editForm.addEventListener("submit", (event) => {
      handleEditFormSubmit(event, post.id);
    });
  }

  // Cancel edit button
  const cancelEditButton = document.getElementById("cancel-edit-btn");
  if (cancelEditButton) {
    cancelEditButton.addEventListener("click", () => {
      hideEditMode();
    });
  }

  // Delete confirmation buttons
  const cancelDeleteButton = document.getElementById("cancel-delete-btn");
  if (cancelDeleteButton) {
    cancelDeleteButton.addEventListener("click", hideDeleteConfirmation);
  }

  const confirmDeleteButton = document.getElementById("confirm-delete-btn");
  if (confirmDeleteButton) {
    confirmDeleteButton.addEventListener("click", () => {
      handleDeletePost(post.id);
    });
  }
}

// Show edit mode for a post
function showEditMode(post) {
  // Hide view section and show edit section
  document.getElementById("view-post-section").classList.add("hidden");
  document.getElementById("edit-post-section").classList.remove("hidden");

  // Populate form fields with post data
  document.getElementById("edit-post-title").value = post.title;
  document.getElementById("edit-post-content").value = post.content;
  document.getElementById("edit-post-image").value = post.imageUrl || "";
}

// Hide edit mode and return to view mode
function hideEditMode() {
  document.getElementById("edit-post-section").classList.add("hidden");
  document.getElementById("view-post-section").classList.remove("hidden");
}

// Handle edit form submission
function handleEditFormSubmit(event, postId) {
  event.preventDefault();

  // Get form elements
  const titleInput = document.getElementById("edit-post-title");
  const contentInput = document.getElementById("edit-post-content");
  const imageInput = document.getElementById("edit-post-image");

  // Get form values
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const imageUrl = imageInput.value.trim();

  // Validate form
  let isValid = true;

  // Validate title
  if (!title) {
    document.getElementById("edit-title-error").classList.remove("hidden");
    titleInput.classList.add("border-red-500");
    isValid = false;
  } else {
    document.getElementById("edit-title-error").classList.add("hidden");
    titleInput.classList.remove("border-red-500");
  }

  // Validate content
  if (!content) {
    document.getElementById("edit-content-error").classList.remove("hidden");
    contentInput.classList.add("border-red-500");
    isValid = false;
  } else {
    document.getElementById("edit-content-error").classList.add("hidden");
    contentInput.classList.remove("border-red-500");
  }

  // If form is valid, update the post
  if (isValid) {
    // Create updated post object
    const updatedPost = {
      title: title,
      content: content,
      imageUrl: imageUrl,
    };

    // Update the post
    const success = updatePost(postId, updatedPost);

    if (success) {
      // Reload the page to show updated post
      window.location.reload();
    }
  }
}

// Show delete confirmation modal
function showDeleteConfirmation(postId) {
  const deleteModal = document.getElementById("delete-modal");
  deleteModal.classList.remove("hidden");
}

// Hide delete confirmation modal
function hideDeleteConfirmation() {
  const deleteModal = document.getElementById("delete-modal");
  deleteModal.classList.add("hidden");
}

// Handle post deletion
function handleDeletePost(postId) {
  // Delete the post
  deletePost(postId);

  // Redirect to the homepage
  window.location.href = "index.html";
}

// Initialize the page when DOM content is loaded
document.addEventListener("DOMContentLoaded", initializePage);
