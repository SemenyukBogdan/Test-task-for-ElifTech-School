<?php
require_once 'databaseAPI.php';



$db = new databaseAPI();

$res =  $db->getAllProducts();

