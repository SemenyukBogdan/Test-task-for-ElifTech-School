<?php
require_once 'databaseAPI.php';




$detailsFilledCorrect = (isset($_POST['cartListJson']) and isset($_POST['emailInput']) and
    isset($_POST['PhoneInput']) and isset($_POST['addressInput']) and isset($_POST['nameInput']));
if (!$detailsFilledCorrect){
    echo 'date filled uncorrect';
    die();

}

$cartJson = json_decode($_POST['cartListJson']);

$db = new databaseAPI();

$customer_id = $db->getNewCustomerId("john","tempmail@email","380912312","ukr kharkiv");
$order_id = $db->getNewOrderId($customer_id);

foreach ($cartJson as $item){
    if($item->quantity == 0)
        continue;

    $db->addNewCartLine($order_id,$item->title,$item->quantity);
}
echo 'success order';
?>
<!doctype html>
<html lang="en">
<head>
    <?php
    include_once './view/components/head.html'
    ?>
</head>
<body>

</body>
</html>
