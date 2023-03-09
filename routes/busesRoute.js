const router = require("express").Router();
const Bus = require('../models/busModel')
const authMiddleware = require('../middlewares/authMiddleware');

// add bus

router.post("/add-bus", async (req, res) => {
    try {
        const existingBus = await Bus.findOne({ number: req.body.number });
        if (existingBus) {
            return res.status(200).send({
                message: "Bus already Exists",
                success: false
            })
        }
        const newBus = new Bus(req.body);
        await newBus.save()
        return res.status(200).send({
            success: true,
            message: "Bus added successfully"
        })

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        })
    }
})

// update bus

router.post("/update-bus", authMiddleware, async (req, res) => {
    try {
        await Bus.findByIdAndUpdate(req.body._id, req.body);
        return res.status(200).send({
            success: true,
            message: "Bus updated successfully"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
})

// delete bus

router.post("/delete-bus", authMiddleware, async (req, res) => {
    try {
        await Bus.findByIdAndDelete(req.body._id, req.body);
        return res.send({
            success: false,
            message: "Bus deleted successfully"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
})

// get all buses


router.post("/get-all-buses", async (req, res) => {
    try {
        const buses = await Bus.find()
        return res.status(200).send({
            success: true,
            message: "Buses fetched successfully",
            data: buses
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
})

// search buses

router.post("/search-buses",  async (req, res) => {

    try {

        const buses = await Bus.find({
            $or: [
                { from: req.body.from },
                { to: req.body.to },
                { journeyDate: req.body.journeyDate }
            ]
        })
        if(buses){
            return res.status(200).send({
                success: true,
                message: "Buses fetched successfully",
                data: buses
            })
        }else{
            return res.send({
                success:false,
                message:"There are no buses available for the search input",
                data:null
            })
        }
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
})

// get bus-by-id

router.post("/get-bus-by-id", authMiddleware, async (req, res) => {

    try {
        const bus = await Bus.findById(req.body._id);
        return res.status(200).send({
            success: true,
            message: "Bus fetched successfully",
            data: bus
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
})

module.exports = router