import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import productsRouter from "./src/routes/products.js";
import cartsRouter from "./src/routes/carts.js";
import viewsRouter from "./src/routes/views.js";
import ProductManager from "./src/managers/ProductManager.js";
import { connectDB } from "./src/db/mongoose.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 8080;

connectDB();

const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine({
  defaultLayout: "main",
  helpers: { multiply: (a, b) => a * b }
}));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.get("/", async (req, res) => {
  const products = await productManager.getProducts({});
  res.render("home", { products: products.payload });
});

app.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts({});
  res.render("realTimeProducts", { products: products.payload });
});

io.on("connection", socket => {
  socket.on("newProduct", async productData => {
    await productManager.addProduct(productData);
    const products = await productManager.getProducts({});
    io.emit("updateProducts", products.payload);
  });
  socket.on("deleteProduct", async productId => {
    await productManager.deleteProduct(productId);
    const products = await productManager.getProducts({});
    io.emit("updateProducts", products.payload);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.engine("handlebars", engine({
  defaultLayout: "main",
  helpers: {
    multiply: (a, b) => a * b
  }
}));
