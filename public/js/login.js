document.addEventListener('DOMContentLoaded', () => {
    // Once the HTML elements are loaded we highlight the log in link on the top. If we do this, for instance, on line 1 of this file then it has no effect (it applies a style to something that does not exist yet)
    document.getElementById("loginlnk").classList.add("activelink")
})