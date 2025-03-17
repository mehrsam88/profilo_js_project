import { currentUser, users, saveUsers } from "./data.js";

export function initManageUsers() {
  const usersTableBody = document.getElementById("users-table-body");
  const saveRolesBtn = document.getElementById("save-roles-btn");

  if (usersTableBody && saveRolesBtn) {
    if (!currentUser || currentUser.role !== "owner") {
      alert("You have no access to this");
      window.location.href = "../../public/index.html";
    } else {
      //? Showing users list without owner role
      renderUsersTable(usersTableBody);
      saveRolesBtn.addEventListener("click", () => {
        alert("Chnages Saved");
        saveUsers();
        window.location.reload();
      });
    }
  }
}

function renderUsersTable(usersTableBody) {
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
