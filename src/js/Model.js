/*jslint node: true, browser: true */
/*global $, jQuery*/
"use strict";

function Model() {

    var loggedIn = false;

    /*
     * Initialization of the model
     */
    this.init = function () {
        console.log("Model: Created");

        if (this.getLoginCookie() !== null) {
            loggedIn = true;
        }

        console.log("Model: Logged in: " + loggedIn);
    };

    /*
     * Logs the user into the system.
     */
    this.login = function (details) {
        console.log("Model: Attempting login");
        console.log(details);

        // TODO: Server side stuff
        // if (login is accepted) 
        this.setLoginCookie(details);
        loggedIn = true;
        // all log in works for now, for testing
        // else tell user log in is wrong
    };

    this.isLoggedIn = function () {
        return loggedIn;
    };

    this.signup = function (details) {
        console.log("Model: Attempting signup");
        console.log(details);
        // TODO: Server side stuff

        // If signup is successful, login
        this.login(details);

    };

    this.setLoginCookie = function (details) {
        console.log("Model: Attempting to set log in cookie");
        this.setCookie("login", details.username);
        this.getLoginCookie(); // remove this
    };

    this.getLoginCookie = function () {
        var username = this.getCookie('login');
        console.log('Model: Login cookie says: ' + username);
        return username;
    };

    this.logout = function () {
        console.log("Model: Attempting to Log out");
        this.deleteCookie('login');
        loggedIn = false;

        // remove below
        this.getLoginCookie();
        console.log("Model: Logged in: " + loggedIn);
    };
    
    this.getCookie = function (name) {
        var cname = name + '=', ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(cname) != -1) return c.substring(cname.length,c.length);
        }  
    }
    
    this.deleteCookie = function (name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    
    this.setCookie = function (name, info) {
        document.cookie = name + '=' + info;
        console.log("Model: Set cookie: " + name + " = " + info);
    };
}