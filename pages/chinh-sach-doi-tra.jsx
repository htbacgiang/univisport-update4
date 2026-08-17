import Head from "next/head";
import DefaultLayout from "../components/layout/DefaultLayout";

export default function ReturnPolicy() {
  const meta = {
    title: "Chính sách đổi trả - Đồng Phục Univi",
    description: "Chính sách đổi trả và hoàn tiền tại Đồng Phục Univi. Quy định về điều kiện đổi trả, thời gian và quy trình xử lý.",
    keywords: "chính sách đổi trả, hoàn tiền, đổi hàng, đồng phục univi, bảo hành sản phẩm",
    robots: "index, follow",
    author: "Đồng Phục Univi",
    canonical: "https://dongphucunivi.com/chinh-sach-doi-tra",
  };

  return (
    <DefaultLayout>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta name="robots" content={meta.robots} key="robots" />
        <meta name="author" content={meta.author} />
        <link rel="canonical" href={meta.canonical} />

        {/* Open Graph */}
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={meta.canonical} />
        <meta property="og:image" content="https://dongphucunivi.com/images/banner-home-1.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content="https://dongphucunivi.com/images/banner-home-1.jpg" />
      </Head>
      <div className="h-[80px]"></div>
      <div className="min-h-screen my-8">
        <div className="container mx-auto px-4">
          <div className="">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Chính sách đổi trả
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-1">
                <strong>Ngày cập nhật:</strong> {new Date().toLocaleDateString('vi-VN')}
              </p>

              <section className="mb-2">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Tổng quan</h2>
                <p className="text-gray-700 leading-6 mb-3">
                  Đồng Phục Univi cam kết mang đến sản phẩm chất lượng cao và dịch vụ khách hàng tốt nhất.
                  Chúng tôi hiểu rằng đôi khi bạn có thể cần đổi hoặc trả sản phẩm, và chúng tôi sẵn sàng hỗ trợ bạn.
                </p>
                <p className="text-gray-700 leading-6">
                  Chính sách đổi trả này được thiết kế để đảm bảo quyền lợi của khách hàng
                  trong khi duy trì tính công bằng cho tất cả các bên.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Điều kiện đổi trả</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Sản phẩm được đổi trả:</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                      <li>Sản phẩm bị lỗi từ nhà sản xuất (rách, lỗi đường may, màu sắc không đúng)</li>
                      <li>Sản phẩm không đúng với mô tả trên website</li>
                      <li>Sản phẩm bị hư hỏng trong quá trình vận chuyển</li>
                      <li>Giao nhầm sản phẩm, sai size, sai màu</li>
                      <li>Sản phẩm còn nguyên tag, chưa sử dụng, trong vòng 7 ngày</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Sản phẩm không được đổi trả:</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                      <li>Sản phẩm đã sử dụng, giặt, ủi</li>
                      <li>Sản phẩm bị hư hỏng do sử dụng không đúng cách</li>
                      <li>Sản phẩm đã cắt tag, tem nhãn</li>
                      <li>Sản phẩm bị ố vàng, bẩn, có mùi</li>
                      <li>Sản phẩm đã qua thời gian đổi trả (quá 7 ngày)</li>
                      <li>Sản phẩm được may theo yêu cầu đặc biệt</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Thời gian đổi trả</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li><strong>Đổi size/đổi màu:</strong> Trong vòng 7 ngày kể từ khi nhận hàng</li>
                  <li><strong>Trả hàng hoàn tiền:</strong> Trong vòng 7 ngày kể từ khi nhận hàng</li>
                  <li><strong>Bảo hành sản phẩm:</strong> Trong vòng 30 ngày cho lỗi sản xuất</li>
                  <li><strong>Thời gian xử lý:</strong> 3–5 ngày làm việc sau khi nhận được sản phẩm</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Quy trình đổi trả</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-3 ml-2">
                  <li>
                    <strong>Liên hệ hỗ trợ</strong> — Gọi hotline 0834.204.999 hoặc gửi email đến dongphucunivi@gmail.com
                    để thông báo về việc đổi trả. Cung cấp mã đơn hàng và lý do đổi trả.
                  </li>
                  <li>
                    <strong>Xác nhận yêu cầu</strong> — Chúng tôi sẽ xem xét yêu cầu và xác nhận có thể đổi trả hay không.
                    Nếu được chấp nhận, chúng tôi sẽ hướng dẫn chi tiết các bước tiếp theo.
                  </li>
                  <li>
                    <strong>Gửi sản phẩm</strong> — Đóng gói sản phẩm cẩn thận, giữ nguyên tag và hóa đơn.
                    Gửi về địa chỉ được cung cấp hoặc chờ nhân viên đến lấy (nếu trong nội thành).
                  </li>
                  <li>
                    <strong>Xử lý và hoàn tất</strong> — Chúng tôi kiểm tra sản phẩm và xử lý yêu cầu.
                    Hoàn tiền hoặc gửi sản phẩm mới theo yêu cầu của bạn.
                  </li>
                </ol>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Phí đổi trả</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Miễn phí đổi trả:</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                      <li>Sản phẩm bị lỗi từ nhà sản xuất</li>
                      <li>Giao nhầm sản phẩm</li>
                      <li>Sản phẩm không đúng mô tả</li>
                      <li>Hư hỏng trong quá trình vận chuyển</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Có phí đổi trả:</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                      <li>Đổi size (không phải lỗi): 30.000 VNĐ</li>
                      <li>Đổi màu (không phải lỗi): 30.000 VNĐ</li>
                      <li>Trả hàng do không vừa ý: 50.000 VNĐ</li>
                      <li>Phí vận chuyển 2 chiều</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Phương thức hoàn tiền</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">6.1. Thời gian hoàn tiền</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                      <li><strong>Chuyển khoản ngân hàng:</strong> 3–5 ngày làm việc</li>
                      <li><strong>Thẻ tín dụng/ghi nợ:</strong> 5–7 ngày làm việc</li>
                      <li><strong>Ví điện tử:</strong> 1–3 ngày làm việc</li>
                      <li><strong>Tiền mặt (COD):</strong> Ngay khi xác nhận</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">6.2. Số tiền hoàn trả</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                      <li>Hoàn trả 100% giá trị sản phẩm (nếu lỗi từ phía chúng tôi)</li>
                      <li>Trừ phí vận chuyển và phí đổi trả (nếu có)</li>
                      <li>Không hoàn trả phí dịch vụ đã sử dụng</li>
                      <li>Áp dụng giá tại thời điểm mua hàng</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Đổi size và màu sắc</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Điều kiện:</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                      <li>Sản phẩm còn nguyên tag, chưa sử dụng</li>
                      <li>Trong vòng 7 ngày kể từ khi nhận hàng</li>
                      <li>Có hóa đơn mua hàng</li>
                      <li>Sản phẩm không bị hư hỏng</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Quy trình:</h3>
                    <ol className="list-decimal list-inside text-gray-700 space-y-1 ml-2">
                      <li>Liên hệ hotline để thông báo đổi</li>
                      <li>Xác nhận size/màu mới có sẵn</li>
                      <li>Gửi sản phẩm về (hoặc chờ nhân viên lấy)</li>
                      <li>Nhận sản phẩm mới sau 3–5 ngày</li>
                    </ol>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Bảo hành sản phẩm</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">8.1. Phạm vi bảo hành</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                      <li>Lỗi đường may, chỉ may bị đứt</li>
                      <li>Khuy cài, khóa kéo bị hỏng</li>
                      <li>Màu sắc bị phai, bạc màu bất thường</li>
                      <li>Chất liệu vải bị rách, thủng không do sử dụng</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">8.2. Không bảo hành</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                      <li>Hư hỏng do sử dụng không đúng cách</li>
                      <li>Hư hỏng do giặt, ủi không đúng quy cách</li>
                      <li>Hư hỏng do tai nạn, va đập</li>
                      <li>Hư hỏng do thời gian sử dụng lâu dài</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Lưu ý quan trọng</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Kiểm tra kỹ sản phẩm trước khi ký nhận</li>
                  <li>Giữ nguyên tag, tem nhãn cho đến khi chắc chắn hài lòng</li>
                  <li>Chụp ảnh sản phẩm nếu phát hiện lỗi</li>
                  <li>Liên hệ ngay khi phát hiện vấn đề</li>
                  <li>Không tự ý sửa chữa sản phẩm bị lỗi</li>
                  <li>Giữ lại hóa đơn và phiếu giao hàng</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Câu hỏi thường gặp</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Tôi có thể đổi size bao nhiêu lần?</h3>
                    <p className="text-gray-700 leading-6">
                      Bạn chỉ được đổi 1 lần duy nhất trong vòng 7 ngày kể từ khi nhận hàng.
                      Vui lòng chọn size cẩn thận trước khi đặt hàng.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Làm sao để biết size phù hợp?</h3>
                    <p className="text-gray-700 leading-6">
                      Bạn có thể tham khảo bảng size trên website, liên hệ hotline để được tư vấn,
                      hoặc đến cửa hàng để thử trực tiếp.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Tôi có thể đổi sang sản phẩm khác không?</h3>
                    <p className="text-gray-700 leading-6">
                      Có, bạn có thể đổi sang sản phẩm khác cùng giá trị hoặc bù thêm tiền nếu
                      sản phẩm mới có giá cao hơn.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Thời gian xử lý đổi trả là bao lâu?</h3>
                    <p className="text-gray-700 leading-6">
                      Thông thường 3–5 ngày làm việc sau khi chúng tôi nhận được sản phẩm.
                      Trong trường hợp đặc biệt có thể mất thêm thời gian.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Liên hệ hỗ trợ</h2>
                <p className="text-gray-700 leading-6 mb-3">
                  Nếu bạn có bất kỳ thắc mắc nào về chính sách đổi trả, vui lòng liên hệ:
                </p>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-gray-700 mb-1"><strong>Đồng Phục Univi</strong></p>
                  <p className="text-gray-700 mb-1"><strong>Hotline:</strong> 0834.204.999 / 096.156.7997</p>
                  <p className="text-gray-700 mb-1"><strong>Email:</strong> dongphucunivi@gmail.com</p>
                  <p className="text-gray-700"><strong>Địa chỉ:</strong> Nhà D14, đường Thanh Bình, phường Hà Đông, Hà Nội</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
