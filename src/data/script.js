document.addEventListener("DOMContentLoaded", () => {
  //   todo : Check Account settings or Add account settings
  //   todo: Add a owner account
  const defaultOwner = {
    username: "creator",
    password: "secretCreator",
    role: "owner",
  };

  // todo: Getting users lists
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (!users.some((u) => u.username === defaultOwner.username)) {
    users.push(defaultOwner);
    localStorage.setItem("users", JSON.stringify(users));
  }

  // todo: getting posts data from local storage
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  //todo: Checking Login account
  let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

  // Todo: Changing Data for functions
  function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
  }
  function savePosts() {
    localStorage.setItem("posts", JSON.stringify(posts));
  }

  //todo: Signin account system

  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("signup-username").value.trim();
      const password = document.getElementById("signup-password").value.trim();
      if (users.some((u) => u.username === username)) {
        alert("This username is already taken");
        return;
      }
      users.push({ username, password, role: "user" });
      saveUsers();
      alert("You signed up successfully");
      window.location.href = "../../pages/login/login.html";
    });
  }

  //  todo: Login system
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value.trim();

      const foundUser = users.find(
        (u) => u.username === username && u.password === password
      );
      if (!foundUser) {
        alert("Username or password is incorrect.");
        return;
      }

      alert("You logged in successfully");
      currentUser = foundUser;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      window.location.href = "../../../public/index.html";
    });
  }

  //todo: Navs and users diaplaying system
  const loginBtn = document.getElementById("login_button");
  const signInBtn = document.getElementById("Signin_button");
  const userInfoDiv = document.getElementById("user-info");
  const usernameDisplay = document.getElementById("username-display");
  const logoutBtn = document.getElementById("logout-button");
  const manageUsersLink = document.getElementById("manage-users-link");

  if (currentUser) {
    //! users is logged in
    if (loginBtn) loginBtn.classList.add("hidden");
    if (signInBtn) signInBtn.classList.add("hidden");
    if (userInfoDiv) userInfoDiv.classList.remove("hidden");
    if (usernameDisplay) usernameDisplay.textContent = currentUser.username;

    //! Private page Display
    if (manageUsersLink && currentUser.role === "owner") {
      manageUsersLink.classList.remove("hidden");
    }
  } else {
    //! Guest user
    if (loginBtn) loginBtn.classList.remove("hidden");
    if (signInBtn) signInBtn.classList.remove("hidden");
    if (userInfoDiv) userInfoDiv.classList.add("hidden");
    if (manageUsersLink) manageUsersLink.classList.add("hidden");
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.reload();
    });
  }

  // todo: Adding manage-users.html for the Owner Account to Check Accounts
  const usersTableBody = document.getElementById("users-table-body");
  const saveRolesBtn = document.getElementById("save-roles-btn");

  if (usersTableBody && saveRolesBtn) {
    if (!currentUser || currentUser.role !== "owner") {
      alert("You have no access to this");
      window.location.href = "../../public/index.html";
    } else {
      //? Showing users list without owner role
      renderUsersTable();
      saveRolesBtn.addEventListener("click", () => {
        alert("Chnages Saved");
        saveUsers();
        window.location.reload();
      });
    }
  }

  function renderUsersTable() {
    usersTableBody.innerHTML = "";
    const filtered = users.filter((u) => u.role !== "owner");

    filtered.forEach((user) => {
      const tr = document.createElement("tr");
      //*Username
      const tdUsername = document.createElement("td");
      tdUsername.textContent = user.username;
      tdUsername.classList.add("py-2", "px-4", "border");

      //*Default role
      const tdRole = document.createElement("td");
      tdRole.textContent = user.role;
      tdRole.classList.add("py-2", "px-4", "border");

      //*Change role
      const tdSelect = document.createElement("td");
      tdSelect.classList.add("py-2", "px-4", "border");
      const selectEl = document.createElement("select");
      selectEl.classList.add("border", "rounded", "p-1");
      ["admin", "writer", "user"].forEach((r) => {
        const option = document.createElement("option");
        option.value = r;
        option.textContent = r;
        if (user.role === r) option.selected = true;
        selectEl.appendChild(option);
      });
      selectEl.addEventListener("change", () => {
        user.role = selectEl.value;
      });
      tdSelect.appendChild(selectEl);

      tr.appendChild(tdUsername);
      tr.appendChild(tdRole);
      tr.appendChild(tdSelect);

      usersTableBody.appendChild(tr);
    });
  }

  // todo: blog page system. Adding and reviewing posts
  const postsContainer = document.getElementById("posts-container");
  const addPostBtn = document.getElementById("add-post-btn");

  if (postsContainer && addPostBtn) {
    renderPostsList();

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

  // todo: Card rendering
  function renderPostsList() {
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

      //* Topic settings
      const titleEl = document.createElement("h3");
      titleEl.classList.add("text-xl", "mt-2");
      titleEl.textContent = post.topic || "Without topic";
      cardDiv.appendChild(titleEl);

      //* Like
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
            renderPostsList();
          }
        });
        cardDiv.appendChild(likeBtn);
      }

      // todo: Delete post for users system
      if (
        currentUser &&
        (currentUser.role === "admin" ||
          currentUser.role === "owner" ||
          (currentUser.role === "writer" &&
            currentUser.username === post.author))
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
          posts = posts.filter((p) => p.id !== post.id);
          savePosts();
          renderPostsList();
        });
        cardDiv.appendChild(deleteBtn);
      }

      // todo: Continue post button
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

