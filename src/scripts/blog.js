import { currentUser, posts, savePosts } from "./data.js";
export function initBlog() {
  const postsContainer = document.getElementById("posts-container");
  const addPostBtn = document.getElementById("add-post-btn");

  if (postsContainer && addPostBtn) {
    renderPostsList(postsContainer);

    addPostBtn.addEventListener("click", () => {
      if (!currentUser) {
        alert("You should first login to your account");
        window.location.href = "../pages/login/login.html";
      } else {
        if (["admin", "writer", "owner"].includes(currentUser.role)) {
          window.location.href = "../pages/create-post.html";
        } else {
          alert("You dont have permission to create");
        }
      }
    });
  }
}

function renderPostsList(postsContainer) {
  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add(
      "bg-grey-scale-500",
      "rounded-3xl",
      "shadow-md",
      "p-3",
      "relative",
      "flex",
      "flex-col",
      "w-72",
      "overflow-hidden",
      "font-Syne-bold",
      "gap-y-4"
    );

    //* img settings
    if (post.imageBase64) {
      const imgEl = document.createElement("img");
      imgEl.src = post.imageBase64;
      imgEl.classList.add("w-full", "h-48", "object-cover", "rounded-3xl");
      cardDiv.appendChild(imgEl);
    }

    //* Topic
    const titleEl = document.createElement("h3");
    titleEl.classList.add("text-xl", "mt-2");
    titleEl.textContent = post.topic || "Without topic";
    cardDiv.appendChild(titleEl);

    //* Like count
    const likesCount = document.createElement("div");
    likesCount.classList.add("text-sm", "text-white", "mt-1");
    likesCount.textContent = `Likes: ${post.likes ? post.likes.length : 0}`;
    cardDiv.appendChild(likesCount);

    //* Like button
    if (currentUser) {
      const likeBtn = document.createElement("button");
      likeBtn.classList.add(
        "bg-red-400",
        "w-24",
        "text-white",
        "px-3",
        "py-1",
        "rounded-xl",
        "mt-2",
        "disabled:bg-gray-400"
      );
      if (post.likes && post.likes.includes(currentUser.username)) {
        likeBtn.textContent = "Liked";
        likeBtn.disabled = true;
      } else {
        likeBtn.textContent = "Like";
      }
      likeBtn.addEventListener("click", () => {
        if (!post.likes) post.likes = [];
        if (!post.likes.includes(currentUser.username)) {
          post.likes.push(currentUser.username);
          savePosts();
          renderPostsList(postsContainer);
        }
      });
      cardDiv.appendChild(likeBtn);
    }

    // todo: Delete post
    if (
      currentUser &&
      (currentUser.role === "admin" ||
        currentUser.role === "owner" ||
        (currentUser.role === "writer" && currentUser.username === post.author))
    ) {
      const deleteBtn = document.createElement("button");
      const deleteIcon = document.createElement("img");
      deleteIcon.src = "../../public/assets/icons/trash.svg";
      deleteIcon.alt = "Delete";
      deleteIcon.classList.add("w-6", "h-6");
      deleteBtn.appendChild(deleteIcon);
      deleteBtn.classList.add(
        "bg-red-500",
        "text-white",
        "px-2",
        "py-1",
        "rounded-full",
        "absolute",
        "top-2",
        "right-2",
        "cursor-pointer"
      );
      deleteBtn.addEventListener("click", () => {
        const newPosts = posts.filter((p) => p.id !== post.id);
        posts.length = 0;
        newPosts.forEach((p) => posts.push(p));

        savePosts();
        renderPostsList(postsContainer);
      });
      cardDiv.appendChild(deleteBtn);
    }

    // todo: Continue post
    const readMoreBtn = document.createElement("a");
    readMoreBtn.textContent = "Continue";
    readMoreBtn.classList.add(
      "mt-auto",
      "bg-orange-main",
      "text-white",
      "px-3",
      "py-1",
      "rounded-full",
      "text-center",
      "block",
      "hover:-translate-y-1",
      "transition-translate",
      "duration-200",
      "mt-4"
    );
    readMoreBtn.href = `post-details.html?id=${post.id}`;
    cardDiv.appendChild(readMoreBtn);

    postsContainer.appendChild(cardDiv);
  });
}
