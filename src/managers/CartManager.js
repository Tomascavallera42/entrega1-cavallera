import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";

const path = "./data/carts.json";

export default class CartManager {
  async getCarts() {
    return await fs.readJSON(path).catch(() => []);
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = { id: uuidv4(), products: [] };
    carts.push(newCart);
    await fs.writeJSON(path, carts, { spaces: 2 });
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id === id);
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id === cartId);
    if (!cart) return null;
    const item = cart.products.find(p => p.product === productId);
    if (item) {
      item.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
    await fs.writeJSON(path, carts, { spaces: 2 });
    return cart;
  }
}