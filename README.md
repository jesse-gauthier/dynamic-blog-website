# Dynamic Blog Website Project Plan

## Overview
This project will create a responsive, multi-page blog website with CRUD functionality for blog posts. The website will use JavaScript to manage blog posts within the browser's local storage and implement proper Git version control practices.

## Project Structure

### Pages
1. index.html (Homepage)
   - Header with site title and navigation
   - List of all blog posts with title, date, and preview
   - Links to view individual posts
   - Button to create a new post

2. new-post.html (Create Post)
   - Form with fields for title, content, and optional image URL
   - Form validation for required fields
   - Save button to store post in local storage
   - Cancel button to return to homepage

3. post.html (View/Edit Post)
   - Display individual post with title, date, content, and image (if available)
   - Edit button to switch to edit mode
   - Delete button to remove post
   - Back button to return to homepage
   - In edit mode: form to modify post content with Save and Cancel buttons

### JavaScript Files
1. main.js
   - Common functions and utilities
   - Navigation handling

2. blog-storage.js
   - Functions for managing blog posts in local storage:
     - getAllPosts(): Retrieve all posts
     - getPost(id): Retrieve a specific post
     - savePost(post): Save a new post
     - updatePost(id, post): Update an existing post
     - deletePost(id): Delete a post

3. index.js
   - Load and display post list on homepage

4. new-post.js
   - Handle form submission for new posts
   - Form validation

5. post.js
   - Load and display individual post
   - Handle edit mode toggle
   - Handle post updates
   - Handle post deletion

### CSS Files
1. styles.css
   - Global styles and layout
   - Responsive design with media queries for mobile, tablet, and desktop

## Data Structure
Blog posts will be stored in local storage as JSON with the following structure:
