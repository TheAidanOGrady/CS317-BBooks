/*jslint node: true, browser: true */
/*global $, jQuery*/
"use strict";

function View() {
    this.init = function () {
        console.log("View Created");
    };

    this.toggleLogin = function () {
        $("#login").toggleClass("hide");
        $("#home").toggleClass("hide");        
    };

    this.toggleSignup = function () {
        $("#signup").toggleClass("hide");
        $("#home").toggleClass("hide");
    };

    this.loginCallback = function (callback) {
        $("#loginButton").click(callback);
        $("#loginCancel").click(callback);
    };

    this.signupCallback = function (callback) {
        $("#signupButton").click(callback);
        $("#signupCancel").click(callback);
    };
};