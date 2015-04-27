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
    echo "<books>[]</books>";
    echo "<city>{$row[7]}</city>";
    echo "<likes>{$row[8]}</likes>";
    echo "<dislikes>{$row[9]}</dislikes>";
    echo "<latitude>{$row[11]}</latitude>";
    echo "<longitude>{$row[12]}</longitude>";
    echo "</user>";
} 
echo "</users>";
?>