import React, { useState, useRef } from 'react';
import Image from 'next/image';
import ContactForm from '../header/ContactForm';

const FABRICS = [
  {
    id: 'supercool',
    name: 'UNISUPERCOOL',
    category: 'sport',
    bgGradient: 'from-[#172545] via-[#1c2c4e] to-[#121e38]',
    pattern: 'mesh',
    image: '/images/fabric-supercool-polo.png',
    cardTitle: 'ĐẶC TÍNH CHẤT LIỆU UNISUPERCOOL',
    bullets: [
      'Sợi Polyamide cao cấp (76-90%), mang lại cảm giác mát lạnh tức thì khi tiếp xúc da.',
      'Độ mềm mịn đỉnh cao, co giãn 4 chiều linh hoạt theo từng biên độ chuyển động.',
      'Khả năng chống nhăn tự nhiên, giữ form áo chuẩn đẹp và sang trọng suốt ngày dài.',
    ],
    features: ['Co giãn 4 chiều', 'Mát lạnh tức thì', 'Chống nhăn tự nhiên', 'Chuẩn form PT'],
  },
  {
    id: 'quickdry',
    name: 'UNIQUICKDRY',
    category: 'sport',
    bgGradient: 'from-[#037fa9] via-[#058dbb] to-[#046e96]',
    pattern: 'linear',
    image: '/images/fabric-quickdry-polo.jpg',
    cardTitle: 'ĐẶC TÍNH CHẤT LIỆU UNIVI',
    bullets: [
      'Thoáng khí vượt trội, giữ cơ thể luôn thoáng mát khi vận động.',
      'Thoát ẩm nhanh, đẩy mồ hôi ra bề mặt, hạn chế cảm giác bết dính.',
      'Dòng vải an toàn cho da, đã được kiểm định.',
      'Co giãn đa chiều, linh hoạt theo từng chuyển động của cơ thể.',
    ],
    features: ['Thoát ẩm 1 chiều', 'Khô siêu tốc', 'Chống tia UV', 'Bền màu vượt trội'],
  },
  {
    id: 'uniair',
    name: 'UNIAIR',
    category: 'sport',
    bgGradient: 'from-[#0ea5e9] via-[#38bdf8] to-[#0284c7]',
    pattern: 'air',
    image: '/images/fabric-uniair-polo.png',
    cardTitle: 'ĐẶC TÍNH CHẤT LIỆU UNIAIR',
    bullets: [
      'Công nghệ dệt cấu trúc dệt lỗ kim siêu nhỏ Air-Mesh, tối đa hóa lưu thông không khí.',
      'Trọng lượng siêu nhẹ, mặc như không mặc, cho cảm giác thanh thoát tuyệt đối.',
      'Khả năng tản nhiệt siêu tốc, giúp hạ nhiệt cơ thể nhanh chóng khi vận động mạnh.',
      'Co giãn 4 chiều linh hoạt, hạn chế tối đa ma sát và cảm giác gò bó.',
    ],
    features: ['Cấu trúc Air-Mesh', 'Siêu nhẹ & thoáng', 'Tản nhiệt siêu tốc', 'Kháng khuẩn bám mùi'],
  },
  {
    id: 'polo-casau',
    name: 'POLO CÁ SẤU',
    category: 'office',
    bgGradient: 'from-[#5ba9cc] via-[#6ab7da] to-[#4c9cbd]',
    pattern: 'pique',
    image: '/images/fabric-casau-polo.png',
    cardTitle: 'ĐẶC TÍNH CHẤT LIỆU POLO CÁ SẤU',
    bullets: [
      'Cấu trúc dệt mắt Pique (cá sấu) sang trọng, tạo độ dày dặn và đứng form chuẩn.',
      'Hàng ngàn lỗ thoáng khí li ti trên bề mặt giúp lưu thông gió, giảm tích nhiệt.',
      'Vẻ ngoài lịch lãm, chỉn chu, rất phù hợp cho nhân viên lễ tân, sale và quản lý.',
      'Thấm hút mồ hôi tốt, tạo cảm giác khô ráo, tự tin trong suốt ca làm việc dài.',
    ],
    features: ['Đứng form lịch sự', 'Dệt mắt Pique', 'Thoáng khí tối ưu', 'Chuẩn lễ tân & quản lý'],
  },
  {
    id: 'polo-hoatiet',
    name: 'POLO HOẠ TIẾT',
    category: 'office',
    bgGradient: 'from-[#97cacc] via-[#aee0e2] to-[#88bec1]',
    pattern: 'geometric',
    image: '/images/fabric-hoatiet-polo.jpg',
    cardTitle: 'ĐẶC TÍNH CHẤT LIỆU POLO HOẠ TIẾT',
    bullets: [
      'Kỹ thuật in chuyển nhiệt / dệt Jacquard họa tiết hình học chìm độc quyền, sắc nét.',
      'Công nghệ khóa màu tiên tiến, không phai màu, không bong tróc khi giặt sấy.',
      'Nền vải thể thao cao cấp siêu nhẹ, mềm mượt và thoát nhiệt nhanh chóng.',
      'Tạo dấu ấn nhận diện thương hiệu hiện đại, trẻ trung và năng động cho doanh nghiệp.',
    ],
    features: ['Họa tiết in chìm', 'Không phai màu', 'Siêu nhẹ & mát', 'Độc quyền thương hiệu'],
  },
];

