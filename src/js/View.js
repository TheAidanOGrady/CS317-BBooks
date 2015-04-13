/*jslint node: true, browser: true */
/*global $, jQuery*/
"use strict";

function View() {

    /*
     * Initialization of the view
     */
    this.init = function () {
        console.log("View Created");
    };


    /***************************************************************************
     *
     * GET INFORMATION FROM DOM
     *
     **************************************************************************/

    /*
     * Gets the user details from the login form.
     */
    this.getLogin = function () {
        var details = {};
        details.username = $("#loginForm :input[name=email]").val();
        details.password = $("#loginForm :input[name=password]").val();
        return details;
    };

    /*
     * Gets the user details from the signup form.
     */
    this.getSignup = function () {
        var details = {};
        details.firstName = $("#signupForm :input[name=firstName]").val();
        details.lastName = $("#signupForm :input[name=lastName]").val();
        details.email = $("#signupForm :input[name=email]").val();
        details.password = $("#signupForm :input[name=password]").val();
        details.password2 = $("#signupForm :input[name=passwordConfirm]").val();
        return details;
    };

    /***************************************************************************
     *
     * DISPLAY CHANGING
     *
     **************************************************************************/

    /*
     * Switches between the login and home page.
     */
    this.toggleLogin = function () {
        $("#login").toggleClass("hide");
        $("#home").toggleClass("hide");
    };

    /*
     * Switches between the signup and home page.
     */
    this.toggleSignup = function () {
        $("#signup").toggleClass("hide");
        $("#home").toggleClass("hide");
    };


    /***************************************************************************
     *
     * BUTTON CALLBACKS
     *
     **************************************************************************/

    this.loginCallback = function (callback) {
        $("#loginButton").click(callback);
        $("#loginCancel").click(callback);
    };

    this.signupCallback = function (callback) {
        $("#signupButton").click(callback);
        $("#signupCancel").click(callback);
    };

    this.loginConfirmCallback = function (callback) {
        $("#loginConfirm").click(callback);
    };

    this.signupConfirmCallback = function (callback) {
        $("#signupConfirm").click(callback);
    };
}