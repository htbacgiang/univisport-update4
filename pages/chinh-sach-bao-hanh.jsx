import Head from "next/head";
import DefaultLayout from "../components/layout/DefaultLayout";

export default function WarrantyPolicy() {
  const meta = {
    title: "Bảo Hành 60 Ngày Hình In — An Tâm Đặt Đồng Phục Univi",
    description: "Đồng phục Univi cam kết bảo hành 60 ngày hình in bong tróc cho mọi đơn hàng số lượng lớn. Xử lý nhanh — không gián đoạn hoạt động phòng tập. Xưởng sản xuất tại Đan Phượng, Hà Nội. Liên hệ tư vấn ngay!",
    keywords: "chính sách bảo hành, bảo hành hình in, đồng phục univi, bảo hành 60 ngày, đổi mới sản phẩm",
    robots: "index, follow",
    author: "Đồng Phục Univi",
    canonical: "https://dongphucunivi.com/chinh-sach-bao-hanh",
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
              Bảo Hành 60 Ngày Hình In — An Tâm Đặt Đồng Phục Số Lượng Lớn
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-4">
                <strong>Ngày cập nhật:</strong> {new Date().toLocaleDateString('vi-VN')}
              </p>

              <p className="text-gray-700 leading-6 mb-6">
                Bạn đã từng nhận đồng phục đẹp lúc giao hàng — nhưng chỉ sau vài tuần sử dụng, logo bong tróc, màu in phai nhạt, hình ảnh thương hiệu bị ảnh hưởng nghiêm trọng? Với các phòng tập và đội nhóm thể thao, một bộ đồng phục không chỉ cần đẹp khi nhận — mà phải giữ được chất lượng và hình ảnh trong suốt quá trình vận hành thực tế.
              </p>
              <p className="text-gray-700 leading-6 mb-6">
                Đó là lý do <strong>Đồng phục Univi</strong> xây dựng chính sách bảo hành rõ ràng, minh bạch — giúp Quý đối tác yên tâm từ lúc đặt hàng đến khi đưa vào sử dụng.
              </p>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Chính Sách Bảo Hành 60 Ngày Hình In</h2>
                <p className="text-gray-700 leading-6 mb-3">
                  Dù tỷ lệ lỗi của Đồng phục Univi luôn được kiểm soát ở mức rất thấp nhờ quy trình KCS nghiêm ngặt tại xưởng sản xuất hơn 2.000m² ở Đan Phượng, Hà Nội — chúng tôi vẫn cam kết bảo hành toàn diện để đảm bảo trải nghiệm ổn định nhất cho Quý đối tác.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2"><strong>Nội dung cam kết bảo hành:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                    <li><strong>Thời gian bảo hành:</strong> 60 ngày kể từ ngày nhận hàng</li>
                    <li><strong>Phạm vi bảo hành:</strong> Hình in bong tróc, mờ nhạt, hoặc biến dạng trong điều kiện sử dụng và giặt giũ thông thường</li>
                    <li><strong>Hình thức xử lý:</strong> Đổi mới sản phẩm lỗi — không phát sinh chi phí phía khách hàng</li>
                    <li><strong>Áp dụng cho:</strong> Mọi đơn hàng đồng phục số lượng lớn của phòng tập, đội nhóm và doanh nghiệp</li>
                  </ul>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Tại Sao Chính Sách Bảo Hành Này Quan Trọng?</h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Đảm bảo hình ảnh thương hiệu luôn sắc nét</h3>
                    <p className="text-gray-700 leading-6">
                      Với các chuỗi phòng Gym, Yoga, Kickfit hay MMA — đồng phục nhân viên chính là bộ nhận diện thương hiệu được nhìn thấy mỗi ngày. Một chiếc logo mờ hay hình in bong tróc đồng nghĩa với việc hình ảnh chuyên nghiệp của phòng tập bị ảnh hưởng trực tiếp trong mắt hội viên.
                    </p>
                    <p className="text-gray-700 leading-6 mt-2">
                      Cam kết bảo hành 60 ngày của Univi đảm bảo đồng phục luôn giữ được độ sắc nét — tính thẩm mỹ — sự chuyên nghiệp trong suốt quá trình sử dụng.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Xử lý nhanh — không gián đoạn hoạt động</h3>
                    <p className="text-gray-700 leading-6">
                      Univi hỗ trợ đổi mới sản phẩm trong thời gian ngắn nhất, giúp phòng tập và đội nhóm duy trì hình ảnh đồng bộ trong mọi buổi tập, sự kiện hay giải đấu. Không cần chờ đợi kéo dài, không lo gián đoạn vận hành.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Kiểm soát rủi ro sau bàn giao cho đơn hàng lớn</h3>
                    <p className="text-gray-700 leading-6">
                      Với các đơn hàng hàng trăm đến hàng nghìn sản phẩm, rủi ro sau bàn giao là điều không thể tránh khỏi hoàn toàn. Chính sách bảo hành rõ ràng giúp Quý đối tác kiểm soát rủi ro, đảm bảo trải nghiệm ổn định cho toàn bộ đội ngũ nhân viên và hội viên.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Quy Trình Bảo Hành</h2>
                <p className="text-gray-700 leading-6 mb-3">
                  Để đảm bảo trải nghiệm bảo hành nhanh chóng và thuận tiện, Đồng phục Univi áp dụng quy trình xử lý đơn giản, minh bạch:
                </p>
                <ol className="list-decimal list-inside text-gray-700 space-y-3 ml-2">
                  <li>
                    <strong>Tiếp nhận phản ánh</strong> — Quý đối tác liên hệ hotline hoặc email, mô tả lỗi và gửi hình ảnh sản phẩm
                  </li>
                  <li>
                    <strong>Xác nhận trong 24h</strong> — Đội ngũ kỹ thuật Univi xác nhận lỗi thuộc phạm vi bảo hành
                  </li>
                  <li>
                    <strong>Đổi mới sản phẩm</strong> — Tiến hành sản xuất và giao lại sản phẩm đổi theo đúng thiết kế gốc
                  </li>
                  <li>
                    <strong>Bàn giao và xác nhận</strong> — Đảm bảo Quý đối tác hài lòng với sản phẩm thay thế
                  </li>
                </ol>
                <p className="text-gray-700 leading-6 mt-4">
                  Toàn bộ chi phí vận chuyển và sản xuất đổi hàng bảo hành do <strong>Univi</strong> chịu trách nhiệm — Quý đối tác không phát sinh thêm bất kỳ khoản nào.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Tại Sao Univi Tự Tin Với Cam Kết Này?</h2>
                <p className="text-gray-700 leading-6 mb-3">
                  Sự tự tin đến từ nền tảng sản xuất vững chắc. Với hơn <strong>8 năm kinh nghiệm</strong> trong ngành đồng phục thể thao chuyên dụng, xưởng sản xuất <strong>&gt;2.000m²</strong> tại xã Thọ An, huyện Đan Phượng, Hà Nội cùng đội ngũ ~100 công nhân chuyên nghiệp — mỗi sản phẩm của Univi đều được kiểm soát chất lượng từ khâu chọn vải đến đường in thêu cuối cùng.
                </p>

              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Liên Hệ</h2>
                <p className="text-gray-700 leading-6 mb-3">
                  Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo hành hoặc cần hỗ trợ xử lý bảo hành, vui lòng liên hệ với chúng tôi:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700 mb-1"><strong>Đồng Phục Univi</strong></p>
                  <p className="text-gray-700 mb-1"><strong>Hotline:</strong> 0834.204.999 / 096.156.7997</p>
                  <p className="text-gray-700 mb-1"><strong>Email:</strong> dongphucunivi@gmail.com</p>
                  <p className="text-gray-700 mb-1"><strong>Văn phòng:</strong> Nhà D14, đường Thanh Bình, phường Hà Đông, Hà Nội</p>
                  <p className="text-gray-700"><strong>Xưởng sản xuất:</strong> Xã Thọ An, Huyện Đan Phượng, Hà Nội</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
