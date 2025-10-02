import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  const cart = await cartManager.createCart();
  res.status(201).json(cart);
});

router.get("/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart);
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart);
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const cart = await cartManager.deleteProductFromCart(req.params.cid, req.params.pid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart);
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { quantity } = req.body;
  const cart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart);
});

router.put("/:cid", async (req, res) => {
  const cart = await cartManager.updateCartProducts(req.params.cid, req.body.products);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart);
});

router.delete("/:cid", async (req, res) => {
  const cart = await cartManager.deleteAllProducts(req.params.cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart);
});

export default router;
