<?php

// Make a MySQL Connection
include("connect.php");

session_start();
if (!isset($_SESSION['id']))
	echo "err-notloggedin";
else
{
	$id = $_SESSION['id'];
	//Status 0 = available
	$status = 0;

	$isbn = $_GET['ISBN'];
	$title = $_GET['title'];
	$author = $_GET['author'];
	$blurb = $_GET['blurb'];
	$genre = $_GET['genre'];
	$retail = $_GET['retail'];
	//$lendtime = $_GET['lendtime'];
	$price = $_GET['price'];
	   


	//Insert the information into the table “website”
	mysql_query("INSERT INTO `books`(`isbn`, `Title`, `author`, `blurb`, `genre`, `retail`) VALUES ('$isbn','$title','$author','$blurb','$genre','$retail')")
	or die(mysql_error());
	mysql_query("INSERT INTO `loans`(`lender_id`,`borrower_id`, `isbn`, `price`, `book_condition`, `status`) VALUES ('$id','-1','$isbn','$price','Perfect','0')")
	or die(mysql_error());  

	echo "Book has been added<br/>";
}
?>