const FabricCardComponent = () => {
  const [selectedId, setSelectedId] = useState('quickdry');
  const [contactPopupOpen, setContactPopupOpen] = useState(false);
  const [contactSource, setContactSource] = useState('Chất liệu vải UNIVI');
  const modalRef = useRef(null);

  const selectedFabric = FABRICS.find((f) => f.id === selectedId) || FABRICS[1];

  const sportList = FABRICS.filter((f) => f.category === 'sport');
  const officeList = FABRICS.filter((f) => f.category === 'office');

  const handleOpenConsult = (sourceName) => {
    setContactSource(sourceName || `Tư vấn chất liệu: ${selectedFabric.name}`);
    setContactPopupOpen(true);
  };

  return (
    <div className="relative container mx-auto my-6 bg-white rounded-3xl p-4   font-sans">
      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Column: Interactive Fabric Cards */}
        <div className="lg:col-span-6 flex flex-col space-y-3.5">
          {/* Group 1: CHẤT LIỆU ÁO POLO THỂ THAO */}
          <div>
            <h3 className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wide text-[#105d97] mb-2 sm:mb-3 md:mb-3.5">
              CHẤT LIỆU ÁO POLO THỂ THAO
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-1 gap-2 sm:gap-3.5">
              {sportList.map((fabric) => {
                const isActive = selectedId === fabric.id;
                return (
                  <button
                    key={fabric.id}
                    type="button"
                    onClick={() => setSelectedId(fabric.id)}
                    className={`group relative w-full h-14 sm:h-24 md:h-[100px] rounded-xl sm:rounded-2xl md:rounded-[20px] overflow-hidden text-center cursor-pointer transition-all duration-300 transform ${isActive
                      ? 'ring-2 sm:ring-4 ring-[#105d97]/40 scale-[1.02] shadow-lg'
                      : 'hover:scale-[1.015] hover:shadow-md opacity-95 hover:opacity-100'
                      }`}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${fabric.bgGradient}`} />

                    {/* Fabric Texture Pattern Overlay */}
                    <div
                      className="absolute inset-0 opacity-30 mix-blend-overlay bg-repeat"
                      style={{
                        backgroundImage:
                          fabric.pattern === 'mesh'
                            ? 'radial-gradient(#ffffff 1.2px, transparent 1.2px)'
                            : 'linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
                        backgroundSize: fabric.pattern === 'mesh' ? '6px 6px' : '4px 100%',
                      }}
                    />

                    {/* Active State Indicator / Glow */}
                    {isActive && (
                      <div className="absolute inset-0 border-2 border-white/40 rounded-xl sm:rounded-2xl md:rounded-[20px] pointer-events-none" />
                    )}

                    {/* Card Title */}
                    <div className="relative h-full flex items-center justify-center px-1 sm:px-4">
                      <span className="text-[10px] min-[380px]:text-xs sm:text-xl md:text-2xl font-black text-white uppercase tracking-tight sm:tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-200 leading-tight">
                        {fabric.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 2: CHẤT LIỆU ÁO POLO VĂN PHÒNG */}
          <div>
            <h3 className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wide text-[#105d97] mb-2 sm:mb-3 md:mb-3.5 mt-2 sm:mt-3">
              CHẤT LIỆU ÁO POLO VĂN PHÒNG
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3.5">
              {officeList.map((fabric) => {
                const isActive = selectedId === fabric.id;
                return (
                  <button
                    key={fabric.id}
                    type="button"
                    onClick={() => setSelectedId(fabric.id)}
                    className={`group relative w-full h-14 sm:h-24 md:h-[100px] rounded-xl sm:rounded-2xl md:rounded-[20px] overflow-hidden text-center cursor-pointer transition-all duration-300 transform ${isActive
                      ? 'ring-2 sm:ring-4 ring-[#105d97]/40 scale-[1.02] shadow-lg'
                      : 'hover:scale-[1.015] hover:shadow-md opacity-95 hover:opacity-100'
                      }`}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${fabric.bgGradient}`} />

                    {/* Fabric Texture Pattern Overlay */}
                    <div
                      className="absolute inset-0 opacity-35 mix-blend-overlay bg-repeat"
                      style={{
                        backgroundImage:
                          fabric.pattern === 'pique'
                            ? 'radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)'
                            : 'linear-gradient(45deg, rgba(255,255,255,0.25) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.25) 75%, transparent 75%, transparent)',
                        backgroundSize: fabric.pattern === 'pique' ? '8px 8px' : '16px 16px',
                      }}
                    />

                    {/* Active State Indicator / Glow */}
                    {isActive && (
                      <div className="absolute inset-0 border-2 border-white/40 rounded-xl sm:rounded-2xl md:rounded-[20px] pointer-events-none" />
                    )}

                    {/* Card Title */}
                    <div className="relative h-full flex items-center justify-center px-1 sm:px-4">
                      <span className="text-xs sm:text-xl md:text-2xl font-black text-white uppercase tracking-tight sm:tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] group-hover:scale-105 transition-transform duration-200 leading-tight">
                        {fabric.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Shirt Image + Dynamic Characteristic Card */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-3">
          {/* Top: Dynamic Polo Shirts Image */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/10] bg-white overflow-hidden flex items-center justify-center">
            <Image
              key={selectedFabric.id}
              src={selectedFabric.image}
              alt={`Mẫu áo đồng phục vải ${selectedFabric.name} UNIVI`}
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-contain p-2 transition-all duration-500 animate-fadeIn"
              priority
            />
          </div>

          {/* Bottom: Dynamic Đặc Tính Chất Liệu Card */}
          <div
            className="relative rounded-xl sm:rounded-2xl p-4 md:p-6 text-white shadow-xl overflow-hidden border border-white/20 bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/card-gradient-bg.jpg)' }}
          >
            {/* Background Glow Accents */}
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header Title */}
            <h4 className="relative text-center text-lg sm:text-xl md:text-2xl font-extrabold uppercase tracking-wider text-white mb-4 drop-shadow-sm transition-all">
              {selectedFabric.cardTitle}
            </h4>

            {/* Dynamic Bullet Points */}
            <ul className="relative space-y-1 sm:space-y-1.5 text-white/95 text-xs sm:text-sm md:text-[15px] leading-relaxed mb-2">
              {selectedFabric.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold select-none text-white/90">-</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>


          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap justify-center items-center gap-3 sm:gap-4">
        <button
          onClick={() => handleOpenConsult(`Yêu cầu mẫu vải: ${selectedFabric.name}`)}
          className="bg-[#105d97] hover:bg-[#0d4a7a] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          aria-label="Request free fabric samples"
        >
          Nhận mẫu vải
        </button>
        <button
          onClick={() => handleOpenConsult(`Tư vấn báo giá đồng phục vải ${selectedFabric.name}`)}
          className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all duration-200"
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
          <div ref={modalRef} className="my-4 mx-4 container max-w-6xl" role="dialog" aria-labelledby="fabric-contact-form-title">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-[#105d97] to-[#0e4a7a] text-white px-5 py-3.5 flex justify-between items-center">
                <h2 id="fabric-contact-form-title" className="text-base sm:text-lg font-bold uppercase">
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

export default React.memo(FabricCardComponent);
