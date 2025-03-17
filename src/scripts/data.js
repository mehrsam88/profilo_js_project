//? variables
export let users = [];
export let posts = [];
export let currentUser = null;

// todo: upload data
export function initData() {
  // todo: Add a owner account
  const defaultOwner = {
    username: "creator",
    password: "secretCreator",
    role: "owner",
  };

  // todo: Getting users lists
  let storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  if (!storedUsers.some((u) => u.username === defaultOwner.username)) {
    storedUsers.push(defaultOwner);
    localStorage.setItem("users", JSON.stringify(storedUsers));
  }
  users = storedUsers;

  // todo: getting posts data from local storage
  let storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
  posts = storedPosts;

  // todo: Checking Login account
  let storedCurrentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
  currentUser = storedCurrentUser;
}

// todo: Adding functions to localStorage
export function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}
export function savePosts() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

//*Settings user
export function setCurrentUser(user) {
  currentUser = user;
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("currentUser");
  }
}
