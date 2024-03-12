class ShoppingCart{
    constructor() {
        try {
            const json = JSON.parse(localStorage.getItem('cart'))
            this.items = Object.values(json)
        }
        catch (e){
            this.items = []
        }
    }

    addItem(product) {
        let existInCart = false;
        for(let i =0; i<this.items.length;i++){
            const item = this.items[i]
            if (item['title'] == product['title']){
                item.quantity = parseInt(item.quantity) + 1;
                existInCart = true;
                break
            }

        }
        if(!existInCart){
            product.quantity = 1;
            this.items.push(product);
        }
        saveCartToLocalStorage(this.items)
    }

    // removeItem(index) {
    //     if (index >= 0 && index < this.items.length) {
    //         this.items.splice(index, 1);
    //     }
    // }

    updateQuantity(title, newValue) {
        for(let i =0; i<this.items.length;i++){
            const item = this.items[i]
            if (item['title'] == title){
                item.quantity = newValue;
                break
            }

        }
        saveCartToLocalStorage(this.items)
    }
    //
    // calculateTotal() {
    //     return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    // }

    clearCart() {
        this.items = [];
        localStorage.removeItem('cart')
    }

}
class CartItem {
    constructor(title,price,pictureSrc) {
        this.title = title
        this.price = price
        this.picture = pictureSrc
    }
}

function saveCartToLocalStorage(cart){
    console.log('update local storage')
    localStorage.cart = null;
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showCart(){
    shopPage.classList.add('hidden')
    cartPage.classList.remove('hidden')

    cartButton.classList.add('active')
    shopButton.classList.remove('active')
    /////////////////////////////////////////////

    const bottomLabel = document.querySelector('#bottomLine')
    bottomLabel.style.display = 'flex'
}
function hideCart(){
    shopPage.classList.remove('hidden')
    cartPage.classList.add('hidden')
    cartButton.classList.remove('active')
    shopButton.classList.add('active')
    
    ////////////////////////////////////////////
    const bottomLabel = document.querySelector('#bottomLine')
    bottomLabel.style.display = 'none'
}


function addItemToCart(cardBody,cart){
    const title = cardBody.querySelector('.card-title').innerText
    const price = cardBody.querySelector('.priceP').innerText.replace(' UAH',' ')
    const imageUrl = cardBody.parentNode.querySelector('img').getAttribute('src')
    
    let item = new CartItem(title,price,imageUrl)
    
    cart.addItem(item)
    updateCart(cart)
    updateTotalPrice()
}
function updateCart(cart){
    cartItemsNode.innerHTML = ''
    for (let i =0; i <cart.items.length;i++){
        const product = cart.items[i]
        if(product.quantity == 0){
            continue
        }
        let item = cartItemTemplate
        item = item.replace("{%TITLE%}",product['title'])
        item = item.replace("{%PRICE%}",product['price'])
        item = item.replace("{%QUANTITY%}",product['quantity'])
        
        item = item.replace("{%PICTURE%}",product['picture'])
        const newCartItem = document.createElement('div')
        newCartItem.title = product['title']

        newCartItem.classList.add('cartItem')
        newCartItem.innerHTML = item




        newCartItem.querySelector(".removeButton button").addEventListener('click',(event)=>{
            const cardNode = event.target.parentNode.parentNode
                .parentNode.parentNode.parentNode.parentNode.parentNode
            const title = cardNode.querySelector('.card-title').innerText
            for(let i =0;i<cart.items.length;i++){
                if(cart.items[i].title.trim() == title.trim()){
                    console.log('removed')
                    cart.items[i].quantity = 0;
                    cardNode.parentNode.removeChild(cardNode)
                    break
                }
            }
            saveCartToLocalStorage(cart.items)
            updateTotalPrice()
        })



        //// INPUT ADD EVENT LISTENING
        const input = newCartItem.querySelector('input')
        input.addEventListener('input',(event)=>{
            cart.updateQuantity(newCartItem.title,event.target.value)
            updateTotalPrice()
        })
        
        
        cartItemsNode.append(newCartItem)
    }

}

// BINDING TAB ACTIONS
const cartButton = document.querySelector('.cartButton')
const cartPage = document.querySelector('.cartPage')
const shopPage = document.querySelector('.shopPage')
const shopButton = document.querySelector('.shopButton')
shopButton.addEventListener('click',hideCart)
cartButton.addEventListener('click',showCart)

// CART init
const cart = new ShoppingCart();
const cards = document.querySelectorAll('.shopPage .card')

cards.forEach((item)=>{
    const addToCardButton = item.querySelector('.btn');
    addToCardButton.addEventListener('click',(event)=>{
        event.preventDefault()
        addItemToCart(event.target.parentNode.parentNode,cart)
    })
})

const cartItem = document.querySelector('cartItemTemplate')
const cartItemTemplate = cartItem.innerHTML
cartItem.remove()
const cartItemsNode = document.querySelector('.cart')
updateCart(cart)




/////////////////////////////////////////////

function updateTotalPrice(){
    const totalPriceLabel = document.querySelector('#totalPriceLabel')
    let cartItems = document.querySelectorAll('.cart .card')
    let totalPrice = 0;
    cartItems.forEach((item)=>{
        const priceLabel = item.querySelector('.priceLabel').innerText
        const quantity = item.querySelector('.quantityBlock input').value
        const price = priceLabel.replace('Price: ','')

        totalPrice += parseInt(price) * parseInt(quantity)
    })
    totalPriceLabel.innerText = `Total price: ${totalPrice}`
}

updateTotalPrice()


