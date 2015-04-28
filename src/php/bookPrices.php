<?php

session_start();

if (!isset($_SESSION['id']))
	echo "err-notloggedin";
else
{
	//PHP proxy file to pass in ISBN and return the prices from is ISBNdb website
	$isbn = $_GET['isbn'];
	$filename = "./prices.json";

	file_put_contents($filename, file_get_contents("http://isbndb.com/api/v2/json/CZA0E1D9/prices/" . $isbn));

	header('Content-Type: application/json; charset=utf-8');

	echo (file_get_contents($filename));
	unlink($filename);
}
?>