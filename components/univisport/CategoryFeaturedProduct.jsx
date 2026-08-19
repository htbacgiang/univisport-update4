import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '../header/ContactForm';
import { FaTimes, FaStar, FaPhoneAlt, FaFire, FaCheckCircle, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

export default function CategoryFeaturedProduct({ product, sectionTitle }) {
  if (!product) return null;

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [card1MediaIdx, setCard1MediaIdx] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [fullscreenMedia, setFullscreenMedia] = useState(null);
  const [imageError, setImageError] = useState({});

  const cfg = product.featuredConfig || {};
  const colors = Array.isArray(product.colors) ? product.colors : [];
  const selectedColor = colors[selectedColorIdx] || null;

  // Card 2 (Center Card): Main Image depends on Color Selection
  const mainImage = selectedColor?.image || product.image || '/images/placeholder.jpg';
  const displayTitle = cfg.customTitle || product.name;
  const displaySubtitle = cfg.customSubtitle || product.categoryNameVN || 'Stylish Polo';
  const displayDescription = cfg.customDescription || product.description;
  const displayMainImage = cfg.customImage || mainImage;
  const customBadgeText = cfg.badgeText || '';

  // Card 1 (Left Card): Independent Media List (Video / Fixed Images)
  let card1MediaList = [];

  if (cfg.videoUrl) {
    card1MediaList.push({ type: 'video', url: cfg.videoUrl });
  }

  if (cfg.customSecondaryImage) {
    const customImgs = cfg.customSecondaryImage.split(',').map(s => s.trim()).filter(Boolean);
    customImgs.forEach(img => card1MediaList.push({ type: 'image', url: img }));
  }

  // Fallback to gallery or product colors if card1MediaList is empty
  if (card1MediaList.length === 0) {
    if (Array.isArray(product.gallery) && product.gallery.length > 0) {
      product.gallery.forEach(img => card1MediaList.push({ type: 'image', url: typeof img === 'string' ? img : img.src }));
    } else if (colors.length > 1) {
      colors.forEach(c => { if (c.image) card1MediaList.push({ type: 'image', url: c.image }); });
    } else {
      card1MediaList.push({ type: 'image', url: product.image });
    }
  }

  const currentCard1Media = card1MediaList[card1MediaIdx % card1MediaList.length] || card1MediaList[0];

  const handlePrevCard1 = (e) => {
    e.stopPropagation();
    setCard1MediaIdx(prev => (prev - 1 + card1MediaList.length) % card1MediaList.length);
  };

  const handleNextCard1 = (e) => {
    e.stopPropagation();
    setCard1MediaIdx(prev => (prev + 1) % card1MediaList.length);
  };

  const openFullscreenCard1 = (e) => {
    e?.stopPropagation();
    if (currentCard1Media) {
      setFullscreenMedia({ type: currentCard1Media.type, url: currentCard1Media.url });
    }
  };

  const soldCount = cfg.soldCount || '1.500+ sản phẩm';
  const recentCustomersRaw = cfg.recentCustomers || 'California Fitness | /feedback/california-fitness, VNPay | https://vnpay.vn, Techcombank';

  // Parse recent customers list (Format: Name | Link)
  const recentCustomersList = recentCustomersRaw
    ? recentCustomersRaw
      .split(/[\n,]+/)
      .map((item) => {
        const parts = item.split('|');
        const name = parts[0]?.trim() || '';
        const link = parts[1]?.trim() || '';
        return { name, link };
      })
      .filter((c) => c.name)
    : [];

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder.jpg';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    if (imagePath.startsWith('/')) return imagePath;
    return `/${imagePath}`;
  };

  const discount = product.discount || (
    product.maxPrice && product.maxPrice > product.price
      ? Math.round(((product.maxPrice - product.price) / product.maxPrice) * 100)
      : 0
  );

  return (
    <section className="px-4 py-4 md:py-6 bg-white">
      <div className="container mx-auto">

        {/* 3-Column Layout: 2 Image Cards side-by-side on mobile, 3 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-3 sm:gap-4 md:gap-5 lg:gap-6 items-stretch">
          {/* Column 1: Left Card - Independent Video / Multi-Image Slider with Fullscreen Popup */}
          <div
            onClick={openFullscreenCard1}
            className="col-span-1 md:col-span-4 rounded-xl lg:rounded-2xl relative flex items-center justify-center aspect-[4/5] min-h-[200px] sm:min-h-[280px] md:min-h-[440px] group overflow-hidden cursor-pointer bg-[#f3f3f5] border border-gray-200 shadow-sm"
          >
            {/* Badges on top left */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
              {customBadgeText ? (
                <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                  {customBadgeText}
                </span>
              ) : (
                <>
                  {discount > 0 && (
                    <span className="bg-[#2563eb] block md:hidden text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                      NỔI BẬT
                    </span>
                  )}
                  {(product.isNew || discount === 0) && (
                    <span className="bg-[#105d97] hidden md:block text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                      NỔI BẬT
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Expand / Fullscreen Button on top right */}
            <button
              type="button"
              onClick={openFullscreenCard1}
              className="absolute top-4 right-4 z-20 w-9 h-9 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 shadow-md"
              title={currentCard1Media?.type === 'video' ? 'Xem Video phóng to' : 'Mở xem ảnh phóng to'}
            >
              <FaExpand size={13} />
            </button>

            {/* Left Navigation Arrow */}
            {card1MediaList.length > 1 && (
              <button
                type="button"
                onClick={handlePrevCard1}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-md"
                aria-label="Hình/Video trước"
              >
                <FaChevronLeft size={12} />
              </button>
            )}

            {/* Card 1 Media (Video or Image) */}
            {currentCard1Media?.type === 'video' ? (
              <div className="relative w-full h-full rounded-xl lg:rounded-2xl overflow-hidden bg-black" onClick={(e) => e.stopPropagation()}>
                <video
                  src={currentCard1Media.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover rounded-2xl lg:rounded-3xl cursor-pointer"
                />
              </div>
            ) : (
              <Image
                src={imageError[`sec_${card1MediaIdx}`] ? '/images/placeholder.jpg' : getImageUrl(currentCard1Media?.url)}
                alt={`${displayTitle} preview`}
                fill
                className="object-contain md:object-cover rounded-xl lg:rounded-2xl transition-transform duration-500 group-hover:scale-105"
                onError={() => setImageError(prev => ({ ...prev, [`sec_${card1MediaIdx}`]: true }))}
                unoptimized={getImageUrl(currentCard1Media?.url).startsWith('http')}
              />
            )}

            {/* Right Navigation Arrow */}
            {card1MediaList.length > 1 && (
              <button
                type="button"
                onClick={handleNextCard1}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-md"
                aria-label="Hình/Video tiếp theo"
              >
                <FaChevronRight size={12} />
              </button>
            )}

            {/* Card 1 Dots Indicator (Max 3 dots) */}
            {card1MediaList.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5  px-2.5 py-1 rounded-full">
                {card1MediaList.slice(0, 3).map((_, idx) => {
                  const activeDotIdx = card1MediaList.length <= 3
                    ? card1MediaIdx
                    : card1MediaIdx % 3;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setCard1MediaIdx(idx); }}
                      className={`w-2 h-2 rounded-full transition-all ${activeDotIdx === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                      aria-label={`Chuyển sang slide ${idx + 1}`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Column 2: Center Card - Main Product Image (Responds to Color Selection on Right) */}
          <div className="col-span-1 md:col-span-4 rounded-xl lg:rounded-2xl relative flex items-center justify-center aspect-[4/5] min-h-[200px] sm:min-h-[280px] md:min-h-[440px] group overflow-hidden bg-[#f3f3f5] border border-gray-200 shadow-sm">
            <Link href={`/san-pham/${product.slug}`} legacyBehavior>
              <a className="relative w-full h-full block cursor-pointer">
                <Image
                  src={imageError['main'] ? '/images/placeholder.jpg' : getImageUrl(displayMainImage)}
                  alt={displayTitle}
                  fill
                  className="object-contain md:object-cover rounded-xl lg:rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  priority
                  onError={() => setImageError(prev => ({ ...prev, main: true }))}
                  unoptimized={getImageUrl(displayMainImage).startsWith('http')}
                />
              </a>
            </Link>
          </div>

          {/* Column 3: Right Section - Product Details */}
          <div className="col-span-2 md:col-span-4 flex flex-col justify-start py-1 lg:py-2 px-1">
            <div className="flex flex-col gap-2.5">
              {/* Title */}
              <Link href={`/san-pham/${product.slug}`} legacyBehavior>
                <a className="hover:text-[#2563eb] transition-colors">
                  <h3 className="text-lg md:text-xl font-black text-gray-900 tracking-tight leading-snug">
                    {displayTitle}
                  </h3>
                </a>
              </Link>

              {/* Description */}
              {displayDescription && (
                <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed ">
                  {displayDescription}
                </p>
              )}

              {/* Rating, SKU & Sold Count */}
              <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap mt-0.5">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={14} className={i < Math.round(product.rating || 5) ? 'text-amber-400' : 'text-gray-300'} />
                  ))}
                  <span className="text-xs text-gray-600 font-semibold ml-1">
                    ({product.reviewCount || 1})
                  </span>
                </div>
                {product.maSanPham && (
                  <span className="text-xs text-gray-500 font-medium border-l border-gray-300 pl-2">
                    SKU: {product.maSanPham}
                  </span>
                )}
                {soldCount && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full ml-auto shadow-sm">
                    <FaFire size={11} className="text-red-500" />
                    Đã bán: {soldCount}
                  </span>
                )}
              </div>


              {/* Color Selector */}
              {colors.length > 0 && (
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm font-semibold text-gray-700 w-12 flex-shrink-0 whitespace-nowrap ">
                    Màu sắc:
                  </span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {colors.map((color, idx) => {
                      const hex1 = color.hex || '#000000';
                      const hex2 = color.hex2 || hex1;
                      const isSplit = hex2 !== hex1;
                      const isWhite = !isSplit && (hex1.toLowerCase() === '#ffffff' || hex1.toLowerCase() === '#fff');
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedColorIdx(idx)}
                          aria-label={`Chọn màu ${color.name}`}
                          title={color.name}
                          className={`w-6 h-6 rounded-full p-[2px] border transition-all ${selectedColorIdx === idx
                            ? 'border-[#2563eb] ring-2 ring-[#2563eb]/30 scale-105'
                            : 'border-gray-200 hover:border-gray-400'
                            }`}
                        >
                          <div
                            className="w-full h-full rounded-full"
                            style={{
                              background: isSplit
                                ? `linear-gradient(90deg, ${hex1} 50%, ${hex2} 50%)`
                                : hex1,
                              border: isWhite ? '1px solid #d1d5db' : 'none',
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recent Customers List */}
              {recentCustomersList.length > 0 && (
                <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                    Khách hàng đã đặt sản phẩm này:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {recentCustomersList.map((customer, idx) => {
                      if (customer.link) {
                        const isExternal = customer.link.startsWith('http://') || customer.link.startsWith('https://');
                        return (
                          <a
                            key={idx}
                            href={customer.link}
                            target={isExternal ? '_blank' : '_self'}
                            rel={isExternal ? 'noopener noreferrer' : ''}
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#2563eb] bg-blue-50/90 hover:bg-blue-100 hover:text-blue-800 px-3 py-1 rounded-full border border-blue-200 shadow-sm transition-all cursor-pointer group"
                            title={`Xem thông tin / bài viết về ${customer.name}`}
                          >
                            <FaCheckCircle size={10} className="text-[#2563eb]" />
                            <span>{customer.name}</span>
                            <FiExternalLink size={10} className="text-blue-400 group-hover:text-blue-600 ml-0.5" />
                          </a>
                        );
                      }
                      return (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-gray-200"
                        >
                          <FaCheckCircle size={10} className="text-gray-400" />
                          <span>{customer.name}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Action Row: Full-width Contact Order Button */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="w-full bg-[#105d97] hover:bg-[#105d97]/90 text-white font-bold px-6 py-3 rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 text-sm md:text-base whitespace-nowrap"
                >
                  <FaPhoneAlt size={14} />
                  <span>Liên hệ đặt hàng</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Media Lightbox Popup */}
      {fullscreenMedia && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999999] flex items-center justify-center p-4 select-none"
          onClick={() => setFullscreenMedia(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setFullscreenMedia(null)}
            className="absolute top-4 right-4 z-50 w-11 h-11 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
            aria-label="Đóng xem phóng to"
          >
            <FaTimes size={20} />
          </button>

          {/* Lightbox Left Nav Arrow */}
          {card1MediaList.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handlePrevCard1(e); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xl"
              aria-label="Hình/Video trước"
            >
              <FaChevronLeft size={18} />
            </button>
          )}

          {/* Media Content */}
          {currentCard1Media?.type === 'video' ? (
            <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <video
                key={currentCard1Media.url}
                src={currentCard1Media.url}
                autoPlay
                controls
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="relative w-full max-w-5xl h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <Image
                key={currentCard1Media?.url}
                src={getImageUrl(currentCard1Media?.url)}
                alt={displayTitle}
                fill
                style={{ objectFit: 'contain' }}
                className="rounded-xl shadow-2xl transition-all duration-300"
                unoptimized={getImageUrl(currentCard1Media?.url).startsWith('http')}
              />
            </div>
          )}

          {/* Lightbox Right Nav Arrow */}
          {card1MediaList.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleNextCard1(e); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xl"
              aria-label="Hình/Video tiếp theo"
            >
              <FaChevronRight size={18} />
            </button>
          )}

          {/* Lightbox Dots Indicator */}
          {card1MediaList.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full">
              {card1MediaList.slice(0, 3).map((_, idx) => {
                const activeDotIdx = card1MediaList.length <= 3
                  ? card1MediaIdx
                  : card1MediaIdx % 3;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setCard1MediaIdx(idx); }}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${activeDotIdx === idx ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/80'}`}
                    aria-label={`Chuyển sang slide ${idx + 1}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Contact / Order Modal */}
      {contactOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4"
          onClick={() => setContactOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-[#2563eb] font-bold text-base md:text-lg tracking-wide uppercase text-center flex-1">
                Liên hệ đặt hàng & Nhận báo giá
              </h3>
              <button
                onClick={() => setContactOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Đóng"
              >
                <FaTimes size={18} />
              </button>
            </div>
            <ContactForm
              source={`Item of the Week: ${displayTitle} (Màu: ${selectedColor?.name || 'Mặc định'})`}
            />
          </div>
        </div>
      )}
    </section>
  );
}
