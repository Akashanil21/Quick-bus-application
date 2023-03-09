const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel')
const Bus = require('../models/busModel')
const authMiddleware = require('../middlewares/authMiddleware');


// Admin login

router.post("/admin-login", (req, res) => {
    try {

        if (req.body.name === "Admin" && req.body.password === "Admin@123") {
            const token = jwt.sign(
                { userId: 1 },
                process.env.jwt_secret,
                { expiresIn: "1d" }
            );
            res.send({
                message: "Admin logged in successfully",
                success: true,
                data: token
            })
        } else {
            res.send({
                message: "Invalid login credentials",
                success: false,
                data: null
            })
        }

    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null,
        });
    }
})

// get all users

router.get("/admin-users", async (req, res) => {
    try {
        const users = await User.find({})
        return res.send({
            success: true,
            message: "",
            data: users
        })
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null
        })
    }
})

// Get all owners

router.get("/admin-owners", async (req, res) => {

    try {
        const owners = await User.find({ role: "owner" })
        return res.send({
            message: "",
            success: true,
            data: owners
        })
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null
        })
    }
})

// Update user permissions

router.post("/update-user", authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.body._id, req.body);
        return res.send({
            message: "User permission updated successfully",
            success: true,
            data: null
        })
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null
        })
    }
})

// Update owner permissions

router.post("/update-owners", authMiddleware, async (req, res) => {
    try {
        const owner = await User.findByIdAndUpdate(req.body._id, req.body)

        return res.send({
            message: "Owner permission updated successfully",
            success: true,
            data: null
        })
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null
        })
    }
})

// Admin logout

router.get("/admin-logout", async (req, res) => {
    try {
        res.send({
            message: "Logged out successfully",
            success: true,
            data: null
        })
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null,
        })
    }
})

// get all buses

// router.get("/get-all-buses",authMiddleware,async(req,res)=>{
//     try {
//         const buses = await Bus.find({})
//         return res.send({
//             success:true,
//             message:"",
//             data:buses
//         })
//     } catch (error) {
//         res.status(500).send({
//             success:false,
//             message:error.message,
//             data:null
//         })
//     }
// })

module.exports = router