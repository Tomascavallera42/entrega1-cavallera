import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";

const path = "./data/products.json";

export default class ProductManager {
  async getProducts() {
    return await fs.readJSON(path).catch(() => []);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const newProduct = { id: uuidv4(), ...product };
    products.push(newProduct);
    await fs.writeJSON(path, products, { spaces: 2 });
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates, id };
    await fs.writeJSON(path, products, { spaces: 2 });
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const updated = products.filter(p => p.id !== id);
    if (updated.length === products.length) return false;
    await fs.writeJSON(path, updated, { spaces: 2 });
    return true;
  }
}