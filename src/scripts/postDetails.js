import { currentUser, posts, savePosts } from "./data.js";

export function initPostDetails() {
  const postDetailsContainer = document.getElementById("post-details");
  if (!postDetailsContainer) return;

  const params = new URLSearchParams(window.location.search);
  const postId = parseInt(params.get("id"), 10);
  const foundPost = posts.find((p) => p.id === postId);
  if (!foundPost) {
    postDetailsContainer.innerHTML = "<p>No post had found</p>";
  } else {
    renderPostDetails(foundPost, postDetailsContainer);
  }
}

function renderPostDetails(post, container) {
  container.innerHTML = "";

  //*Title
  const h2 = document.createElement("h2");
  h2.classList.add("text-2xl", "font-Syne-bold", "mb-2");
  h2.textContent = post.title;
  container.appendChild(h2);

  //*Topic
  const topicEl = document.createElement("p");
  topicEl.classList.add("text-md", "text-gray-700", "mb-2");
  topicEl.textContent = `Title: ${post.topic || "Without Title"}`;
  container.appendChild(topicEl);

  //*Author
  const authorEl = document.createElement("p");
  authorEl.classList.add("text-sm", "text-gray-600", "mb-2");
  authorEl.textContent = `Writer: ${post.author} (${post.authorRole})`;
  container.appendChild(authorEl);

  //*Image
  if (post.imageBase64) {
    const img = document.createElement("img");
    img.src = post.imageBase64;
    img.classList.add("w-full", "h-auto", "object-cover", "rounded-2xl", "mb-4");
    container.appendChild(img);
  }

  //* main Text
  const contentEl = document.createElement("p");
  contentEl.classList.add("text-base", "mb-4");
  contentEl.textContent = post.content;
  container.appendChild(contentEl);

  //* Like count
  const likesCount = document.createElement("div");
  likesCount.classList.add("text-sm", "text-gray-600", "mb-2");
  likesCount.textContent = `Likes: ${post.likes ? post.likes.length : 0}`;
  container.appendChild(likesCount);

  //* Like button
  if (currentUser) {
    const likeBtn = document.createElement("button");
    likeBtn.classList.add(
      "bg-blue-500",
      "text-white",
      "px-3",
      "py-1",
      "rounded-full",
      "disabled:bg-gray-400",
      "mr-2"
    );
    if (post.likes.includes(currentUser.username)) {
      likeBtn.textContent = "Liked";
      likeBtn.disabled = true;
    } else {
      likeBtn.textContent = "Like";
    }
    likeBtn.addEventListener("click", () => {
      if (!post.likes.includes(currentUser.username)) {
        post.likes.push(currentUser.username);
        savePosts();
        renderPostDetails(post, container);
      }
    });
    container.appendChild(likeBtn);
  } else {
    const msg = document.createElement("p");
    msg.classList.add("text-red-500", "mt-2");
    msg.textContent = "You shoukd first log in";
    container.appendChild(msg);
  }

  // todo: post delete button if it was accesable
  if (
    currentUser &&
    (currentUser.role === "admin" ||
      currentUser.role === "owner" ||
      (currentUser.role === "writer" && currentUser.username === post.author))
  ) {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete Post";
    deleteBtn.classList.add(
      "bg-red-500",
      "text-white",
      "px-3",
      "py-1",
      "rounded-md",
      "ml-2"
    );
    deleteBtn.addEventListener("click", () => {
      const newPosts = posts.filter((p) => p.id !== post.id);
      posts.length = 0;
      newPosts.forEach((p) => posts.push(p));

      savePosts();
      alert("Post is deleted");
      window.location.href = "../pages/blog.html";
    });
    container.appendChild(deleteBtn);
  }

  //* Back link
  const backLink = document.createElement("a");
  backLink.textContent = "Blog page";
  backLink.href = "blog.html";
  backLink.classList.add("block", "text-orange-main", "my-8");
  container.appendChild(backLink);
}
