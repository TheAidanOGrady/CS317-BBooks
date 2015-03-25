function View() {
    var btnLogin = document.getElementById("loginButton"),
        btnSignup = document.getElementById("signupButton");
    
    this.init = function () {
        console.log("View Created");   
    };
    
    this.setButtonClick = function (callback) {
        btnLogin.addEventListener("click", callback);
        btnSignup.addEventListener("click", callback);
    };
}