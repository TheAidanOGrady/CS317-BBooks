<?php

include("connect.php");
$result = mysql_query("SELECT * FROM users") or die(mysql_error());
echo "<users>";
while($row = mysql_fetch_array($result)) {
    echo "<user>";
    echo "<id>{$row[0]}</id>";
    echo "<firstname>{$row[1]}</firstname>";
    echo "<email>{$row[3]}</email>";
    echo "<postcode>{$row[4]}</postcode>";
    echo "<books>";
    $result2 = mysql_query("SELECT * FROM loans WHERE lender_id = '{$row[0]}'") or die(mysql_error());
    while($row2 = mysql_fetch_array($result2)) {
        $isbn = $row2[2];
        echo "<book>";
        echo "<owner>{$row2[0]}</owner>";
        echo "<BID>{$row2[7]}</BID>";
        if ($row2[0] != -1) {
            $result3 = mysql_query("SELECT * FROM users WHERE u_id = {$row2[0]}") or die(mysql_error());
            while($row3 = mysql_fetch_array($result3)) {
                echo "<borrower>{$row3[1]}</borrower>";
            }
        } else {
            echo "<borrower>no one</borrower>";   
        }
        echo "<isbn>{$isbn}</isbn>";
        $result3 = mysql_query("SELECT * FROM books WHERE isbn = '{$isbn}'") or die(mysql_error());
        if ($book = mysql_fetch_array($result3)) {
            echo "<title>{$book[1]}</title>";
            echo "<author>{$book[2]}</author>";
            echo "<blurb>{$book[3]}</blurb>";
            echo "<genre>{$book[4]}</genre>";
            echo "<retail>{$book[5]}</retail>";
        }
		else
		{
			echo "<title>Sorry! No book in database</title>";
            echo "<author>Sorry! No book in database</author>";
            echo "<blurb>Sorry! No book in database</blurb>";
            echo "<genre>Sorry! No book in database</genre>";
            echo "<retail>Sorry! No book in database</retail>";
		}
        echo "<price>{$row2[3]}</price>";
        echo "<condition>{$row2[4]}</condition>";
        echo "<status>{$row2[5]}</status>";
        echo "<time>{$row2[6]}</time>";
        echo "</book>";
    }
    echo "</books>";
    echo "<city>{$row[7]}</city>";
    echo "<likes>{$row[8]}</likes>";
    echo "<dislikes>{$row[9]}</dislikes>";
    echo "<latitude>{$row[11]}</latitude>";
    echo "<longitude>{$row[12]}</longitude>";
    echo "</user>";
} 
echo "</users>";
?>