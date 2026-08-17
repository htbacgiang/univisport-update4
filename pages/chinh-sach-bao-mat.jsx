import Head from "next/head";
import DefaultLayout from "../components/layout/DefaultLayout";

export default function PrivacyPolicy() {
  const meta = {
    title: "Chính sách bảo mật - Đồng Phục Univi",
    description: "Chính sách bảo mật thông tin cá nhân của khách hàng tại Đồng Phục Univi. Cam kết bảo vệ thông tin cá nhân và dữ liệu khách hàng.",
    keywords: "chính sách bảo mật, bảo vệ thông tin cá nhân, đồng phục univi, quyền riêng tư",
    robots: "index, follow",
    author: "Đồng Phục Univi",
    canonical: "https://dongphucunivi.com/chinh-sach-bao-mat",
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
              Chính sách bảo mật
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-1">
                <strong>Ngày cập nhật:</strong> {new Date().toLocaleDateString('vi-VN')}
              </p>

              <section className="mb-2">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Tuyên Bố Chung</h2>
                <p className="text-gray-700 leading-6">
                  Đồng phục Univi (Univi) cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng.
                  Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ
                  thông tin cá nhân của bạn khi bạn truy cập và sử dụng các dịch vụ trên website dongphucunivi.com.
                  Bằng việc sử dụng website của chúng tôi, bạn đồng ý với các điều khoản trong chính sách này.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Thu Thập Thông Tin Cá Nhân</h2>
                <p className="text-gray-700 leading-6 mb-3">
                  Chúng tôi thu thập thông tin cá nhân của bạn thông qua các hình thức sau:
                </p>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Thông tin bạn cung cấp trực tiếp:</h3>
                    <p className="text-gray-700 mb-2">
                      Khi bạn đặt hàng, đăng ký tư vấn, yêu cầu báo giá, hoặc điền vào các biểu mẫu liên hệ, chúng tôi có thể thu thập các thông tin như:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>Họ và tên.</li>
                      <li>Địa chỉ email.</li>
                      <li>Số điện thoại.</li>
                      <li>Địa chỉ giao hàng (nếu có).</li>
                      <li>Các thông tin liên quan đến yêu cầu của bạn (ví dụ: số lượng, kiểu dáng, chất liệu, logo, v.v.).</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Thông tin tự động thu thập:</h3>
                    <p className="text-gray-700 mb-2">
                      Khi bạn truy cập website của chúng tôi, chúng tôi có thể tự động thu thập một số thông tin kỹ thuật bao gồm:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>Địa chỉ IP.</li>
                      <li>Loại trình duyệt và thiết bị bạn sử dụng.</li>
                      <li>Thời gian và thời lượng truy cập.</li>
                      <li>Các trang bạn đã xem, sản phẩm bạn quan tâm và các thao tác bạn thực hiện trên website.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                      Thông tin này giúp chúng tôi cải thiện trải nghiệm người dùng và tối ưu hóa hiệu quả website.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Mục Đích Sử Dụng Thông Tin</h2>
                <p className="text-gray-700 leading-6 mb-3">
                  Thông tin cá nhân của bạn được sử dụng cho các mục đích sau:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li><strong>Hỗ trợ và tư vấn khách hàng:</strong> Sử dụng thông tin liên hệ để trả lời các yêu cầu, cung cấp tư vấn chuyên sâu và hỗ trợ bạn trong suốt quá trình đặt hàng.</li>
                  <li><strong>Thực hiện hợp đồng:</strong> Xử lý đơn hàng, ký kết hợp đồng, sản xuất và giao sản phẩm đến tay bạn một cách chính xác và đúng tiến độ.</li>
                  <li><strong>Marketing và quảng bá thương hiệu:</strong> Sử dụng thông tin để gửi các chương trình khuyến mãi, cập nhật sản phẩm mới và các tin tức liên quan đến đồng phục Univi, giúp tăng cường nhận diện và quảng bá thương hiệu.</li>
                  <li><strong>Nâng cao chất lượng dịch vụ:</strong> Phân tích hành vi người dùng để cải thiện giao diện website, tối ưu hóa quy trình đặt hàng và phát triển các sản phẩm, giải pháp mới phù hợp hơn với nhu cầu thị trường.</li>
                  <li><strong>Quản lý nội bộ:</strong> Sử dụng thông tin để quản lý đơn hàng, theo dõi tiến độ sản xuất và đảm bảo chất lượng sản phẩm.</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Bảo Mật và Lưu Trữ Thông Tin</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li><strong>Bảo mật:</strong> Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và quản lý chặt chẽ để bảo vệ thông tin cá nhân của bạn khỏi truy cập trái phép, mất mát, thay đổi hoặc tiết lộ.</li>
                  <li><strong>Lưu trữ:</strong> Thông tin của bạn được lưu trữ trên các máy chủ an toàn và chỉ những nhân viên có thẩm quyền mới được phép truy cập để phục vụ các mục đích đã nêu trên.</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Chia Sẻ Thông Tin</h2>
                <p className="text-gray-700 leading-6 mb-3">
                  Univi cam kết không bán, cho thuê hoặc trao đổi thông tin cá nhân của bạn với bên thứ ba vì mục đích thương mại. Chúng tôi chỉ chia sẻ thông tin trong các trường hợp sau:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Với các đối tác vận chuyển để giao nhận sản phẩm đúng hẹn.</li>
                  <li>Khi có yêu cầu hợp pháp từ cơ quan nhà nước có thẩm quyền.</li>
                  <li>Với sự đồng ý của bạn.</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Quyền Của Khách Hàng</h2>
                <p className="text-gray-700 leading-6 mb-3">
                  Bạn có toàn quyền đối với thông tin cá nhân của mình, bao gồm:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li><strong>Quyền truy cập và chỉnh sửa:</strong> Bạn có thể yêu cầu truy cập, xem hoặc chỉnh sửa thông tin cá nhân của mình bất cứ lúc nào.</li>
                  <li><strong>Quyền hủy bỏ và xóa thông tin:</strong> Bạn có quyền yêu cầu chúng tôi xóa thông tin cá nhân của bạn khỏi hệ thống, trừ khi có yêu cầu pháp lý khác.</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Thay Đổi Chính Sách</h2>
                <p className="text-gray-700 leading-6">
                  Univi có thể cập nhật và thay đổi chính sách bảo mật này theo thời gian để phù hợp với các quy định pháp luật hoặc thay đổi trong hoạt động kinh doanh. Mọi thay đổi sẽ được công bố trên website và có hiệu lực ngay khi được đăng tải.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Liên Hệ</h2>
                <p className="text-gray-700 leading-6 mb-3">
                  Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về chính sách bảo mật này, xin vui lòng liên hệ với chúng tôi theo thông tin sau:
                </p>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-gray-700 mb-1"><strong>Đồng Phục Univi</strong></p>
                  <p className="text-gray-700 mb-1"><strong>Hotline:</strong> 0834.204.999</p>
                  <p className="text-gray-700 mb-1"><strong>Email:</strong> dongphucunivi@gmail.com</p>
                  <p className="text-gray-700"><strong>Địa chỉ:</strong> Nhà D14, Ng. 180 Đ. Thanh Bình, Hà Đông, Hà Nội</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
