import Head from "next/head";
import DefaultLayout from "../components/layout/DefaultLayout";

export default function TermsOfUse() {
  const meta = {
    title: "Điều khoản sử dụng - Đồng Phục Univi",
    description: "Điều khoản sử dụng dịch vụ tại Đồng Phục Univi. Quy định về việc sử dụng website và mua sắm sản phẩm đồng phục.",
    keywords: "điều khoản sử dụng, quy định website, đồng phục univi, điều kiện mua hàng",
    robots: "index, follow",
    author: "Đồng Phục Univi",
    canonical: "https://dongphucunivi.com/dieu-khoan-su-dung",
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
        <div className="container mx-auto px-4 ">
          <div className="">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              ĐIỀU KHOẢN SỬ DỤNG WEBSITE DONGPHUCUNIVI.COM
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-4">
                <strong>Ngày cập nhật:</strong> {new Date().toLocaleDateString('vi-VN')}
              </p>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Chấp nhận Điều khoản</h2>
                <p className="text-gray-700 leading-6">
                  Bằng việc truy cập và sử dụng website dongphucunivi.com, bạn đồng ý tuân thủ và chịu sự ràng buộc bởi các điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không tiếp tục sử dụng website của chúng tôi. Các điều khoản này có hiệu lực ngay khi bạn truy cập website lần đầu tiên.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Sở hữu Trí tuệ và Bản quyền</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li><strong>Sở hữu của Univi:</strong> Toàn bộ nội dung trên website dongphucunivi.com, bao gồm nhưng không giới hạn ở văn bản, hình ảnh, video, logo, biểu tượng, thiết kế đồ họa, và các mẫu sản phẩm đã được triển khai, đều là tài sản độc quyền của Công ty Cổ phần Tập đoàn Unicore Holdings.</li>
                  <li><strong>Sử dụng nội dung:</strong> Bạn được phép sử dụng nội dung trên website cho mục đích cá nhân, phi thương mại. Mọi hành vi sao chép, tái bản, phân phối, hiển thị công khai hoặc sử dụng cho mục đích thương mại mà không có sự cho phép bằng văn bản của Univi đều bị nghiêm cấm.</li>
                  <li><strong>Thiết kế và logo khách hàng:</strong> Univi cam kết bảo mật và không sử dụng bất kỳ thiết kế, logo hoặc hình ảnh riêng của khách hàng cho mục đích thương mại mà không có sự đồng ý của khách hàng đó.</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Hành vi Người dùng</h2>T
                <p className="text-gray-700 leading-6 mb-3">
                  Bạn cam kết không thực hiện các hành vi sau khi sử dụng website:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Sử dụng website cho bất kỳ mục đích bất hợp pháp nào.</li>
                  <li>Truyền tải, đăng tải, hoặc chia sẻ các nội dung có tính chất phỉ báng, quấy rối, tục tĩu, gây hại hoặc vi phạm bản quyền, quyền riêng tư của người khác.</li>
                  <li>Cố gắng truy cập trái phép vào các hệ thống máy tính hoặc mạng của Univi.</li>
                  <li>Sử dụng các công cụ tự động hoặc thủ công để thu thập thông tin từ website mà không có sự cho phép.</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Quy trình Đặt hàng và Giao dịch</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li><strong>Thông tin sản phẩm:</strong> Univi cung cấp thông tin chi tiết về sản phẩm đồng phục (chất liệu, công nghệ, thiết kế) trên website. Thông tin này có thể được cập nhật theo thời gian.</li>
                  <li><strong>Đơn hàng và báo giá:</strong> Khi bạn gửi yêu cầu tư vấn hoặc báo giá, Univi sẽ tiếp nhận và phản hồi theo quy trình đã công bố. Đơn hàng chỉ được xem là chính thức khi hai bên đã ký kết hợp đồng hoặc đạt được thỏa thuận bằng văn bản.</li>
                  <li><strong>Chất lượng sản phẩm:</strong> Univi cam kết sản phẩm được sản xuất theo đúng tiêu chuẩn chất lượng đã cam kết. Trong trường hợp sản phẩm không đạt yêu cầu, bạn có thể gửi yêu cầu khiếu nại theo chính sách đã được Univi công bố.</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Miễn trừ Trách nhiệm</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Website và toàn bộ nội dung được cung cấp trên cơ sở &quot;nguyên trạng&quot; và &quot;sẵn có&quot;. Univi không đưa ra bất kỳ bảo đảm nào, dù rõ ràng hay ngụ ý, về tính chính xác, đầy đủ, hoặc phù hợp của nội dung cho một mục đích cụ thể.</li>
                  <li>Univi không chịu trách nhiệm đối với bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên hoặc hậu quả nào phát sinh từ việc sử dụng hoặc không thể sử dụng website này.</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Giải quyết Tranh chấp</h2>
                <p className="text-gray-700 leading-6">
                  Mọi tranh chấp phát sinh từ việc sử dụng website hoặc giao dịch với Univi sẽ được giải quyết trước hết bằng thương lượng trên tinh thần hợp tác. Nếu không thể giải quyết bằng thương lượng, tranh chấp sẽ được đưa ra Tòa án có thẩm quyền tại Việt Nam để giải quyết theo quy định của pháp luật.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Thay đổi Điều khoản</h2>
                <p className="text-gray-700 leading-6">
                  Univi có quyền thay đổi các điều khoản sử dụng này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website. Việc bạn tiếp tục sử dụng website sau khi các thay đổi được đăng tải đồng nghĩa với việc bạn đã chấp nhận các điều khoản mới.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Thông tin Liên hệ</h2>
                <p className="text-gray-700 leading-6 mb-3">
                  Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về Điều khoản sử dụng, vui lòng liên hệ với chúng tôi theo các thông tin sau:
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
