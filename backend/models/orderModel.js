import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// PLACE ORDER
export const placeOrder = async (req, res) => {
  try {
    const mappedItems = req.body.items.map((item) => ({
      itemName: item.name, // frontend must send "name"
      quantity: item.quantity,
      price: item.price,
      image: item.image,
    }));

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: mappedItems,
      amount: req.body.amount,
      address: req.body.address,
      status: "Placed",
      payment: false,
    });

    await newOrder.save();

    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing order" });
  }
};
