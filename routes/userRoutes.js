// const router = require("express").Router();
const User = require("../models/User");
const express = require('express');
const Order = require("../models/Order");
const bcrypt = require("bcrypt");

const router = express.Router()

//signup model

router.post('/signup', async (req, res) => {
  const {name, email, password, mobile, gender, images: profilephoto } = req.body;
  console.log(req.body);
  try {
    // const salt = await bcrypt.genSalt();
    // const passwordHash = await bcrypt.hash(password, salt);
    const user = await User.create({name, email, mobile, gender, profilephoto, password });
    res.json(user) 
  } catch (e) {
      if (e.code === 11000) 
          return res.status(400).send("Email already exists")
          res.status(400).send(e)
  }
   })

//login
router.post('/login', async(req, res) => {
 const {email, password} = req.body;
 try {
   const user = await User.findByCredentials(email, password);
   res.json(user)
 } catch (e) {
   res.status(400).send(e)
 }
})

 
     
//get user profile
router.get("/:id/profile", async (req, res) => {
  const { id } = req.params
  try {
      // const { id } = req.params
      const users = await User.findById(id)
      res.json(users)
  } catch (error) {
      res.status(400).send(error.message);
  }
})


//update user profile
router.patch("/:id/profile", async (req, res) => {
   const {id} = req.params;
  try {
      //  const { id } = req.params
      const { name, email, mobile, gender, images: profilephoto } = req.body;
      const user = await User.findByIdAndUpdate(id, { name, email, mobile, gender, profilephoto })
      const updatedUsers = await User.findById(id)                                                             
      // res.json(updatedUser)
      res.status(200).json(updatedUsers)
  } catch (err) {
      res.status(400).send(err.message);
  }
})

router.delete("/:id/profile", async (req, res) => {
  const { id } = req.params
  
  try {
      // const { id } = req.params
      const user = await User.findById(id).populate('orders')
      // let userOrders = user.orders
      user.orders.map(async (order) => {
          await Order.findByIdAndDelete(order._id)
      })                                                                                                     
      await User.findByIdAndDelete(id)
      res.send("user deleted successfully")
  } catch (err) {
      res.status(400).send(err.message);
  }
})

 // get users;
 
 router.get('/', async(req, res)=> {
  try {
    const users = await User.find({ isAdmin: false }).populate('orders');
    res.json(users);
  } catch (e) {
    res.status(400).send(e.message);
  }
 })
 
 // get user orders
 
 router.get('/:id/orders', async (req, res)=> {
   const {id} = req.params;
   try {
     const user = await User.findById(id).populate('orders');
     res.json(user.orders);
   } catch (e) {
     res.status(400).send(e.message);
   }
 })
 
 // update user notifcations
 router.post('/:id/updateNotifications', async(req, res)=> {
   const {id} = req.params;
   try {
     const user = await User.findById(id);
     user.notifications.forEach((notif) => {
       notif.status = "read"
     });
     user.markModified('notifications');
     await user.save();
     res.status(200).send();
   } catch (e) {
     res.status(400).send(e.message)
   }
 })
 
 
 
 
 module.exports = router;