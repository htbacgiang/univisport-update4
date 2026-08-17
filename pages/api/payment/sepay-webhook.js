import db from "../../../utils/db";
import SepayPayment from "../../../models/SepayPayment";

// POST /api/payment/sepay-webhook
// SEPAY gọi endpoint này khi xác nhận chuyển khoản thành công.
// Cấu hình URL webhook trong dashboard SEPAY: https://yourdomain.com/api/payment/sepay-webhook
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} không được hỗ trợ`);
  }

  await db.connectDb();

  const webhookData = req.body;
  const { transferAmount, amount, referenceCode, transactionId, description } = webhookData;
  const webhookAmount = transferAmount || amount;

  if (!webhookAmount) {
    return res.status(400).json({ error: "Thiếu thông tin số tiền" });
  }

  let payment = null;

  // Tìm theo referenceCode (nội dung chuyển khoản chứa paymentCode)
  if (referenceCode) {
    payment = await SepayPayment.findOne({ paymentCode: referenceCode, status: "pending" });
  }

  // Fallback: tìm theo amount trong 2 giờ gần đây
  if (!payment) {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const candidates = await SepayPayment.find({
      status: "pending",
      amount: { $gte: webhookAmount - 5000, $lte: webhookAmount + 5000 },
      createdAt: { $gte: twoHoursAgo },
    }).sort({ createdAt: -1 });

    if (candidates.length === 1) {
      payment = candidates[0];
    } else if (candidates.length > 1 && description) {
      // Ưu tiên payment có paymentCode trong nội dung chuyển khoản
      payment = candidates.find((p) => description.includes(p.paymentCode)) || candidates[0];
    }
  }

  if (!payment) {
    return res.status(404).json({ error: "Không tìm thấy phiếu thanh toán phù hợp" });
  }

  // Cập nhật trạng thái đã thanh toán
  payment.status = "paid";
  payment.transactionId = transactionId || null;
  payment.paidAt = new Date();
  await payment.save();

  return res.status(200).json({ success: true, paymentCode: payment.paymentCode });
}
