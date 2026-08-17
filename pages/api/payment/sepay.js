import db from "../../../utils/db";
import SepayPayment from "../../../models/SepayPayment";

const BANK_INFO = {
  bankId: process.env.SEPAY_BANK_ID,
  accountNumber: process.env.SEPAY_ACCOUNT_NUMBER,
  accountName: process.env.SEPAY_ACCOUNT_NAME,
  description: process.env.SEPAY_DESCRIPTION || "Thanh toan don hang Đồng Phục Univi",
};

function createVietQR(amount, description) {
  const { bankId, accountNumber, accountName } = BANK_INFO;
  const cleanAmount = Math.round(amount);
  return `https://img.vietqr.io/image/${bankId}-${accountNumber}-compact2.png?amount=${cleanAmount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;
}

export default async function handler(req, res) {
  await db.connectDb();

  // POST /api/payment/sepay — tạo phiếu thanh toán + QR
  if (req.method === "POST") {
    const { amount, orderInfo, userId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Số tiền không hợp lệ" });
    }

    const paymentCode = `UNIVI-${userId || "guest"}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const transferDescription = orderInfo || BANK_INFO.description;
    const qrUrl = createVietQR(amount, transferDescription);

    const payment = new SepayPayment({
      paymentCode,
      amount: Math.round(amount),
      userId: userId || null,
      sepayData: {
        bankInfo: BANK_INFO,
        qrUrl,
        orderInfo: orderInfo || {},
      },
    });

    await payment.save();

    return res.status(200).json({
      success: true,
      paymentCode,
      qrUrl,
      amount: Math.round(amount),
      expiresAt: payment.expiresAt,
      bankInfo: BANK_INFO,
    });
  }

  // GET /api/payment/sepay?paymentCode=xxx — kiểm tra trạng thái
  if (req.method === "GET") {
    const { paymentCode } = req.query;

    if (!paymentCode) {
      return res.status(400).json({ error: "Thiếu paymentCode" });
    }

    const payment = await SepayPayment.findOne({ paymentCode });

    if (!payment) {
      return res.status(404).json({ error: "Không tìm thấy phiếu thanh toán" });
    }

    // Tự động đánh dấu hết hạn
    if (payment.status === "pending" && payment.expiresAt < new Date()) {
      payment.status = "expired";
      await payment.save();
    }

    return res.status(200).json({
      success: true,
      payment: {
        paymentCode: payment.paymentCode,
        status: payment.status,
        amount: payment.amount,
        paidAt: payment.paidAt,
        expiresAt: payment.expiresAt,
      },
    });
  }

  res.setHeader("Allow", ["POST", "GET"]);
  return res.status(405).end(`Method ${req.method} không được hỗ trợ`);
}
