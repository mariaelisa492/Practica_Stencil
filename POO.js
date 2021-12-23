const _private = new WeakMap();

class Book {
    //======== Método constructor, para hacer la instanciación dinámica de objetos =====
    constructor(title, author, price){
        //Propiedades para pasar al private   -- ejemplo encapsular

        const properties = {
            _title: title,
            _author: author,
            _price: price
        }

        //colocar propiedades privadas
        _private.set(this, {properties})
    }


        //======== Métodos / Getters-Setters

       // Obtiene el título de un libro:
        get title(){
            return _private.get(this).properties['_title'];
        }

        // Setea/modifica el título de un libro:
        set title(newTitle){
            return _private.get(this).properties['_title'] = newTitle
        }

        get author(){
            return _private.get(this).properties['_author']
        }

        set author(newAuthor){
            return _private.get(this).properties['_author'] = newAuthor
        }

        get price(){
            return _private.get(this).properties['_price']
        }

        set price(newPrice){
            return _private.get(this).properties['_price'] = newPrice
        }

         // Muestra todos los datos de un libro.  Ejemplo para polimorfismo
        getAllData() {
            console.log( `Título: ${this.title}, Autor: ${this.author}, Precio: ${this.price}`);
        }
}

class Comic extends Book {
    constructor(name, author, price, illustrators){
        super(name, author, price);
        this.illustrators = illustrators
    }

    addIllustrator(newIllustrator){
        this.illustrators.push(newIllustrator)
    }

    /* ====== Ejemplo de: Polimorfismo ======
        Sobreescribe el método getAllData definido en la clase padre: Book
    */
        getAllData() {
            // Ejecuta el código de getAllData de la clase Padre
            super.getAllData();
            // Código extra para imprimir la propiedad illustrators
            console.log( `Illustradores: ${this.illustrators}` );
        }
}


class ShoppingCart{
    constructor(){
        this.products = []
    }

    addProducts(amount, price){
        this.products.push(...Array(amount).fill(price));   //hago una copia del array anterior, le pongo # espacios con amount y lo relleno con fill
    }

    showProducts(){
        console.log(this.products)
    }

    calcTotal(){
        return this.products
            .map(price => price)
            .reduce((ac, price) => ac + price, 0)
    }

    printTicket(){
        console.log(`El total a pagar es ${this.calcTotal()}`)
    }
}



const book1 = new Book('1984', 'G.O', 350);
console.log( book1.title );
book1.getAllData();


const comic1 = new Comic('The Killing Joke', 'A.M', 150, ['B.B'] );
comic1.addIllustrator('J.H');
console.log(comic1.author)
console.log(comic1.illustrators)


const cart = new ShoppingCart();
cart.addProducts(2, comic1.price);
cart.addProducts(3, book1.price);
cart.addProducts(10, book1.price);
cart.showProducts()
cart.printTicket()
comic1.getAllData();