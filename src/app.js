const express = require("express")
const handlebars = require("express-handlebars")
const displayRoutes = require("express-routemap")
const session = require("express-session")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const mongoStore = require("connect-mongo")


const sessionRoutes = require("./routes/session.routes")
const sessionViewsRoutes = require("./routes/viewsRouter/sessionViews.routes")
const productsRouter = require("./routes/products.routes")
const cartsRoutes = require("./routes/cart.routes")
const chatRoutes = require("./routes/chat.routes")

const app = express()

const MONGO_URL =`mongodb+srv://danielbeltran:1234@entregable.opw7np9.mongodb.net/`
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(
    session({
        store: mongoStore.create({
            mongoUrl: MONGO_URL,
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
            ttl: 60 * 3600,
          }),
        secret:"secretSession",
        resave: false,
        saveUninitialized: false,
    })
)

app.engine("handlebars",handlebars.engine())
app.set("views",__dirname+"/views")
app.set("view engine","handlebars")

const connection = mongoose
    .connect(MONGO_URL)
    .then((conn) => {
        console.log("🚀 ~ file: app.js:41 ~ .then ~ ¡¡ CONECTADO !!")
    })
    .catch((err) => {
        console.log("🚀 ~ file: app.js:44 ~ err:", err)
    })


app.use("/", sessionViewsRoutes)
app.use("/api/session", sessionRoutes)

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRoutes);
app.use("/api/messages", chatRoutes);

app.listen(PORT, () => {
    displayRoutes(app)
    console.log(`Llistening on Port: ${PORT}`)
})