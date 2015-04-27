<?php

include("connect.php");

$result = mysql_query("SELECT * FROM loans WHERE lender_id = '{$_GET['id']}'") or die(mysql_error());
echo "<books>";
while($row = mysql_fetch_array($result)) {
    $isbn = $row[2];
    echo "<book>";
    echo "<owner>{$row[0]}</owner>";
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
    echo "</book>";
}
echo "</books>";
?>