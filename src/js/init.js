/*jslint node: true, browser: true */
/*global $, jQuery*/
"use strict";

(function ($) {
    $(function () {

        $('.button-collapse').sideNav();

        $(document).ready(function () {
            $("#login").hide();
            $("#signup").hide();
            $("#home").show();
            $('.slider').slider({full_width: true});

            $("#loginButton").click(function(){
                $("#login").show();
                $("#home").hide();
            });

            $("#signupButton").click(function(){
                $("#signup").show();
                $("#home").hide();
            });

            $("#loginCancel").click(function(){
                $("#login").hide();
                $("#home").show();
            });

            $("#signupCancel").click(function(){
                $("#signup").hide();
                $("#home").show();
            });
        });
    }); // end of document ready
}(jQuery)); // end of jQuery name space

