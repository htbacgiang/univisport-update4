import db from "../../../utils/db";
import Cart from "../../../models/Cart";

export default async function handler(req, res) {
  await db.connectDb();

  switch (req.method) {
    case "GET": {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ message: "userId is required" });
      try {
        const cart = await Cart.findOne({ user: userId });
        return res.status(200).json(cart ?? { products: [], cartTotal: 0 });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    }

    case "POST": {
      const { user, product, quantity = 1, price, title, image, color = "", colorHex = "", size = "" } = req.body;
      if (!user || !product) return res.status(400).json({ message: "user và product là bắt buộc" });

      try {
        let cart = await Cart.findOne({ user });
        if (!cart) cart = new Cart({ user, products: [], cartTotal: 0 });

        // Tìm item cùng product + color + size
        const idx = cart.products.findIndex(
          (p) =>
            p.product.toString() === product &&
            p.color === color &&
            p.size === size
        );

        if (idx >= 0) {
          cart.products[idx].quantity += quantity;
        } else {
          cart.products.push({ product, title, image, quantity, price, color, colorHex, size });
        }

        cart.cartTotal = cart.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
        await cart.save();
        return res.status(200).json(cart);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
