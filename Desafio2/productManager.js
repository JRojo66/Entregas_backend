// Codigo
class ProductManager {
    #products;
  constructor() {
    this.#products = [];
  }
  addProduct = (title, description, price, thumbnail, code, stock) => {
      const existingProduct = this.#products.find(element => element.code === code);
    if (!existingProduct) {
      let id = this.#products.length + 1;
      this.#products.push({id, title, description, price, thumbnail, code, stock});
      console.log("Product successfully added")
    } else {
      console.log(
        "Code " + code + " of " + title + " already exists"
      );
    }
  };
  getProducts = () => {
    return this.#products;
  };
  getProductById = (id) => {
    const product = this.#products.find(element => element.id === id);
    if (product) {
      return product;
    } else {
      console.log("Not found");
    }
  };
}

module.exports = ProductManager;
