import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import productsRouter from "./src/routes/products.js";
import cartsRouter from "./src/routes/carts.js";
import ProductManager from "./src/managers/ProductManager.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 8080;
const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

app.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products });
});

io.on("connection", socket => {
  socket.on("newProduct", async productData => {
    await productManager.addProduct(productData);
    const products = await productManager.getProducts();
    io.emit("updateProducts", products);
  });

  socket.on("deleteProduct", async productId => {
    await productManager.deleteProduct(productId);
    const products = await productManager.getProducts();
    io.emit("updateProducts", products);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});