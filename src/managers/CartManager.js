import { Cart } from "../models/Cart.js";


export default class CartManager {
  async createCart() {
    const newCart = new Cart({ products: [] });
    return newCart.save();
  }
  async getCartById(id) {
    return Cart.findById(id).populate("products.product");
  }
  async addProductToCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;
    const item = cart.products.find(p => p.product.toString() === productId);
    if (item) item.quantity += 1;
    else cart.products.push({ product: productId, quantity: 1 });
    await cart.save();
    return cart.populate("products.product");
  }
  async deleteProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;
    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();
    return cart.populate("products.product");
  }
  async updateCartProducts(cartId, productsArray) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;
    cart.products = productsArray.map(p => ({ product: p.product, quantity: p.quantity }));
    await cart.save();
    return cart.populate("products.product");
  }
  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;
    const item = cart.products.find(p => p.product.toString() === productId);
    if (item) item.quantity = quantity;
    await cart.save();
    return cart.populate("products.product");
  }
  async deleteAllProducts(cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;
    cart.products = [];
    await cart.save();
    return cart;
  }
}
