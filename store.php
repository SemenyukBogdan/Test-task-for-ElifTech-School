<?php
require_once 'databaseAPI.php';
$cartTemplate = file_get_contents("./view/components/cart.html");
$cardTemplate = file_get_contents("./view/card.html");
$navBarTemplate = file_get_contents("./view/components/navbar.html");
$footerTemplate = file_get_contents("./view/components/footer.html");
$cartItemTemplate = file_get_contents('./view/cartItem.html');

$db = new databaseAPI();



$res =  $db->getAllProducts();
//
//foreach ($res as $item){
//    echo $item['name'];
//}

$template = '';



foreach ($res as $item){
    $newCard = $cardTemplate;

    $newCard = str_replace('{%TITLE%}',$item['name'],$newCard);
    $newCard = str_replace('{%PRICE%}',$item['price'],$newCard);
    $newCard = str_replace('{%PICTURE%}',$item['imageUrl'],$newCard);
    $newCard = $newCard . "\n ";
    
    $template = $template . $newCard;
}   

?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap demo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

    <link rel="stylesheet" href="style.css">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Madimi+One&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Press+Start+2P&family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">

    
    <script src="script.js" defer></script>
</head>
<body>

<!-- NAVBAR -->
<?=$navBarTemplate?>

<!-- SHOP PAGE -->
<div class="container-fluid shopPage">

    <div class="row">
        <div class="categoryes col-md-2 col-sm-4">
            <p>
                Shops:
            </p>

            <div class="d-grid gap-2">
                <button class="btn btn-primary" type="button">drugs</button>
                <button class="btn btn-primary" type="button">Pharmacy</button>
                <button class="btn btn-primary" type="button">etc.</button>
                <button class="btn btn-primary" type="button">etc.</button>
                <button class="btn btn-primary" type="button">etc.</button>
            </div>
        </div>

        <section class="cards col-md-10 col-sm-8">
        <?php
        echo  $template;
        ?>
        </section>



    </div>
</div>

<!-- CART PAGE  -->
<div class="container-fluid cartPage hidden">

    <?=$cartTemplate?>   
</div>


<?=$footerTemplate?>



<cartItemTemplate>
    <?=$cartItemTemplate?>
</cartItemTemplate>

<div id="bottomLine">
    <span id="totalPriceLabel">Total price : 0</span>
    <button id="submitButton" type="button" class="btn btn-success">Submit order</button>

</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>
</html>