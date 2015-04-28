<?php

include("connect.php");
session_start();

if (!isset($_SESSION['id']))
	echo "err-notloggedin";
else
{
	echo "<books>";
	$result = mysql_query("SELECT * FROM loans WHERE lender_id = '{$_SESSION['id']}'") or die(mysql_error());
	while($row = mysql_fetch_array($result)) {
		$isbn = $row[2];
		echo "<book>";
		echo "<owner>{$row[0]}</owner>";
        if ($row[1] != -1) {
            $result2 = mysql_query("SELECT * FROM users WHERE u_id = {$row[1]}") or die(mysql_error());
            while($row2 = mysql_fetch_array($result2)) {
                echo "<borrower>{$row2[1]}</borrower>";
            }
        } else {
            echo "<borrower>no one</borrower>";   
        }
		echo "<isbn>{$isbn}</isbn>";
		$result2 = mysql_query("SELECT * FROM books WHERE isbn = '{$isbn}'") or die(mysql_error());
		if ($book = mysql_fetch_array($result2)) {
			echo "<title>{$book[1]}</title>";
			echo "<author>{$book[2]}</author>";
			echo "<blurb>{$book[3]}</blurb>";
			echo "<genre>{$book[4]}</genre>";
			echo "<retail>{$book[5]}</retail>";
		}
		echo "<price>{$row[3]}</price>";
		echo "<condition>{$row[4]}</condition>";
		echo "<status>{$row[5]}</status>";
		echo "<time>{$row[6]}</time>";
        echo "<BID>{$row[7]}</BID>";
		echo "</book>";
	}
	$result = mysql_query("SELECT * FROM loans WHERE borrower_id = '{$_SESSION['id']}'") or die(mysql_error());
	while($row = mysql_fetch_array($result)) {
		$isbn = $row[2];
		echo "<book>";
		echo "<owner>{$row[0]}</owner>";
        if ($row[1] != -1) {
            $result2 = mysql_query("SELECT * FROM users WHERE u_id = {$row[1]}") or die(mysql_error());
            while($row2 = mysql_fetch_array($result2)) {
                echo "<borrower>{$row2[1]}</borrower>";
            }
        } else {
            echo "<borrower>no one</borrower>";   
        }
		echo "<isbn>{$isbn}</isbn>";
		$result2 = mysql_query("SELECT * FROM books WHERE isbn = '{$isbn}'") or die(mysql_error());
		if ($book = mysql_fetch_array($result2)) {
			echo "<title>{$book[1]}</title>";
			echo "<author>{$book[2]}</author>";
			echo "<blurb>{$book[3]}</blurb>";
			echo "<genre>{$book[4]}</genre>";
			echo "<retail>{$book[5]}</retail>";
		}
		echo "<price>{$row[3]}</price>";
		echo "<condition>{$row[4]}</condition>";
		echo "<status>{$row[5]}</status>";
		echo "<time>{$row[6]}</time>";
        echo "<BID>{$row[7]}</BID>";
		echo "</book>";
	}
	echo "</books>";

}
?>