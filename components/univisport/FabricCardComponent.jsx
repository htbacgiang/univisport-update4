import React, { useState, useRef } from 'react';
import ContactForm from '../header/ContactForm';

// URL mẫu cho hình ảnh (thay bằng tệp cục bộ hoặc URL của bạn)
const fabrics = [
  {
    bgImage: '../images/uni-quickdry.webp',
    title: 'UNIVI QUICK DRY',
    description:
      'Thành phần chính là sợi Polyester cao cấp PET (82-100%), co giãn đa chiều, nhẹ, nhanh khô, chống tia UV,... Thích hợp cho các bộ môn Gym, Fitnnes, MMA, Running, Pickleball, Tennis,...',
  },
  {
    bgImage: '../images/uni-supper-cool.webp',
    title: 'UNIVI SUPER COOL',
    description:
      'Thành phần chính là sợi Polyamide (76-90%), dòng vải thể thao cao cấp nhất trên thị trường. Với đặc tính mềm, mát, mịn, co giãn tốt, chống nhăn, bền form,... Thích hợp cho các bộ môn Yoga, Pilates, Dance, Aerobic,...',
  },
  {
    bgImage: '../images/uni-blended.webp',
    title: 'UNIVI BLENDED',
    description:
      'Là sự kết hợp của Polyester và Cotton. Nhanh khô, mềm mịn, mát, nhẹ, chống tia UV cao hơn, chống nhăn nhàu và rất bền màu. Ứng dụng cho các bộ môn Pickleball, Running, Cycling,...',
  },
];

// URL mẫu cho nền section
const sectionBg = '../images/banner-4.webp';

const FabricCardComponent = () => {
  const [contactPopupOpen, setContactPopupOpen] = useState(false);
  const modalRef = useRef(null);

  const handleFreeDesign = () => {
    setContactPopupOpen(true);
  };

  const handleGetQuote = () => {
    setContactPopupOpen(true);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${sectionBg})` }}
    >
      {/* Lớp phủ mờ cho toàn bộ section */}
      <div className="absolute inset-0 bg-black bg-opacity-10" />

      {/* Gradient trên */}
      <div
        className="absolute top-0 left-0 right-0 h-40"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.5), transparent)',
        }}
      />

      {/* Gradient dưới */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40"
        style={{
          backgroundImage:
            'linear-gradient(to top, #FFFFFF, rgba(255, 255, 255, 0.5), transparent)',
        }}
      />

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl opacity-90">
        {fabrics.map((fabric, index) => (
          <div
            key={index}
            role="region"
            aria-labelledby={`fabric-title-${index}`}
            className="
              relative 
              text-white 
              rounded-lg 
              shadow-lg 
              flex 
              flex-col 
              justify-center 
              items-center 
              bg-cover 
              bg-center 
              min-h-[220px]
              md:aspect-[9/16]  /* từ md trở lên: 9:16 */
            "
            style={{ backgroundImage: `url(${fabric.bgImage})` }}
          >
            <div className="absolute inset-0 rounded-lg bg-black bg-opacity-50" />
            <div className="relative z-10 flex flex-col justify-center items-center p-6">
              <p
                id={`fabric-title-${index}`}
                className="text-xl font-medium mb-2 text-center"
              >
                {fabric.title}
              </p>
              <div className="w-12 h-1 bg-white mx-auto mb-4" />
              <p className="text-sm md:text-base text-center leading-6">{fabric.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-8 flex space-x-4">
        <button
          onClick={handleFreeDesign}
          className="bg-[#105d97] text-white px-6 py-2 rounded-full font-medium hover:bg-red-600 transition"
          aria-label="Request free design"
        >
          Miễn phí thiết kế
        </button>
        <button
          onClick={handleGetQuote}
          className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition"
          aria-label="Get a quote"
        >
          Nhận báo giá
        </button>
      </div>

      {/* Contact Form Popup */}
      {contactPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setContactPopupOpen(false)}
        >
          <div ref={modalRef} className="my-4 mx-4 container" role="dialog" aria-labelledby="fabric-contact-form-title">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-[#105d97] to-[#0e4a7a] text-white px-5 py-3.5 flex justify-between items-center">
                <h2 id="fabric-contact-form-title" className="text-lg font-medium uppercase">Liên hệ nhận báo giá</h2>
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
              <div className="bg-white"><ContactForm source="Fabric Section" /></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(FabricCardComponent);