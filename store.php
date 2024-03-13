<?php
require_once 'databaseAPI.php';

$cartTemplate = file_get_contents("./view/components/cart.html");
$cardTemplate = file_get_contents("./view/card.html");
$navBarTemplate = file_get_contents("./view/components/navbar.html");
$footerTemplate = file_get_contents("./view/components/footer.html");
$cartItemTemplate = file_get_contents('./view/cartItem.html');
$head = file_get_contents('./view/components/head.html');

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
    <?=$head?>
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
            <div class="btn-group dropdown">
                <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    sort by
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" id="sortByLetter" href="#">letter</a></li>
                    <li><a class="dropdown-item" id="sortByPrice" href="#">price</a></li>
                </ul>
            </div>
        </div>

        <section class="cards col-md-10 col-sm-8">
        <?php
        echo  $template;
        ?>
<!--            <div class="space_filler"></div>-->

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
    <button id="submitButton" type="submit" form="cartForm" class="btn btn-success">Submit order</button>
    
</div>



<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script async defer
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDBVhtE6a4-D4wJU-U9rB4mOIpipeSYbmM&loading=async&callback=initMap">
</script>
</body>
</html>