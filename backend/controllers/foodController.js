// import foodModel from "../models/foodModel.js";
// import fs from 'fs'

// // all food list
// const listFood = async (req, res) => {
//     try {
//         const foods = await foodModel.find({})
//         res.json({ success: true, data: foods })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" })
//     }

// }

// // add food
// const addFood = async (req, res) => {

//     try {
//         let image_filename = `${req.file.filename}`

//         const food = new foodModel({
//             name: req.body.name,
//             description: req.body.description,
//             price: req.body.price,
//             category:req.body.category,
//             image: image_filename,
//         })

//         await food.save();
//         res.json({ success: true, message: "Food Added" })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" })
//     }
// }

// // delete food
// const removeFood = async (req, res) => {
//     try {

//         const food = await foodModel.findById(req.body.id);
//         fs.unlink(`uploads/${food.image}`, () => { })

//         await foodModel.findByIdAndDelete(req.body.id)
//         res.json({ success: true, message: "Food Removed" })

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" })
//     }

// }

// export { listFood, addFood, removeFood }

import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// add food (Cloudinary upload)
const addFood = async (req, res) => {
    try {
        // Multer-Cloudinary will put the Cloudinary file info in req.file
        const cloudinaryUrl = req.file.path; // secure_url from Cloudinary

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: cloudinaryUrl, // store direct URL
        });

        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// delete food from DB & Cloudinary
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);

        // Remove from Cloudinary
        if (food && food.image) {
            const publicId = food.image.split('/').pop().split('.')[0]; // Extract public ID
            await cloudinary.uploader.destroy(`food_items/${publicId}`);
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { listFood, addFood, removeFood };
