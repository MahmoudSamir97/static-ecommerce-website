const usersFromStorage = readArrayFromLocalStorage("users");
const form = document.querySelector(".form");
uField = form.querySelector(".username");
(uInput = uField.querySelector("input")),
  (pField = form.querySelector(".password")),
  (pInput = pField.querySelector("input"));

form.onsubmit = (e) => {
  console.log("clicked");
  e.preventDefault();
  if (
    pInput.value.slice(-6) == "_admin" &&
    isRegisteredBefore(uInput.value, pInput.value)
  ) {
    window.location.href = "../Admin/Main/adminDashBoard.html";
    localStorage.setItem("admin name", uInput.value);
  } else if (isRegisteredBefore(uInput.value, pInput.value)) {
    window.location.href = "../index.html";
    localStorage.setItem("user name", uInput.value);
  } else {
    uField.classList.add("error");
  }
};

function readArrayFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

function isRegisteredBefore(username, password) {
  for (let i = 0; i < usersFromStorage.length; i++) {
    if (
      usersFromStorage[i].userName == username &&
      usersFromStorage[i].password == password
    ) {
      return true;
    }
  }
  return false;
}
