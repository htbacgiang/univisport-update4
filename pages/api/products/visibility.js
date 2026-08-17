import db from "../../../utils/db";
import Products from "../../../models/Product";

const VISIBLE_FIELDS = new Set(["visibleOnHome", "visibleOnArticle"]);

const handler = async (req, res) => {
  if (req.method !== "PATCH") {
    return res.status(405).json({ err: "Method not allowed" });
  }

  try {
    await db.connectDb();

    const { id, field, value } = req.body;
    if (!id || !VISIBLE_FIELDS.has(field) || typeof value !== "boolean") {
      return res.status(400).json({ err: "Invalid visibility payload" });
    }

    const numericId = Number(id);
    const query = Number.isFinite(numericId) ? { id: numericId } : { _id: id };
    const product = await Products.findOneAndUpdate(
      query,
      { $set: { [field]: value } },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ err: "Product not found" });
    }

    res.status(200).json({ status: "success", product });
  } catch (error) {
    console.error("Error updating product visibility:", error);
    res.status(500).json({ err: "Lỗi server khi cập nhật hiển thị." });
  }
};

export default handler;
