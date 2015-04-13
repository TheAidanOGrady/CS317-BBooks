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
        details.username = $("#loginForm :input[name=username]").val();
        details.password = $("#loginForm :input[name=password]").val();
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
}