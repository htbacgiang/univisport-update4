import React, { useState, useRef } from 'react';
import Image from 'next/image';
import ContactForm from '../header/ContactForm';

const ROUND_ZIP_PRODUCTS = [
  {
    id: 'mag1-gag1',
    code: 'MAG1-GAG1',
    image: '/images/tshirt-mag4-gag4.jpg',
    name: 'Áo Gym Cổ Tròn Có Khoá - Phối Tay Raglan Đỏ & Thân Đen',
    description: 'Thiết kế cổ tròn tích hợp khóa kéo ngực Powerzip linh hoạt, tay Raglan đỏ phối thân đen thể thao.',
  },
  {
    id: 'mag3-gag3',
    code: 'MAG3-GAG3',
    image: '/images/tshirt-mag2-gag2.jpg',
    name: 'Áo Gym Cổ Tròn Có Khoá - Thân Trắng Phối Sườn Xanh Navy',
    description: 'Tông trắng chủ đạo kết hợp dải mảng phối xanh navy ôm sườn, tôn dáng thể thao khỏe khoắn.',
  },
  {
    id: 'mag18-gag18',
    code: 'MAG18-GAG18',
    image: '/images/tshirt-mag11-uniaos.jpg',
    name: 'Áo Gym Cổ Tròn Có Khoá - Đen Phối Viền Vai Cam & Chỉ Nổi',
    description: 'Chỉ may nổi flatlock cao cấp chống sờn ma sát, điểm nhấn vai cam nổi bật trên sàn tập.',
  },
];

const COLLAR_ZIP_PRODUCTS = [
  {
    id: 'mag17-gag17',
    code: 'MAG17-GAG17',
    isRedCode: true,
    image: '/images/gym/dong-phuc-gym-univi-nu-trang-den-legging.jpg',
    name: 'Đồng Phục Gym Cổ Trụ Có Khoá - Đen Phối Tím Thể Thao',
    description: 'Cổ trụ cao lịch sự kết hợp dây kéo tinh tế, dải phối màu tím độc đáo thu hút thị giác.',
  },
  {
    id: 'mag22-gag22',
    code: 'MAG22-GAG22',
    isRedCode: true,
    image: '/images/gym/dong-phuc-gym-univi-nam-trang-den-quan-short.jpg',
    name: 'Đồng Phục HLV Cổ Trụ Khóa Kéo - Đen Xám Chỉ Trắng',
    description: 'Mẫu áo HLV PT chuẩn Athletic Fit, chất liệu UNI DRY co giãn 4 chiều tản nhiệt vượt trội.',
  },
  {
    id: 'mag23-gag23',
    code: 'MAG23 - GAG23',
    isRedCode: true,
    image: '/images/gym/univi-dong-hanh-cung-the-one-kickfit-3.jpg',
    name: 'Đồng Phục Gym Cổ Trụ Có Khoá - Đen Phối Bo Tay Cam',
    description: 'Điểm nhấn viền bo tay cam năng động, tạo hình ảnh chuyên nghiệp cho phòng tập Fitness.',
  },
];