//   todo: Creatin post system
  const createPostForm = document.getElementById("create-post-form");
  if (createPostForm) {
    // todo: Stopit when the user is not logged in
    if (
      !currentUser ||
      !["admin", "writer", "owner"].includes(currentUser.role)
    ) {
      alert("You dont have permission to create");
      window.location.href = "../pages/blog.html";
    } else {
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
    }
  }

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

  // TOdo: The interface Post page 
  const postDetailsContainer = document.getElementById("post-details");
  if (postDetailsContainer) {
    const params = new URLSearchParams(window.location.search);
    const postId = parseInt(params.get("id"), 10);
    const foundPost = posts.find((p) => p.id === postId);
    if (!foundPost) {
      postDetailsContainer.innerHTML = "<p>No post had found</p>";
    } else {
      renderPostDetails(foundPost);
    }
  }

  function renderPostDetails(post) {
    postDetailsContainer.innerHTML = "";

    //*Title
    const h2 = document.createElement("h2");
    h2.classList.add("text-2xl", "font-Syne-bold", "mb-2");
    h2.textContent = post.title;
    postDetailsContainer.appendChild(h2);
    
    //*Topic
    const topicEl = document.createElement("p");
    topicEl.classList.add("text-md", "text-gray-700", "mb-2");
    topicEl.textContent = `Title: ${post.topic || "Without Title"}`;
    postDetailsContainer.appendChild(topicEl);

    //*Author
    const authorEl = document.createElement("p");
    authorEl.classList.add("text-sm", "text-gray-600", "mb-2");
    authorEl.textContent = `Writer: ${post.author} (${post.authorRole})`;
    postDetailsContainer.appendChild(authorEl);

    //*Image
    if (post.imageBase64) {
      const img = document.createElement("img");
      img.src = post.imageBase64;
      img.classList.add(
        "w-full",
        "h-auto",
        "object-cover",
        "rounded-2xl",
        "mb-4"
      );
      postDetailsContainer.appendChild(img);
    }
    
    //* main Text
    const contentEl = document.createElement("p");
    contentEl.classList.add("text-base", "mb-4");
    contentEl.textContent = post.content;
    postDetailsContainer.appendChild(contentEl);

    //* Like count
    const likesCount = document.createElement("div");
    likesCount.classList.add("text-sm", "text-gray-600", "mb-2");
    likesCount.textContent = `Likes: ${post.likes ? post.likes.length : 0}`;
    postDetailsContainer.appendChild(likesCount);

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
          renderPostDetails(post);
        }
      });
      postDetailsContainer.appendChild(likeBtn);
    } else {
      const msg = document.createElement("p");
      msg.classList.add("text-red-500", "mt-2");
      msg.textContent = "You shoukd first log in";
      postDetailsContainer.appendChild(msg);
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
        posts = posts.filter((p) => p.id !== post.id);
        savePosts();
        alert("Post is deleted");
        window.location.href = "../pages/blog.html";
      });
      postDetailsContainer.appendChild(deleteBtn);
    }

    //* Back link
    const backLink = document.createElement("a");
    backLink.textContent = "Blog page";
    backLink.href = "blog.html";
    backLink.classList.add("block", "text-orange-main", "my-8");
    postDetailsContainer.appendChild(backLink);
  }
});
