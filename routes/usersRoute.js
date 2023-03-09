const router = require('express').Router();
const User = require('../models/usersModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const objectId = require('mongodb').ObjectId

// register new user
router.post("/register", async (req, res) => {

    try {

        const existingUser = await User.findOne({ email: req.body.email })
        if (existingUser) {
            return res.send({
                message: "User already exists",
                success: false,
                data: null
            });
        }

        let Number = req.body.mobile
        if (Number.toString().length != 10) {
            return res.send({
                message: "Please enter a valid mobile number"
            })
        }

        let Password = req.body.password
        if (Password.length < 6) {
            return res.send({
                message: "The Password needs to be atleast 6 character long",
                success: false,
                data: null
            })
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.send({
                message: "Password does not match",
                success: false,
                data: null
            })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword
        const newUser = new User(req.body)
        await newUser.save();

        const fast2sms = require('fast-two-sms');


        const sendMessage = (mobile) => {
            let randomOTP = Math.floor(Math.random() * 10000)
            const options = {
                authorization: "CQJFRJmxRXnZQLemIG12XYkIyyRIc2KFBAYbIpFke8xYiNGGp0MUsy2kZZOX",
                message: `Your OTP for QUICK BUS Login is ${randomOTP}`,
                numbers: [mobile]
            }
            fast2sms.sendMessage(options)
                .then((response) => {
                    console.log("OTP send successfully")
                })
                .catch((err) => {
                    console.log("error")
                })
            return randomOTP
        }

        OTP = sendMessage(req.body.mobile)

        res.send({
            message: "User Successfully registered",
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

// otp verification

router.post("/otp", async (req, res) => {
    try {
        if (req.body.otp == OTP) {
            return res.send({
                message: "OTP Verification successful",
                success: true,
                data: null
            })
        }
        if (req.body.otp != OTP) {
            return res.send({
                message: "Invalid OTP",
                success: false,
                data: null
            })
        }

    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null
        })
    }
})


// login user

router.post("/login", async (req, res) => {

    try {

        const userExists = await User.findOne({ email: req.body.email });

        if (!userExists) {
            return res.send({
                message: "User does not exist",
                success: false,
                data: null
            })
        }
        if (!userExists.access) {
            return res.send({
                message: "You are Currently Blocked from accessing this site",
                success: false,
                data: null
            })
        }

        const passwordMatch = await bcrypt.compare(
            req.body.password,
            userExists.password
        );

        if (!passwordMatch) {
            return res.send({
                message: "Incorrect Password",
                success: false,
                data: null
            })
        }

        const token = jwt.sign(
            { userId: userExists._id },
            process.env.jwt_secret,
            { expiresIn: "1d" }
        );

        res.send({
            message: "User logged in successfully",
            success: true,
            data: token,
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null,
        });
    }
})

// get user by id

router.post("/get-user-by-id", authMiddleware, async (req, res) => {

    try {

        const user = await User.findById(req.body.userId);
        res.send({
            message: "User fetched successfully",
            success: true,
            data: user,
        })
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null,
        })
    }
})

// edit user by id

router.post("/edit-user-by-id", authMiddleware, async (req, res) => {

    try {

        console.log(req.body);

       const updatedUser =  await User.updateOne({ _id:objectId(req.body.userId) }, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.phone,
                address: req.body.address
            }
        });
        return res.status(200).send({
            success: true,
            message: "User data updated successfully",
            data:updatedUser
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
})

// logout

router.get("/logout", async (req, res) => {
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


module.exports = router

