const express = require("express");
const cors = require("cors");
const http = require("http");
require("./connection")
const dotenv = require("dotenv");


const User = require('./models/User')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes")
const imageRoutes = require('./routes/imageRoutes');
const app = express();
require("dotenv").config();




const stripe = require('stripe').Stripe(process.env.STRIPE_SECRET);
const server = http.createServer(app);





//  const {Server} = require("socket.io");
// const io = new Server (server, {
  
//  cors:["http://localhost:3000" ,"" ],
//  methods: [ 'GET', 'POST', 'PATCH', 'DELETE']
// })





// app.use(express.urlencoded({extended: true}));


app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/image', imageRoutes);


 

app.post('/create-payment', async(req, res)=> {
 const {amount} = req.body;
 console.log(amount);
 try {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'inr',
    payment_method_types: ['card']
  });
  res.status(200).json(paymentIntent)
} catch (e) {
  console.log(e.message);
  res.status(400).json(e.message);
 }
});





server.listen(5050, () => {
 console.log("server is running in at port", 5050)
} )

//  app.set('socketio', io);
 