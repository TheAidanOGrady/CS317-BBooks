<?php

include("connect.php");

mysql_query("UPDATE `gvb12187`.`users` SET 
            `f_name` = '$_GET[f_name]',
            `s_name` = '$_GET[s_name]',
            `email`  = '$_GET[email]',
            `post_code` = '$_GET[postcode]',
            `credits` = $_GET[credits],
            `maxDistance` = $_GET[maxDistance],
            `latitude` = $_GET[latitude],
            `longitude` = $_GET[longitude]
            WHERE `users`.`u_id` = $_GET[id];") or die(mysql_error());

echo "User Updated";
?>