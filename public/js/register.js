document.addEventListener('DOMContentLoaded', () => {
    // Once the HTML elements are loaded we highlight the register link on the top. If we do this, for instance, on line 1 of this file then it has no effect (it applies a style to something that does not exist yet)
    document.getElementById("registerlnk").classList.add("activelink")
    hideErr()
})

// we hide the error message div
function hideErr() {
    document.getElementById("errorMsg").style.display = "none"
}

function register() {
    hideErr()
    //we check that passwords match before sending
    if (document.getElementById("pwd1").value != document.getElementById("pwd2").value) {
        alert("Password do not match")
    } else {
        // We create the post request
        var xhr = new XMLHttpRequest()
        xhr.open("POST", "/register", true)   //true to execute the request asynchronously
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");       
         // Get the registration info
        // var formData = new FormData(document.getElementById('regform'))
        var username = document.getElementById("uname").value;
        var email = document.getElementById("email").value;
        var password = document.getElementById("pwd1").value;
        var data = JSON.stringify({
            "username": username,
            "email": email,
            "password": password
        });
        // // Send the info
        xhr.send(data);
        console.log(data);

        // Set the callback function when there is an answer from the server
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                //we read the response and take the proper action
                var obj = JSON.parse(xhr.response)
                if (obj.registered) { // user created
                    document.getElementById("snackbar").className = "show"
                    document.getElementById('regform').reset()
                } else { // user not created
                    document.getElementById("errorMsg").style.display = "block"
                }
            }
        }
    }
    // We return false because we do not want to reload the page when the form is submitted
    return false;
}