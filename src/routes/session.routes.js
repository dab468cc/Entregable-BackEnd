const { Router } = require("express")
const { find } = require("../dao/models/user.models")
const userModel = require("../dao/models/user.models")
const { createHashValue, isValidPassword } = require("../utils/encrypt")

const router = Router()

router.post("/register", async(req,res) => {
    try {
        console.log("BODY ****",req.body)
        const{ first_name,last_name,email,age,password } = req.body

        const pswHashed = await createHashValue(password)
        console.log("🚀 ~ file: session.routes.js:59 ~ router.post ~ pswHashed:", pswHashed)
        

        const userAdd = {
            email,
            first_name,
            last_name,
            age,
            password: pswHashed}

        const newUser = await userModel.create(userAdd)
        console.log("🚀 ~ file: views.routes.js:56 ~ router.post ~ newUser:", newUser)

        req.session.user = { email, first_name, last_name, age}
        return res.render(`login`)
    } catch (error) {
        console.log("🚀 ~ file: views.routes.js:58 ~ router.post ~ error:", error)   
    }
})

router.post("/login", async (req,res) => {
    try {
        const { email, password } = req.body
        const findUser = await userModel.findOne({email})

        if(!findUser){
            return res
            .status(401)
            .json({ message: `El email no existe en la base de datos`})
        }

        const isValidComparePassword = await isValidPassword(password,findUser.password)

        if(!isValidComparePassword){
            return res
            .status(401)
            .json({ message : `Las credenciales no son validas`})
        }

        req.session.user = {
            ...findUser
        }

        return res.render("profile",{first_name : req.session?.user?.first_name || findUser.first_name,
            last_name : req.session?.user?.last_name || findUser.last_name,
            email : req.session?.user?.email || email,
            age : req.session?.user?.age || findUser.age,
            role: req.session?.user?.role || findUser.role|| 'User',
            cartId: req.session?.user?.cartId || findUser.cartId || 'El carrito aun no existe'})
    } catch (error) {
        console.log("🚀 ~ file: session.routes.js:62 ~ router.post ~ error:", error)  
    }
})

router.get("/logout", async (req,res) => {
    try {
        req.session.destroy((err) => {
            if(!err) return res.redirect("/login")
            return res.send({message: `Logout Error`, body: err})
        })
    } catch (error) {
        
    }
})

router.post("/recover-psw", async (req,res) => {
    try {
        console.log("BODY UPDATE*****", req.body)
        const { new_password, email } = req.body

        const newPasswordHashed = await createHashValue(new_password)
        const user = await userModel.findOne({email})

        if(!user){
            return res
            .status(401)
            .json({ message: `El correo no existe`})
        }

        const updateUser = await userModel.findByIdAndUpdate(user._id,{password:newPasswordHashed})

        if(!updateUser){
            res.json({message: `Problemas para actualizar la contraseña`})
        }
        return res.render("login")
    } catch (error) {
        console.log("🚀 ~ file: session.routes.js:98 ~ router.post ~ error:", error)
        
    }
})

module.exports = router