<?php
class databaseAPI
{
    protected $conn;
    public function __construct()
    {
        try {
            // подключаемся к серверу
            $this->conn = new PDO("mysql:host=localhost;dbname=medicine_devivery_db", "root", "");
/*            echo "Database connection established";*/
        }
        catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
        }
    }

    public function addNewProduct($name, $price, $quantity, $imageUrl, $generic_name = null)
    {
        try {
            // Экранируем специальные символы в строках
            $name = addslashes($name);
            $imageUrl = addslashes($imageUrl);
            $generic_name = addslashes($generic_name);

            $query = "INSERT INTO products (name, imageUrl, generic_name, price, quantity) VALUES (:name, :imageUrl, :generic_name, :price, :quantity)";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':imageUrl', $imageUrl);
            $stmt->bindParam(':generic_name', $generic_name);
            $stmt->bindParam(':price', $price);
            $stmt->bindParam(':quantity', $quantity);

            $stmt->execute();
            
            echo "Product added successfully";
        } catch (PDOException $e) {
            echo "Error adding product: " . $e->getMessage();
        }
    }



    public function getAllProducts()
    {   $arr = [];
        $sql = $this->conn->prepare("SELECT * FROM products");
        $sql->execute();

        $result = $sql->fetchAll(PDO::FETCH_ASSOC);

        foreach ($result as $row) {
            $item = [
                'name'=>$row["name"],
                'price' => $row["price"],
                'quantity' =>$row["quantity"],
                'imageUrl' =>$row["imageUrl"]
            ];
            array_push($arr,$item);
        }
        return $arr;
    }


}


//$db = new databaseAPI();
//$res =  $db->getAllProducts();
//
//foreach ($res as $item){
//    echo $item['name'];
//}
//
//

