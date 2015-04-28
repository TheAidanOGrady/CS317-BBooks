<?php

include("connect.php");

session_start();

if (!isset($_SESSION['id']))
	echo "err-notloggedin";
else
{
    if ($_GET['status'] == 1) {
        	mysql_query("UPDATE `gvb12187`.`loans` SET 
				`status` = '{$_GET['status']}' WHERE `loans`.`l_id` = '{$_GET['bid']}';") or die(mysql_error());
                	mysql_query("UPDATE `gvb12187`.`loans` SET 
				`borrower_id` = '-1' WHERE `loans`.`l_id` = '{$_GET['bid']}';") or die(mysql_error());
        echo "Book ID {$_GET['bid']} updated to {$_GET['status']}. borrower reverting to -1";
    } else {
       	mysql_query("UPDATE `gvb12187`.`loans` SET 
				`status` = '{$_GET['status']}'
				WHERE `loans`.`lender_id` = '{$_SESSION['id']}' AND `loans`.`l_id` = '{$_GET['bid']}';") or die(mysql_error()); 
        echo "Book ID {$_GET['bid']} updated to {$_GET['status']}";
    }


}
?>