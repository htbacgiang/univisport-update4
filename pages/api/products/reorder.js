import db from "../../../utils/db";
import Products from "../../../models/Product";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ err: "Method not allowed" });
  }

  try {
    await db.connectDb();
    
    const { items, category } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ err: "Invalid items format" });
    }

    const bulkOps = items.map((item, index) => ({
      updateOne: {
        filter: {
          ...(item._id ? { _id: item._id } : { id: item.id }),
          ...(category ? { category } : {}),
        },
        update: { $set: { displayOrder: index } }
      }
    }));

    if (bulkOps.length > 0) {
      await Products.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: "Sắp xếp thành công!" });
  } catch (error) {
    console.error("Error reordering products:", error);
    res.status(500).json({ err: "Lỗi server khi sắp xếp." });
  }
};

export default handler;
