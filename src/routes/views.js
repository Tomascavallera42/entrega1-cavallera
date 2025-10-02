import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import CartManager from "../managers/CartManager.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (!product) return res.status(404).send("Producto no encontrado");
  res.render("productDetail", { product });
});

router.get("/carts/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).send("Carrito no encontrado");
  res.render("cartDetail", { cart });
});

export default router;