const UniformStylesZippedComponent = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [contactPopupOpen, setContactPopupOpen] = useState(false);
  const [contactSource, setContactSource] = useState('Tư vấn áo Gym cổ có khoá');
  const modalRef = useRef(null);

  const handleOpenConsult = (productName) => {
    setContactSource(productName || 'Tư vấn mẫu áo Gym cổ có khoá Univi');
    setContactPopupOpen(true);
  };

  return (
    <div className="relative w-full mx-auto bg-white font-sans text-slate-800">
      {/* 1. Hero Models Group Photo Banner with Integrated Tag */}
      <div className="relative w-full rounded-b-3xl md:rounded-b-[36px] rounded-t-none overflow-hidden shadow-xs mb-6 sm:mb-8 bg-slate-50 border border-slate-100">
        {/* Top-Left Banner Tag */}
        <div className="absolute hidden md:block top-0 left-0 z-20 inline-flex items-center px-5 sm:px-8 md:px-10 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#0e3a68] via-[#105d97] to-[#3898ce] text-white rounded-br-[32px] md:rounded-br-[42px] shadow-sm">
          <h1 className="text-base sm:text-2xl md:text-[28px] font-black uppercase tracking-wider text-white">
            KIỂU DÁNG ÁO UNIVI
          </h1>
        </div>

        {/* Center Hero Image */}
        <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] md:aspect-[16/7] min-h-[220px]">
          <Image
            src="/images/gym-style-hero.jpg"
            alt="Kiểu dáng áo Gym UNIVI - Các mẫu áo gym cổ có khoá"
            fill
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="object-cover object-center hover:scale-105 transition-transform duration-700"
            priority
          />
        </div>
      </div>

      {/* Content Container (Centered & Balanced) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. Main Section Title & Subtitle */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-lg md:text-3xl font-bold uppercase tracking-wide text-[#105d97] mb-1">
            CÁC MẪU ÁO GYM CỔ CÓ KHOÁ
          </h2>
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-slate-400 uppercase">
            UNICORE TRAINING COLLECTION
          </p>
        </div>

        {/* 3. Group 1: CỔ TRÒN CÓ KHOÁ */}
        <div className="mb-10 sm:mb-12">
          <h3 className="text-base sm:text-xl font-bold uppercase tracking-wide text-slate-800 mb-4 sm:mb-6">
            CỔ TRÒN CÓ KHOÁ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            {ROUND_ZIP_PRODUCTS.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedProduct(item)}
                className="group flex flex-col items-center cursor-pointer bg-white rounded-xl p-2.5 sm:p-3 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Product Image Box */}
                <div className="relative w-full aspect-[4/3] overflow-hidden mb-2.5 flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Code Label */}
                <div className="text-center">
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-700 group-hover:text-[#105d97]">
                    {item.code}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Group 2: CỔ TRỤ CÓ KHOÁ */}
        <div className="mb-10 sm:mb-12">
          <h3 className="text-base sm:text-xl font-bold uppercase tracking-wide text-slate-800 mb-4 sm:mb-6">
            CỔ TRỤ CÓ KHOÁ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            {COLLAR_ZIP_PRODUCTS.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedProduct(item)}
                className="group flex flex-col items-center cursor-pointer bg-white rounded-xl p-2.5 sm:p-3 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Product Image Box */}
                <div className="relative w-full aspect-[4/3] overflow-hidden mb-2.5 flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Code Label */}
                <div className="text-center">
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-red-600">
                    {item.code}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Customization Footer Notes (Giống hệt ảnh mẫu) */}
        <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div>
            <span className="font-extrabold text-[#105d97] uppercase tracking-wide mr-1.5">
              *TUỲ CHỌN PHỐI MÀU CỔ & TAY
            </span>
            <br className="sm:hidden" />
            <span>
              Dễ dàng tuỳ chỉnh theo màu sắc trong bộ nhận diện, giúp đồng phục trở thành một phần thống nhất của hình ảnh thương hiệu.
            </span>
          </div>
          <div>
            <span className="font-extrabold text-[#105d97] uppercase tracking-wide mr-1.5">
              *LOGO IN/THÊU SẮC NÉT
            </span>
            <br className="sm:hidden" />
            <span>
              Linh hoạt lựa chọn nhiều vị trí thể hiện, giúp tăng khả năng nhận diện và tạo dấu ấn riêng cho từng thương hiệu.
            </span>
          </div>
        </div>

        {/* 6. Bottom Contact Gradient Bar (Giống hệt ảnh mẫu) */}
        <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#105d97] via-[#1a70af] to-[#3898ce] p-3.5 sm:p-4 mb-8 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2">
            <span>📞</span>
            <span className="tracking-wide font-bold">0834.204.999 - 0961.567.997</span>
          </div>
          <div className="flex items-center gap-2 text-center sm:text-right">
            <span>📍</span>
            <span>D4/180 Thanh Bình, P. Mộ Lao, Q. Hà Đông, Hà Nội</span>
          </div>
        </div>
      </div>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-black/60 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => e.target === e.currentTarget && setSelectedProduct(null)}
        >
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 animate-scaleUp">
            <div className="bg-gradient-to-r from-[#105d97] to-[#0e4a7a] p-4 text-white flex justify-between items-center">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-white/80 font-bold">Mã sản phẩm</span>
                <h3 className="text-xl font-black uppercase text-white">{selectedProduct.code}</h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-white/80 hover:text-white bg-white/10 rounded-full p-1.5 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  sizes="500px"
                  className="object-contain p-2"
                />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1">{selectedProduct.name}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedProduct.description}</p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    const name = selectedProduct.code;
                    setSelectedProduct(null);
                    handleOpenConsult(`Yêu cầu thiết kế mã mẫu ${name}`);
                  }}
                  className="flex-1 bg-[#105d97] hover:bg-[#0d4a7a] text-white py-3 rounded-xl font-bold text-sm shadow transition"
                >
                  Yêu cầu thiết kế mã {selectedProduct.code}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form Popup */}
      {contactPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setContactPopupOpen(false)}
        >
          <div ref={modalRef} className="my-4 mx-4 container max-w-6xl" role="dialog" aria-labelledby="style-contact-form-title">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-[#105d97] to-[#0e4a7a] text-white px-5 py-3.5 flex justify-between items-center">
                <h2 id="style-contact-form-title" className="text-base sm:text-lg font-bold uppercase">
                  {contactSource}
                </h2>
                <button
                  onClick={() => setContactPopupOpen(false)}
                  aria-label="Đóng"
                  className="text-white/90 hover:text-white hover:bg-white/10 rounded-lg p-1.5 focus:outline-none transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="bg-white">
                <ContactForm source={contactSource} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(UniformStylesZippedComponent);
