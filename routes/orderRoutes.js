const router = require("express").Router();
const Order = require("../models/Order");
const  User = require("../models/User");


//creating an order

router.post("/", async (req, res) => {
  // const io = req.app.get('socketio');
  try {
      const { userId, cart, address, country } = req.body
      const user = await User.findById(userId)
      const order = await Order.create({ owner: userId, products: cart, address, country, total: user.cart.total, count: user.cart.count })
      user.cart = { total: 0, count: 0 }
      user.orders.push(order)
    // const notification = {status: 'unread', message: `New order from ${user.name}`, time: new Date()};
    // io.sockets.emit('new-order', notification);
     user.markModified("orders")
      user.markModified("cart")
      await user.save()
      res.status(200).json(user)

  } catch (error) {
      res.status(400).json(error.message)
  }
})



//to get all orders for admin
router.get("/", async (req, res) => {
  try {
      const orders = await Order.find().populate("owner", ["ObjectId", "email"])
      res.status(200).json(orders)
  } catch (error) {
      res.status(400).json(error.message)
  }
})


router.patch('/:id/mark-shipped', async(req, res)=> {
  // const io = req.app.get('socketio');
  const {ownerId} = req.body;
  const {id} = req.params;
  try {
    const user = await User.findById(ownerId);
    await Order.findByIdAndUpdate(id, {status: 'shipped'});
    const orders = await Order.find().populate('owner', ['email', 'name']);
    // const notification = {status: 'unread', message: `Order ${id} shipped with success`, time: new Date()};
    // io.sockets.emit("notification", notification, ownerId);
    // user.notifications.push(notification);
    await user.save();
    res.status(200).json(orders)
  } catch (e) {
    res.status(400).json(e.message);
  }
})





module.exports = router;