
class ProductManager2 {
    #products;
    static idProducto = 0;

    constructor(){
        this.#products = [];    
    }
    addProduct(title, description, price, thumbnail, code, stock){
        if((!title || !description || !price || !thumbnail || !code || !stock))
            return "Todos los parametros son requeridos (title, description, price, thumbnail, code, stock)"
            const codeRepetido = this.#products.some(p=> p.code == code)
            if(codeRepetido)
                return `El codigo ${code} ya se encuentra registrado en otro producto`;
            ProductManager2.idProducto = ProductManager2.idProducto + 1;
                const id = ProductManager2.idProducto;
                const nuevoProducto = {
                    id: id,
                    title: title,
                    description: description,
                    price: price, 
                    thumbnail: thumbnail, 
                    code: code, 
                    stock: stock
                };
                this.#products.push(nuevoProducto);
                return "producto agregado exitosamente"

    }
    getProducts(){
        return this.#products;
    }
    getProductById(id){
        const producto = this.#products.find(p => p.id == id);
        if (producto)
            return producto;
        else    
            return `Not found del producto con id ${id}`;
    }
}

module.exports = ProductManager2;
