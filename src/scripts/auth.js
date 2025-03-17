import { users, currentUser, saveUsers, setCurrentUser } from "./data.js";

// todo: login / sign in system wtih navs details
export function initAuth() {
  // todo: Signin account system
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

  // todo: Login system
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
      setCurrentUser(foundUser);
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
}
