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
    const price = cardBody.querySelector('.priceP').innerText.replace(' UAH',' ').trim()
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

updateTotalPrice()
/////////////////////////////////////////////

function detailsValidation(){
    const customerName = document.querySelector('#nameInput').innerText
    const customerEmail = document.querySelector('#nameInput').innerText
    const customerPhone = document.querySelector('#PhoneInput').innerText
    const customerAddress = document.querySelector('#addressInput').innerText
    
    const detailsGood = !(customerName == null || customerEmail == null || customerPhone == null || customerAddress == null);
    if (!detailsGood){
        console.log('error input. Order cancel')
        return
    }
    
    
    return detailsGood;
}

const submitOrderButton = document.querySelector('#submitButton')
submitOrderButton.addEventListener('click',(event)=>{
    const cartListInput = document.querySelector('#cartListJson')
    cartListInput.value = localStorage.getItem('cart')
})

function getTitleCard(card){
    const title = card.querySelector('h5').innerText
    return title
}


function swapCards(card1, card2) {
    const parent = card1.parentElement;

    // Получаем индексы карточек
    const index1 = Array.from(parent.children).indexOf(card1);
    const index2 = Array.from(parent.children).indexOf(card2);

    // Переставляем карточки
    parent.insertBefore(card2, card1);
    // parent.insertBefore(card1, parent.children[index2 + 1]); // Добавляем +1, чтобы не вставить перед самой собой
}




 function sortCardsByAlphabet(reverseSort = false){
    let cards = Array.from(document.querySelectorAll('.cards .card'));
    let flag = 1;

     do {
         flag = 1;
         for (let i = 1; i < cards.length; i++) {
             let first_card = cards[i - 1];
             let second_card = cards[i];
             if (first_card.querySelector('h5').innerText.toLowerCase() > second_card.querySelector('h5').innerText.toLowerCase()) {
                 swapCards(first_card, second_card);

                 cards = Array.from(document.querySelectorAll('.cards .card'));

                 flag = 0;
             }

         }

     } while (flag !== 1);
    
    upFavoritCards()
}

function sortCardsByPrice(){
    let cards = Array.from(document.querySelectorAll('.cards .card'));
    let flag = 1;
    do {
        flag = 1;
        for (let i = 1; i < cards.length; i++) {
            let firstCard = cards[i - 1];
            let secondCard = cards[i];
            
            let firstCardPrice = firstCard.querySelector('label.priceP').innerText.toLowerCase()
            let secondCardPrice = secondCard.querySelector('label.priceP').innerText.toLowerCase()
            
            firstCardPrice = firstCardPrice.replace('₴','').trim()
            secondCardPrice = secondCardPrice.replace('₴','').trim()

            
            firstCardPrice = parseInt(firstCardPrice)
            secondCardPrice = parseInt(secondCardPrice)
            
            // console.log(`${firstCardPrice} > ${secondCardPrice} : ${firstCardPrice > secondCardPrice}`)
            if (firstCardPrice > secondCardPrice) {
                swapCards(firstCard, secondCard);
                
                cards = Array.from(document.querySelectorAll('.cards .card'));

                flag = 0;
            }

        }

    } while (flag !== 1);

    upFavoritCards()
}
document.querySelector('#sortByPrice').addEventListener('click',sortCardsByPrice)
// sortCardsByAlphabet()
const sortByLetterButton = document.querySelector('#sortByLetter')
sortByLetterButton.addEventListener('click', (event)=>{
    
    event.preventDefault()
    sortCardsByAlphabet()
})




function getCardElement(elem){
    return elem.closest('.cards > .card')
}

/////////////// binding favoritButton

function upFavoritCards(){
    let currentCards = document.querySelectorAll('.cards .card')
    const favoritCards = document.querySelectorAll('.card > .favoritIcon.heart.activated');
    favoritCards.forEach((item) => {
        const card = getCardElement(item);
        const parent = card.parentElement;

        // Перемещаем текущую карточку перед первой карточкой внутри родителя
        parent.insertBefore(card, parent.firstElementChild);
    });


}
const favorits = document.querySelectorAll('div.favoritIcon')
favorits.forEach((item)=>{
    item.addEventListener('click',(event)=>{

        const card = event.target.closest('.card')
        const favoritDiv = card.querySelector('.favoritIcon.heart')
        const paths = card.querySelectorAll('path')
        
        if(favoritDiv.classList.contains('activated')){
            favoritDiv.classList.remove('activated')
            paths[1].setAttribute('display','none')
        }
        else{
            favoritDiv.classList.add('activated')
            paths[1].setAttribute('display','block')
        }
    })
})




let markers = [{
    title : 'drugs market',
    pos:{
        lat : 50.46484195751556,
        lng : 30.617492872712045
    }
    },{
    title : 'pharmacy shop',
    pos:{
        lat : 50.457499415120765,
        lng : 30.39588372648565
    }
    },
    {
        title : 'apteka',
        pos:{
            lat : 50.44634999189802,
            lng : 30.607559790116454
        }
    }
]

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");


    map = new Map(document.getElementById("map"), {
        center: { lat: 50.45914736480977, lng: 30.499211610449624 },
        zoom: 11,
        mapId : "AIzaSyDBVhtE6a4-D4wJU-U9rB4mOIpipeSYbmM"
    });

    const marker = new AdvancedMarkerElement({
        map,
        position: { lat: 37.4239163, lng: -122.0947209 },
    });
    markers.forEach((item)=>{

        mapMarkers.push(new AdvancedMarkerElement({
                map,
                position: item.pos,
                title:item.title
            })
        );

       
    })

}

let map;
initMap();
let mapMarkers = []


