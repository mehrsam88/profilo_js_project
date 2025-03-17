import { currentUser, posts, savePosts } from "./data.js";

export function initCreatePost() {
  const createPostForm = document.getElementById("create-post-form");
  if (!createPostForm) return;
  //*cheking permission
  if (
    !currentUser ||
    !["admin", "writer", "owner"].includes(currentUser.role)
  ) {
    alert("You dont have permission to create");
    window.location.href = "../pages/blog.html";
    return;
  }
  //* getting data
  createPostForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const titleVal = document.getElementById("post-title").value.trim();
    const topicVal = document.getElementById("post-topic").value.trim();
    const contentVal = document.getElementById("post-content").value.trim();
    const imageInput = document.getElementById("post-image");

    if (!titleVal || !contentVal) {
      alert("Please fill all required fields");
      return;
    }
    //* file upload
    if (imageInput.files && imageInput.files[0]) {
      const file = imageInput.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        const base64Image = e.target.result;
        addNewPost(titleVal, topicVal, contentVal, base64Image);
      };

      reader.readAsDataURL(file);
    } else {
      addNewPost(titleVal, topicVal, contentVal, null);
    }
  });

  function addNewPost(title, topic, content, base64Image) {
    const newPost = {
      id: Date.now(),
      title,
      topic,
      content,
      imageBase64: base64Image,
      author: currentUser.username,
      authorRole: currentUser.role,
      likes: [],
    };

    posts.unshift(newPost);
    savePosts();

    alert("Post Created Succesfully");
    window.location.href = "../pages/blog.html";
  }
}
