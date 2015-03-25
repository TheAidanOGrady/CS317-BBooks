/*jslint node: true, browser: true */
/*global $, jQuery*/
"use strict";

(function ($) {
    $(function () {

        $('.button-collapse').sideNav();

		$(document).ready(function(){
			$('.slider').slider({full_width: true});
		});
    }); // end of document ready
}(jQuery)); // end of jQuery name space

