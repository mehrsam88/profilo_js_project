import { initData } from "./data.js";
import { initAuth } from "./auth.js";
import { initManageUsers } from "./manageUsers.js";
import { initBlog } from "./blog.js";
import { initCreatePost } from "./createPost.js";
import { initPostDetails } from "./postDetails.js";
import { initQuote } from "./api/quote.js";
initData();
document.addEventListener("DOMContentLoaded", () => {
  initAuth();
  initManageUsers();
  initBlog();
  initCreatePost();
  initPostDetails();
  initQuote();
});
