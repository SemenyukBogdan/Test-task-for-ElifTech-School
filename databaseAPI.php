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
                'imageUrl' =>$row["imageUrl"],
                'product_id' =>$row["product_id"]
            ];
            array_push($arr,$item);
        }
        return $arr;
    }


    public function addNewCartLine($order_id, $product_name,$quantity)
    {
        $product_id = -1;
        $res =  $this->getAllProducts();
        foreach ($res as $item){
            if($item['name'] == $product_name)
                $product_id = $item['product_id'];
        }
        if($product_id == -1){
            echo 'product doesnt exist ' . $product_name;
            die();
        }

        try {
            $query = "INSERT INTO cart_list (order_id,product_id,quantity) VALUES (:order_id, :product_id, :quantity)";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':order_id', $order_id);
            $stmt->bindParam(':product_id',$product_id);
            $stmt->bindParam(':quantity',$quantity);
            $stmt->execute();

            return $this->conn->lastInsertId();
        } catch (PDOException $e) {
            echo 'error writing new cart line';
        }
    }
    public function getNewOrderId($customerId)
    {
        try {
            // Экранируем специальные символы в строках
            $customerId = addslashes($customerId);

            $query = "INSERT INTO orders (customer_id) VALUES (:customer_id)";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':customer_id', $customerId);
            $stmt->execute();

            $order_id = $this->conn->lastInsertId();
            echo "Order succesfully created. ID: ${customerId}<br>";
            return $order_id;
        } catch (PDOException $e) {
            echo "Error adding New Order: " . $e->getMessage();
        }
    }
    public function getNewCustomerId($name, $email, $phone, $address)
    {
        try {
            $name = addslashes($name);
            $email = addslashes($email);
            $phone = addslashes($phone);
            $address = addslashes($address);


            $query = "INSERT INTO customers (fullname, email, phone,address) VALUES (:fullname, :email,:phone,:address)";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':fullname', $name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':phone', $phone);
            $stmt->bindParam(':address', $address);

            $stmt->execute();

            $customer_id = $this->conn->lastInsertId();
            echo "New Customer added successfully. ID: ${customer_id}" . '<br>';
            return $customer_id;
        } catch (PDOException $e) {
            echo "Error adding New Customer: " . $e->getMessage() . '<br>';
        }
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

