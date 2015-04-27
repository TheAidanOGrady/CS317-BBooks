/*jslint node: true, browser: true */
/*global $, jQuery*/
"use strict";


/******************* TODO **********************
*   
*   Database:
*    • Update book status
*
*   UI:
*    • Rent Button
*    • User Settings reformat
*    • Home Page set up
*    • Add Book interface
*    • Stop Books from doubling
*    • Change filter book
*
*   Model:
*    • Filtering method
*
*   Misc:
*    • Add credits in
*
************************************************/

var serverResponse = "", currentBook = {};
var user, userBooks = [], nearUsers = [];
var setLocalUser = function (data) {
    user = createUserJSON(data[0], data[1], data[2], data[3], 
                          data[4], data[5], data[6], 
                          userBooks, "",  data[7], data[8], 
                          data[9], data[10], data[11]);  
    setLoginCookie(JSON.stringify(user));
    //console.log("Model: setUser: " + JSON.stringify(user));
},
    getUserInfo = function () {
        document.getElementById("userInfo").innerHTML = JSON.stringify(user);
        return user;
},
    createUserJSON = function (ID, firstname, surname, email, 
                                postcode, credits, maxDistance, 
                                books, filter, city, likes, dislikes, lat, lng) {
    var userJSON = { 
                    "ID": ID,
                    "firstname": firstname,
                    "surname": surname,
                    "email": email,
                    "postcode": postcode,
                    "credits": parseInt(credits),
                    "maxDistance": parseInt(maxDistance),
                    "books": books,
                    "filter": filter,
                    "city": city,
                    "likes": parseInt(likes),
                    "dislikes": parseInt(dislikes),
                    "location": 
                        {
                            "lat": parseFloat(lat),
                            "lng": parseFloat(lng)
                        }
                    };
    //console.log("Model: Created UserJSON: " + JSON.stringify(userJSON));
    return userJSON;
},
    createBookJSON = function (ISBN, title, author, retail, price, cover, blurb, ownerID, genres, status) {
           var bookJSON = { 
                        "ISBN":ISBN, 
                        "title" : title, 
                        "author" : author, 
                        "retail" : retail, 
                        "price" : price, 
                        "cover" : cover,
                        "blurb" : blurb,
                        "genre" : genres.toString(),
                        "owner" : ownerID,
                        "status" : status
                        };
            //console.log("Model: Created bookJSON: \n" + JSON.stringify(bookJSON));
            return bookJSON;
},
    createLimitedUserJSON = function ( ID, firstname, email, 
                                            postcode, books, city, 
                                            likes, dislikes, lat, lng) {
        var userJSON = { 
                        "ID": parseInt(ID),
                        "firstname": firstname,
                        "email": email,
                        "postcode": postcode,
                        "books": books,
                        "city": city,
                        "likes": parseInt(likes),
                        "dislikes": parseInt(dislikes),
                        "location": 
                            {
                                "lat": parseFloat(lat),
                                "lng": parseFloat(lng)
                            },
                        "distance": getDistance([lat, lng], [user.location.lat, user.location.lng])
                        };
        //console.log("Model: Created UserLimitedJSON: " + JSON.stringify(userJSON));
        return userJSON;
},
    updateUserDatabase = function (user) {
        var details = { };
        details.id = user.ID;
        details.f_name = user.firstname;
        details.s_name = user.surname;
        details.email = user.email;
        details.postcode = user.postcode;
        details.credits = user.credits;
        details.maxDistance = user.maxDistance;
        details.latitude = user.location.lat;
        details.longitude = user.location.lng;
        $.ajax({
			url: "php/updateUser.php",
			data: details
		}).done(ajaxResponse);
        console.log("Model: Uploading local user to database: " + JSON.stringify(user));
},
    getUserBooksFromDatabase = function(id) {
		console.log("Model: Getting books");
        var details = { id: id };
        $.ajax({
			url: "php/getUserBooks.php",
            data: details
		}).done(updateUserBooksResponse);
},
    updateUserBooksResponse = function(response) {
		//console.log("SERVER: " + response);
        var parser;
        var xmlDoc;
        if (window.DOMParser) {
          parser=new DOMParser();
          xmlDoc=parser.parseFromString(response,"text/xml");
        }
        else {
          xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
          xmlDoc.async=false;
          xmlDoc.loadXML(response);
        }
        userBooks = [];
        var books = xmlDoc.getElementsByTagName("book");
        for (var i = 0; i < books.length; i++) {
            var isbn = books[i].getElementsByTagName("isbn")[0].childNodes[0].nodeValue;
            var owner = books[i].getElementsByTagName("owner")[0].childNodes[0].nodeValue;
            var title = books[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
            var author = books[i].getElementsByTagName("author")[0].childNodes[0].nodeValue;
            var blurb = books[i].getElementsByTagName("blurb")[0].childNodes[0].nodeValue;
            var genre = books[i].getElementsByTagName("genre")[0].childNodes[0].nodeValue;
            var retail = books[i].getElementsByTagName("retail")[0].childNodes[0].nodeValue;
            var price = books[i].getElementsByTagName("price")[0].childNodes[0].nodeValue;
            var status = books[i].getElementsByTagName("status")[0].childNodes[0].nodeValue;
            var time = books[i].getElementsByTagName("time")[0].childNodes[0].nodeValue;
            var book = createBookJSON(isbn, title, author, retail, price, "", blurb, owner, [""], status);
            userBooks[userBooks.length] = book;
        }
        //TODO fix
},
    getDistance = function (location, location2) {
        // distance is in Metres
        var lat1 = location[0];
        var lat2 = location2[0];
        var lon1 = location[1];
        var lon2 = location2[1];
        var R = 6371000; // metres
        var r1 = lat1 * Math.PI / 180;
        var r2 = lat2 * Math.PI / 180;
        var d1 = (lat2-lat1) * Math.PI / 180;
        var d2 = (lon2-lon1) * Math.PI / 180;
        var a = Math.sin(d1/2) * Math.sin(d1/2) +
                Math.cos(r1) * Math.cos(r2) *
                Math.sin(d2/2) * Math.sin(d2/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        var distance = R * c;
        //console.log("Model: Distance between two points: " + Math.round(distance) + "m");
        return Math.round(distance);
},
    setCookie = function (name, info) {
        document.cookie = name + '=' + info;
        //console.log("Model: Set cookie: " + name + " = " + info);
},
    setLoginCookie = function (details) {
        //console.log("Model: Attempting to set log in cookie: " + details);
        setCookie("login", details);
},
    addBookToUser = function (user, book) {
        userBooks[userBooks.length] = book;
        user.books = userBooks;
},
    setUserLocation = function(location) {
        user.location.lat = location[0];
        user.location.lng = location[1];
        updateUserDatabase(user);
},
    ajaxResponse = function (response) {
        console.log(response);
};

function Model() {

    var map,
        lastInfoWindow,
        lastScreen,
        books = [],
        fBooks = [],
        markers = [],
        useFilter = false,
        filterBook,
        loggedIn = false,
		currentBook,
        coords;
    
    /*
     * Initialization of the model
     */
    this.init = function () {
        console.log("Model: Created");
        this.getBookInfo("0575094184");
        // ignore JSLints suggestion to change != to !==
        if (this.getLoginCookie() != null) {
            loggedIn = true;
            user = JSON.parse(this.getLoginCookie());
            getUserBooksFromDatabase(user.ID);
            getUserInfo();
            this.getNearUsersFromDatabase();
            console.log(nearUsers);
        }
        
        // TODO location storage
        //this.copyBooksToFBooks(books, fBooks);
        //this.setFilterBook(book3);
        //var users = this.getLimitedUsers();
        //this.addBooksToMap(users, filterBook);
        //this.updateBooks();
        console.log("Model: Logged in: " + loggedIn);
    };

    /*
     * Logs the user into the system.
     */
    this.login = function (details) {
        console.log("Model: Attempting login");
        $.ajax({
			url: "php/login.php",
			data: details
		}).done(this.loginResponse);
        this.init();
    };
	
	this.loginResponse = function (response) {
		if (response != "err-wrongdata") {
            serverResponse = response.split(",");
            getUserBooksFromDatabase(serverResponse[0]);
			loggedIn = true;
            setLocalUser(serverResponse);
            getUserInfo();
		} else {
			// Handle error messages:
			// err-wrongdata : email or password is invalid
			// err-nodata : nothing was entered
			// err-noemail : email was not entered
			// err-nopw : password was not entered
		}
	};
    
    this.isLoggedIn = function () {
        return loggedIn;
    };

    this.signup = function (details) {
        var keys = Object.keys(details);
        console.log("Model: Attempting signup");

        if(!details.firstName){
            alert("Please enter your first name.");
            return;
        }

        if(!details.lastName){
            alert("Please enter your last name.");
            return;
        }

        if(!details.email){
            alert("Please enter your email.");
            return;
        }

        if(!details.password){
            alert("Please enter your password.");
            return;
        }

        if(!details.password2){
            alert("Please re-enter your password.");
            return;
        }

        if(!details.postcode){
            alert("Please enter your postcode.");
            return;
        }
        

        if(details.password !== details.password2){
            alert("Passwords do not match. Please try again");
            return;
        }
        
        $.ajax({
            url: "php/register.php",
            data: details
        }).done(this.signupResponse);
    };
	
	this.signupResponse = function(response) {
		//console.log("SERVER: " + response);
		if (response === "OK")
		{
			//this.login(details); // fix this somehow...
		}
		else {
			// Handle error messages:
			// err-email : email is already registered
		}
		
	};

    this.getLoginCookie = function () {
        var username = this.getCookie('login');
        //console.log('Model: Login cookie says: ' + username);
        return username;
    };

    this.logout = function () {
        console.log("Model: Attempting to Log out");
        this.deleteCookie('login');
        localStorage.user = null; 
        loggedIn = false;
        userBooks = [];

		$.ajax({
			url: "php/logout.php"
		}).done(function(response) {
			console.log("SERVER LOGOUT: " + response);
		});
        // remove below
        this.getLoginCookie();
        console.log("Model: Logged in: " + loggedIn);
    };

    this.getLoggedIn = function () {
        return loggedIn;
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
    
    this.clearBooksFromMap = function() {
        console.log("Model: Clearing Map");
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    };
    
    this.addUserToMap = function () {

    };
    
    this.createMap = function() {
        var myLatlng = new google.maps.LatLng(55.8580,-4.2590) // middle of Glasgow
        var mapOptions = {
            zoom: 11,
            center: myLatlng
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        google.maps.event.addListener(map, 'zoom_changed', function() {
            var maxZoomLevel = 10;
            if (map.getZoom() < maxZoomLevel) map.setZoom(maxZoomLevel);
        });
    };
    
    this.addBooksToMap = function(users, filterBook) {
        var users = nearUsers;
        this.clearBooksFromMap();
        console.log("Model: Adding Books to Map");
        
        var selficon = {
            path: "M12,2C15.31,2 18,4.66 18,7.95C18,12.41 12,19 12,19C12,19 6,12.41 6,7.95C6,4.66 8.69,2 12,2M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M20,19C20,21.21 16.42,23 12,23C7.58,23 4,21.21 4,19C4,17.71 5.22,16.56 7.11,15.83L7.75,16.74C6.67,17.19 6,17.81 6,18.5C6,19.88 8.69,21 12,21C15.31,21 18,19.88 18,18.5C18,17.81 17.33,17.19 16.25,16.74L16.89,15.83C18.78,16.56 20,17.71 20,19Z",
            fillColor: "#2196f3",
            fillOpacity: 1
        };
        var circle = new google.maps.Circle({
          map: map,
          radius: user.maxDistance,
          fillColor: '#e3f2fd'
        });
        var myLatLng = new google.maps.LatLng(user.location.lat, user.location.lng);
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            user: user,
            icon: selficon
        });
        circle.bindTo('center', marker, 'position');
        
        
        for (var j = 0; j < users.length; j++) {
            var cuser = users[j];
            if (cuser.distance <= user.maxDistance && cuser.ID != user.ID) {
                for (var i = 0; i < cuser.books.length; i++) {
                    
                    var books = cuser.books[i];
                    var myLatLng = new google.maps.LatLng(cuser.location.lat, cuser.location.lng);

                    var bookicon = {
                        fillColor: 'red',
                        path: "M11,19V9A2,2 0 0,0 9,7H5V17H9A2,2 0 0,1 11,19M13,9V19A2,2 0 0,1 15,17H19V7H15A2,2 0 0,0 13,9M21,19H15A2,2 0 0,0 13,21H11A2,2 0 0,0 9,19H3V5H9A2,2 0 0,1 11,7H13A2,2 0 0,1 15,5H21V19Z"
                    };
                    var icon = {
                        fillColor: '#f44336',
                        fillOpacity: 1,
                        path: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"
                    };
                    var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: map,
                        user: cuser,
                        icon: icon,
                        books: books
                    });
                    markers[i] = marker;
                    google.maps.event.addListener(marker, 'click', function() {
                        var cuser = this.user;
                        var total = cuser.dislikes + cuser.likes
                        var rating = Math.round((cuser.likes / total) * 100);
                        var distance = cuser.distance;
                        $('#searchModal .modal-content .collection').empty();
                        $('#searchModal .modal-content #modalUser').text(cuser.firstname + " - " + 
                                                                         rating + "% (" + 
                                                                         total + ") - " + 
                                                                         Math.round(distance / 1000) + 'km');
                        for (var e = 0; e < cuser.books.length; e++) {
                            if (useFilter) {
                                if (cuser.books[e].title == filterBook.title) {
                                    var book = cuser.books[e],
                                    bookSource   = $("#cBookTemplate").html(),
                                    bookTemplate = Handlebars.compile(bookSource),
                                    context = { 
                                        title: book.title,
                                        author: book.author,
                                        guarantee: book.price},
                                    html = bookTemplate(context);
                                    $('#searchModal .modal-content .collection').append(html);  
                                } 
                            } else {
                                var book = cuser.books[e],
                                bookSource   = $("#cBookTemplate").html(),
                                bookTemplate = Handlebars.compile(bookSource),
                                context = { 
                                    user: book.owner,
                                    title: book.title,
                                    author: book.author,
                                    guarantee: book.price},
                                html = bookTemplate(context);
                                $('#searchModal .modal-content .collection').append(html);  
                            }
                        }
                        $('#searchModal').openModal();

                    });
                }
            } else {
                //console.log("user out of distance");   
            }
        }
    };
    
    this.getMap = function () {
        return map;   
    };
    
    this.getLastScreen = function() {
        if (lastScreen == null) {
            lastScreen = localStorage.lastScreen;   
        }
        //console.log("Model: Get Last screen: " + lastScreen);
        return lastScreen;
    };
    
    this.setLastScreen = function(screen) {
        lastScreen = screen;
        if (localStorage) {
            localStorage.lastScreen = lastScreen;
        }
        //console.log("Model: Set Last screen: " + lastScreen);
    };
    
    this.copyBooksToFBooks = function(books, fBooks) {
        console.log("Model: Setting fBooks back to original Array");
        for (var i = 0; i < books.length; i++) {
            fBooks[i] = books[i];
        }
    };
    
    this.getFilteredBooks = function() {
        return fBooks;    
    };
    
    this.getFilterBook = function() {
        return filterBook;
    };
    
    this.setFilterBook = function(fBook) {
        filterBook = fBook;  
    };
    
    this.setUseFilter = function(boolean) {
        useFilter = boolean;  
    };
    
    this.getUseFilter = function () {
        return useFilter;   
    };
    
    this.getBooks = function () {
        return books;  
    };
    
    this.amendUserDetails = function ( firstname, surname, email, postcode, 
                                        maxDistance, city, lat, lng) {
        if (firstname == "") firstname = user.firstname;
        if (surname == "") surname = user.surname;
        if (email == "") email = user.email;
        if (postcode == "") postcode = user.postcode;
        if (isNaN(maxDistance)) maxDistance = user.maxDistance;
        if (city == "") city = user.city;
        if (lat == "") lat = user.location.lat;
        if (lng == "") lng = user.location.lng;
        user = createUserJSON(user.ID, firstname, surname, 
                                   email, postcode, user.credits, 
                                   maxDistance, user.books, user.filter, 
                                   user.city, user.likes, user.dislikes, lat, lng);
        updateUserDatabase(user);
        setLoginCookie(JSON.stringify(user));
        this.addBooksToMap(nearUsers, filterBook);
    };
    
    this.getUserInfo = function () {
        document.getElementById("userInfo").innerHTML = JSON.stringify(user);
        if (localStorage) {
            localStorage.user = JSON.stringify(user);   
        }
        return user;
    };
    
    this.getUserLocation = function() {
        this.getLocation(function (returnVal) {
            if (localStorage) {
                localStorage.coords = [returnVal.latitude, returnVal.longitude];
                setUserLocation([returnVal.latitude, returnVal.longitude]);
            }
        });

    };
    
    this.filterBooks = function(filter) {
        if (filter != null) {
            console.log("Model: Filtering Books With Filter: " + JSON.stringify(filter));
            // keep track of number of books remaining
            fBooks = [];
            var booksFiltered = 0;
            for (var i = 0; i < books.length; i++) {
                // TODO add additional filters
                if (books[i].title == filter.title) {
                    console.log("Model: Title Match");
                    fBooks[booksFiltered] = books[i];   
                    booksFiltered++;
                }
            }
            //console.log("Model: Books Found: " + booksFiltered);
        }
    }

	this.setCurrentBook = function(book) {
		currentBook = book;
	};
	
	this.addBookToBooks = function(book, books) {
		books[books.length] = book;
		//console.log("Model: Adding book to Books: " + JSON.stringify(book));
	};
	
	this.getCurrentBook = function() {
		/*var currentBook =   createBookJSON("185326041X", "The Great Gatsby", "F. Scott Fitzgerald",
						"£10", "£8", "testbookimg/185326041X.jpg",
						"Old Money looks sourly upon New. Money and the towns are abuzz about where and how Mr. Jay. Gatsby came by all of his money!",
						"A. N. Owner", ["Novel", "Fiction", "Drama"], "Awaiting Postage");*/
		//console.log("Model: Returning current book: " + JSON.stringify(currentBook));
		return currentBook;
	};

	
	/*
	
	this.getUserBooksFromDatabase = function(details) {
		console.log("Model: Getting books");
		var refToModel = this;
        $.ajax({
			url: "php/getBooks.php",
			success: function(response) { refToModel.updateBooksResponse(response) }
		});
	
	this.updateBooksResponse = function(response) {
		console.log("SERVER: " + response);
		
		// clear the books array
		//user.books = [];
		
		// populate the new array from response (xml)
		var xml = $.parseXML(response);
		console.log(this);
		var data = xml.getElementsByTagName("book");
		for (var i = 0; i < data.length; i++)
		{
			var book = this.createBookJSON(data[i].children[0].textContent, data[i].children[1].textContent, data[i].children[2].textContent,
						data[i].children[5].textContent, data[i].children[6].textContent, "testbookimg/185326041X.jpg",
						data[i].children[3].textContent,
						"A. N. Owner", [data[i].children[4].textContent], data[i].children[8].textContent);
			this.addBookToUser(user, book);
			console.log(data);
		}
		// refresh the screen
	};
	
	*/
	
	this.getUserBooksFromDatabase = function(details) {
		console.log("Model: Getting books");
		var refToModel = this;
        $.ajax({
			url: "php/getUserBooks.php",
            data: details
		}).done(this.updateUserBooksResponse);
	};
	
	this.updateUserBooksResponse = function(response) {
		//console.log("SERVER: " + response);
        userBooks = [];
        var parser;
        var xmlDoc;
        if (window.DOMParser) {
          parser=new DOMParser();
          xmlDoc=parser.parseFromString(response,"text/xml");
        }
        else {
          xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
          xmlDoc.async=false;
          xmlDoc.loadXML(response);
        }
        var books = xmlDoc.getElementsByTagName("book");
        for (var i = 0; i < books.length; i++) {
            var isbn = books[i].getElementsByTagName("isbn")[0].childNodes[0].nodeValue;
            var owner = books[i].getElementsByTagName("owner")[0].childNodes[0].nodeValue;
            var title = books[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
            var author = books[i].getElementsByTagName("author")[0].childNodes[0].nodeValue;
            var blurb = books[i].getElementsByTagName("blurb")[0].childNodes[0].nodeValue;
            var genre = books[i].getElementsByTagName("genre")[0].childNodes[0].nodeValue;
            var retail = books[i].getElementsByTagName("retail")[0].childNodes[0].nodeValue;
            var price = books[i].getElementsByTagName("price")[0].childNodes[0].nodeValue;
            var status = books[i].getElementsByTagName("status")[0].childNodes[0].nodeValue;
            var time = books[i].getElementsByTagName("time")[0].childNodes[0].nodeValue;
            var book = createBookJSON(isbn, title, author, retail, price, "", blurb, owner, [""], status);
            userBooks[userBooks.length] = book;
        }
	};
    
    this.getNearUsers = function() {
        return nearUsers;
    };
     
    this.getNearUsersFromDatabase = function() {
		console.log("Model: Getting NearUsers");
		var refToModel = this;
        $.ajax({
			url: "php/getNearUsers.php"
		}).done(this.getNearUsersResponse);
	};
	
	this.getNearUsersResponse = function(response) {
		//console.log("SERVER: " + response);
        var parser;
        var xmlDoc;
        if (window.DOMParser) {
          parser=new DOMParser();
          xmlDoc=parser.parseFromString(response,"text/xml");
        }
        else {
          xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
          xmlDoc.async=false;
          xmlDoc.loadXML(response);
        }
        var users = xmlDoc.getElementsByTagName("user");
        for (var i = 0; i < users.length; i++) {
            var books = users[i].getElementsByTagName("book");
            var booksArray = [];
            for (var j = 0; j < books.length; j++) {
                var isbn = books[j].getElementsByTagName("isbn")[0].childNodes[0].nodeValue;
                var owner = books[j].getElementsByTagName("owner")[0].childNodes[0].nodeValue;
                var title = books[j].getElementsByTagName("title")[0].childNodes[0].nodeValue;
                var author = books[j].getElementsByTagName("author")[0].childNodes[0].nodeValue;
                var blurb = books[j].getElementsByTagName("blurb")[0].childNodes[0].nodeValue;
                var genre = books[j].getElementsByTagName("genre")[0].childNodes[0].nodeValue;
                var retail = books[j].getElementsByTagName("retail")[0].childNodes[0].nodeValue;
                var price = books[j].getElementsByTagName("price")[0].childNodes[0].nodeValue;
                var status = books[j].getElementsByTagName("status")[0].childNodes[0].nodeValue;
                var time = books[j].getElementsByTagName("time")[0].childNodes[0].nodeValue;
                var book = createBookJSON(isbn, title, author, retail, price, "", blurb, owner, [""], status);
                booksArray[booksArray.length] = book;
            }
            var id = users[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
            var fn = users[i].getElementsByTagName("firstname")[0].childNodes[0].nodeValue;
            var em = users[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
            var pc = users[i].getElementsByTagName("postcode")[0].childNodes[0].nodeValue;
            var ci = users[i].getElementsByTagName("city")[0].childNodes[0].nodeValue;
            var li = users[i].getElementsByTagName("likes")[0].childNodes[0].nodeValue;
            var ds = users[i].getElementsByTagName("dislikes")[0].childNodes[0].nodeValue;
            var lt = users[i].getElementsByTagName("latitude")[0].childNodes[0].nodeValue;
            var ln = users[i].getElementsByTagName("longitude")[0].childNodes[0].nodeValue;
            var luser = createLimitedUserJSON(id, fn, em, pc, booksArray, ci, li, ds, lt, ln);
            nearUsers[nearUsers.length] = luser;
        }
	};
    
    this.getLocation = function (callback) {
        navigator.geolocation.getCurrentPosition(
              function (position) {
                var returnValue = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                }
                callback(returnValue);
              }
            )
    };
    
    this.getUser = function () {
        return user;  
    };
    
    this.getUsersBooks = function () {
        return userBooks;
    };
    
    this.getBookInfo = function (isbn){
        setTimeout(this.loadJSON(isbn), 100);
        setTimeout(this.loadPrices(isbn), 1000);
    };
            
    this.loadPrices = function (isbn) {
        //PHP proxy file needed as devweb doesn't allow cross-site Javascript
        var result = "php/bookPrices.php?isbn=" + isbn;
        var http_request = new XMLHttpRequest();
        try{
            http_request = new XMLHttpRequest();    
        } catch (e){
            console.log("Ajax error");
            return false;
        }
        
        http_request.onreadystatechange  = function(){
            if (http_request.readyState == 4)  {
                //JSON object containing all book data
                var book = JSON.parse(http_request.responseText);
                var i = 0;
                var price = 0;
                while(book.data[i]){
                    price += parseFloat(book.data[i].price);
                    i++;
                }
                //Average price in dollars
                price = price / i+1;
                price *= 0.67;
                price = price.toFixed(2);
                var retail = "£" + price;
                //console.log(currentBook);
                currentBook = createBookJSON(currentBook.ISBN, currentBook.title, currentBook.author, retail, 0, "", currentBook.blurb, user.ID, [""], 0);
                console.log(currentBook);
            }
        }
        http_request.open("GET", result, true);
        http_request.send();
    };

    this.loadJSON = function(isbn) {
        //PHP proxy file needed as devweb doesn't allow cross-site Javascript
        var result = "php/bookInfo.php?isbn=" + isbn;
        var http_request = new XMLHttpRequest();
        try{
            http_request = new XMLHttpRequest();
        } catch (e){
            console.log("Ajax error");
            return false;
         }
        http_request.onreadystatechange  = function(){
            if (http_request.readyState == 4) {
                //JSON object containing all book data
                console.log(http_request.responseText);
                var book = JSON.parse(http_request.responseText);
                var title, author, blurb;
                //Check to see if book was actually found
                if(typeof book.data[0].title != 'undefined') {
                    //Display Title
                    title = book.data[0].title;
                    if(typeof book.data[0].author_data[0] != 'undefined') {
                        //Display 1st Author's name (if available)
                        author = book.data[0].author_data[0].name;
                    }
                    if(typeof book.data[0].summary != 'undefined' && book.data[0].summary != "") {
                        //Display Summary of Book (if available)
                        blurb = book.data[0].summary;
                    }
                    currentBook = createBookJSON(isbn, title, author, 0, 0, "", blurb, user.ID, [""], 0);
                } 
            }
        }
        http_request.open("GET", result, true);
        http_request.send();
    }
    };
