/*jslint node: true, browser: true */
/*global $, jQuery*/
"use strict";

function Model() {

    var map,
        lastInfoWindow,
        lastScreen,
        books = [],
        fBooks = [],
        markers = [],
        useFilter = false,
        filterBook,
        loggedIn = true,
        user, // local user
		currentBook;

    
    //remove below
    var book1, book2, book3, book4;
    
    /*
     * Initialization of the model
     */
    this.init = function () {
        console.log("Model: Created");
        // ignore JSLints suggestion to change != to !==
        if (this.getLoginCookie() != null) {
            loggedIn = true;
        }
        console.log("Model: Logged in: " + loggedIn);
        user = this.getUserInfo();
        //remove below
        user = this.getUserInfo();
        var book1 = this.createBookJSON("185326041X", "The Great Gatsby", "F. Scott Fitzgerald",
                                        "£10", "£8", "testbookimg/185326041X.jpg",
                                        "Old Money looks sourly upon New. Money and the towns are abuzz about where and how Mr. Jay. Gatsby came by all of his money!",
                                        user.ID, ["Novel", "Fiction", "Drama"], "On Loan"),
            book5 = this.createBookJSON("185326041X", "Great Gatsby", "F. Scott Fitzgerald",
                                        "£10", "£8", "testbookimg/185326041X.jpg",
                                        "Old Money looks sourly upon New. Money and the towns are abuzz about where and how Mr. Jay. Gatsby came by all of his money!",
                                        user.ID, ["Novel", "Fiction", "Drama"], "On Loan"),
            book2 = this.createBookJSON("0575094184", "Do Androids Dream of Electric Sheep?", "Philip K. Dick",
                                        "£7", "£3.50", "testbookimg/0575094184.jpg",
                                        "Do Androids Dream of Electric Sheep? is a book that most people think they remember, and almost always get more or less wrong.",
                                        user.ID,  ["Sci-Fi, Dystopia"], "On Loan"),
            book3 = this.createBookJSON("0575094184", "Do Androids Dream of Electric Sheep?", "Philip K. Dick",
                                        "£6", "£3.00", "testbookimg/0575094184.jpg",
                                        "Do Androids Dream of Electric Sheep? is a book that most people think they remember, and almost always get more or less wrong.",
                                        user.ID, ["Sci-Fi", "Dystopia"], "Awaiting Collection"), 
            book4 = this.createBookJSON("0241950430", "The Catcher in the Rye", "J. Salinger",
                                        "£4.50", "£2.50", "testbookimg/0241950430.jpg",
                                        "Since his debut in 1951 as The Catcher in the Rye, Holden Caulfield has been synonymous with 'cynical adolescent'.",
                                        1, ["Fiction"], "Available");
        this.addBookToUser(user, book1);
		this.addBookToUser(user, book2);
		this.addBookToUser(user, book3);
		this.addBookToUser(user, book4);
        this.copyBooksToFBooks(books, fBooks);
        this.setFilterBook(book3);
        var users = this.getLimitedUsers();
        this.addUserToMap(user);
        this.addBooksToMap(users, filterBook);
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
    };
	
	this.loginResponse = function(response) {
		console.log("SERVER: " + response);
		if (response === "OK") {
			//this.setLoginCookie(details); fix this somehow....
			loggedIn = true;
		}
		else {
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
        console.log("Model: Attempting signup");
        $.ajax({
			url: "php/register.php",
			data: details
		}).done(this.signupResponse);
    };
	
	this.signupResponse = function(response) {
		console.log("SERVER: " + response);
		if (response === "OK")
		{
			//this.login(details); // fix this somehow...
		}
		else {
			// Handle error messages:
			// err-email : email is already registered
		}
		
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
    
    this.setCookie = function (name, info) {
        document.cookie = name + '=' + info;
        console.log("Model: Set cookie: " + name + " = " + info);
    };
    
    this.createMap = function() {
        var myLatlng = new google.maps.LatLng(55.8580,-4.2590) // middle of Glasgow
        var mapOptions = {
            zoom: 11,
            center: myLatlng
        };

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    };
    
    this.clearBooksFromMap = function() {
        console.log("Model: Clearing Map");
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    };
    
    this.addUserToMap = function (user) {
        // show users location on map
    };
    
    this.addBooksToMap = function(users, filterBook) {
        this.clearBooksFromMap();
        console.log("Model: Adding Books to Map");
        for (var j = 0; j < users.length; j++) {
            var cuser = users[j];
            if (cuser.distance <= user.maxDistance) {
                for (var i = 0; i < cuser.books.length; i++) {
                    var books = cuser.books[i];
                    var myLatLng = new google.maps.LatLng(cuser.location.lat, cuser.location.lng);
                    var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: map,
                        user: cuser,
                        books: books
                    });
                    markers[i] = marker;
                    google.maps.event.addListener(marker, 'click', function() {
                        var cuser = this.user;
                        var total = cuser.dislikes + cuser.likes;
                        var rating = Math.round((cuser.likes / total) * 100);
                        var distance = cuser.distance;
                        $('#searchModal .modal-content .collection').empty();
                        $('#searchModal .modal-content #modalUser').text(cuser.firstname + " - " + 
                                                                         rating + "% (" + 
                                                                         total + ") - " + 
                                                                         distance + "km");
                        for (var e = 0; e < cuser.books.length; e++) {
                            if (useFilter) {
                                if (user.books[e].title == filterBook.title) {
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
                                var book = user.books[e],
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
                console.log("user out of distance");   
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
        console.log("Model: Get Last screen: " + lastScreen);
        return lastScreen;
    };
    
    this.setLastScreen = function(screen) {
        lastScreen = screen;
        if (localStorage) {
            localStorage.lastScreen = lastScreen;
        }
        console.log("Model: Set Last screen: " + lastScreen);
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
    
    this.getUserInfo = function () {
        // return information about user from server
        // param emails
        var books = [];
        if (user == null) {
            var user = this.createUserJSON("5", "Adam", "Manner", 
                               "amanner@gmail.com", "G56", 
                               "paypal", 6, books, "filter", 
                               "Glasgow", 10, 6, 55.8580,-4.2590);
        }
        
        //TODO MVC 
        document.getElementById("userInfo").innerHTML = JSON.stringify(user);
        return user;
    };
    
    this.setUserLocation = function(user) {
        var location = this.getLocation();
        console.log(location);
        this.createUserJSON(user.firstname, user.surname, user.email, 
                            user.postcode, user.payment, user.maxDistance,
                            user.books, user.filter, user.city, user.likes,
                            user.dislikes, location[0], location[1]);
                    if (localStorage) {
                console.log(localStorage.coord);
            }
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
                    console.log(books[i].title + ":" + filter.title);
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
		var currentBook =   this.createBookJSON("185326041X", "The Great Gatsby", "F. Scott Fitzgerald",
						"£10", "£8", "testbookimg/185326041X.jpg",
						"Old Money looks sourly upon New. Money and the towns are abuzz about where and how Mr. Jay. Gatsby came by all of his money!",
						"A. N. Owner", ["Novel", "Fiction", "Drama"], "Awaiting Postage");
		//console.log("Model: Returning current book: " + JSON.stringify(currentBook));
		return currentBook;
	};
    
    this.getDistance = function (location, location2) {
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
        console.log("Model: Distance between two points: " + Math.round(distance) + "m");
        return Math.round(distance / 1000);
    };
    
    this.getLocation = function (user) {
        navigator.geolocation.getCurrentPosition(foundLocation);
        function foundLocation(position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            if (localStorage) {
                localStorage.lastcoord = [lat, long];
            }
        }
        console.log(localStorage.lastcoord);
    };
    
    this.getUser = function () {
        return user;  
    };
    
    this.getUsersBooks = function () {
        console.log("user books "+ user.books);
        return user.books;  
    };
    
    this.addBookToUser = function (user, book) {
          user.books[user.books.length] = book;
    };
    
    this.getLimitedUsers = function() {
        // return all users with limited info
        // location, name, email, books
        var users;
        var fakeBooks1 = [  this.createBookJSON("0575094184", "Do Androids Dream of Electric Sheep?", "Philip K. Dick",
                                                "£7", "£3.50", "testbookimg/0575094184.jpg",
                                                "Do Androids Dream of Electric Sheep? is a book that most people think they remember, and almost always get more or less wrong.",
                                                0, ["Sci-Fi, Dystopia"], "Available")];
        
        var fakeBooks2 = [  this.createBookJSON("0575094184", "Do Androids Dream of Electric Sheep?", "Philip K. Dick",
                                                "£6", "£3.00", "testbookimg/0575094184.jpg",
                                                "Do Androids Dream of Electric Sheep? is a book that most people think they remember, and almost always get more or less wrong.",
                                                1, ["Sci-Fi", "Dystopia"],  "Awaiting Collection"), 
                            this.createBookJSON("0241950430", "The Catcher in the Rye", "J. Salinger",
                                                "£4.50", "£2.50", "testbookimg/0241950430.jpg",
                                                "Since his debut in 1951 as The Catcher in the Rye, Holden Caulfield has been synonymous with 'cynical adolescent'.",
                                                1, ["Fiction"], "Available")];
        var fakeBooks3 = [  this.createBookJSON("185326041X", "Great Gatsby", "F. Scott Fitzgerald",
                                                "£10", "£8", "testbookimg/185326041X.jpg",
                                                "Old Money looks sourly upon New. Money and the towns are abuzz about where and how Mr. Jay. Gatsby came by all of his money!",
                                                2, ["Novel", "Fiction", "Drama"], "On Loan")];
        var fakeuser1 = this.createLimitedUserJSON(0, "Paul", "paul@paul.com", "G55", fakeBooks1, "Glasgow", 10, 5, 55.858736, -4.256491);
        var fakeuser2 = this.createLimitedUserJSON(1, "John", "john@john.com", "G52", fakeBooks2, "Glasgow", 16, 8, 55.865431, -4.264645);
        var fakeuser3 = this.createLimitedUserJSON(2, "Jim",   "jim@jim.com", "G44", fakeBooks3, "Glasgow", 16, 3, 55.805612, -4.239677);
        users = [fakeuser1, fakeuser2, fakeuser3];
        return users;
    };
    
    this.getNearUsers = function (user, users) {
        // return all users within distance
        var nearUsers, j = 0;
        if (this.getDistance([users[i].location.lat, users[i].location.lng], [user.location.lat, user.location.lng]) < user.maxDistance) {
            nearUsers[j++] = users[i];
        }
        return nearUsers;
    };
    
    /** JSON CREATION **/
    this.createBookJSON = function (ISBN, title, author, retail, price, cover, blurb, ownerID, genres, status) {
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
    };
    this.createUserJSON = function (ID, firstname, surname, email, 
                                    postcode, payment, maxDistance, 
                                    books, filter, city, likes, dislikes, lat, lng) {
        var userJSON = { 
                        "ID": ID,
                        "firstname": firstname,
                        "surname": surname,
                        "email": email,
                        "postcode": postcode,
                        "payment": payment,
                        "maxDistance": maxDistance,
                        "books": books,
                        "filter": filter,
                        "city": city,
                        "likes": likes,
                        "dislikes": dislikes,
                        "location": 
                            {
                                "lat":lat,
                                "lng":lng
                            }
                        };
        //console.log("Model: Created UserJSON: " + JSON.stringify(userJSON));
        return userJSON;
    };
    
    this.createLimitedUserJSON = function (ID, firstname, email, postcode, books, city, likes, dislikes, lat, lng) {
        var userJSON = { 
                        "ID": ID,
                        "firstname": firstname,
                        "email": email,
                        "postcode": postcode,
                        "books": books,
                        "city": city,
                        "likes": likes,
                        "dislikes": dislikes,
                        "location": 
                            {
                                "lat":lat,
                                "lng":lng
                            },
                        "distance": this.getDistance([lat, lng], [this.getUser().location.lat, this.getUser().location.lng])
                        };
        console.log("Model: Created UserLimitedJSON: " + JSON.stringify(userJSON));
        return userJSON;
    };
}