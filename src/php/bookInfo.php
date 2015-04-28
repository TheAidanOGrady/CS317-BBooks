<?php

//PHP proxy file to pass in ISBN and return the JSON from is ISBNdb website
$isbn = $_GET['isbn'];
$filename = "./" . $isbn . "json";

    file_put_contents($filename, file_get_contents("http://isbndb.com/api/v2/json/XBOU017W/book/" . $isbn));

header('Content-Type: application/json; charset=utf-8');

echo (file_get_contents($filename));
unlink($filename);
?>