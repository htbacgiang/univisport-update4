"use client";

import { useState, useEffect, useRef } from "react";
import ContactForm from "../header/ContactForm";

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Tư vấn & Xác định nhu cầu",
    time: "Ngày 1",
    desc: "Gọi hotline hoặc nhắn Zalo. Trao đổi loại sản phẩm, số lượng, màu sắc thương hiệu, deadline. Đội ngũ xác nhận tính khả thi ngay trong buổi đầu tiên.",
  },
  {
    step: "02",
    title: "Thiết kế mockup miễn phí",
    time: "Trong 1 giờ làm việc",
    desc: "Gửi logo + màu thương hiệu - Univi hoàn thiện mockup đầy đủ. Chỉnh sửa không giới hạn lần qua Zalo/email đến khi hài lòng.",
  },
  {
    step: "03",
    title: "Chọn vải & Duyệt mẫu thực tế",
    time: "2–5 ngày",
    desc: "Univi gửi mẫu vải thực tế để cầm tay, kiểm tra chất cảm và màu sắc. Sau đó sản xuất 1 mẫu thực tế để mặc thử trước khi chốt toàn đơn.",
  },
  {
    step: "04",
    title: "Sản xuất & Cập nhật tiến độ",
    time: "7–10 ngày làm việc",
    desc: "Toàn bộ sản xuất tại xưởng Đan Phượng. Univi cập nhật tiến độ chủ động từng giai đoạn. 100% sản phẩm qua kiểm tra QC trước khi xuất xưởng.",
  },
  {
    step: "05",
    title: "Giao hàng & Hỗ trợ sau bán",
    time: "Đúng cam kết",
    desc: "Giao toàn quốc. Với đơn lớn tại Hà Nội: giao tận nơi. Hỗ trợ tái đặt theo chu kỳ và xử lý nhanh yêu cầu bổ sung giữa chu kỳ.",
  },
];

export default function ProcessSteps({ variant = "default" }) {
  const [contactOpen, setContactOpen] = useState(false);
  const modalRef = useRef(null);

  const toggleForm = () => setContactOpen((v) => !v);

  useEffect(() => {
    if (!contactOpen) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [contactOpen]);

  if (variant === "vertical") {
    return (
      <div className="space-y-3">
        {PROCESS_STEPS.map((s, i) => (
          <div key={s.step} className="flex gap-4 border-l-4 border-[#105d97]/20 py-2 pl-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#105d97] text-sm font-bold text-white">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-gray-900">{s.title}</h3>
                <span className="rounded-full bg-[#105d97]/10 px-2 py-0.5 text-xs font-medium text-[#105d97]">
                  {s.time}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-gray-600">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl uppercase font-bold text-gray-900 mb-1 max-w-6xl mx-auto leading-6">
            Từ yêu cầu đến sản phẩm{" "}
            <span className="text-[#105d97]">5 bước minh bạch</span>
          </h2>
          <p className="text-gray-500 max-w-4xl mx-auto text-base leading-6">
            Quy trình được thiết kế để tiết kiệm tối đa thời gian của doanh nghiệp — rõ ràng, không phát sinh, đúng tiến độ.
          </p>
        </div>

        {/* Staggered step cards — desktop: alternating high/low, mobile: stack */}
        <div className="hidden lg:flex items-end gap-8 max-w-8xl mx-auto">
          {PROCESS_STEPS.map((s, i) => {
            const isEven = i % 2 === 1;
            return (
              <div key={i} className="flex flex-col items-center flex-1 relative">
                {/* Card pushed up for odd, down for even */}
                <div
                  className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full flex flex-col gap-3 hover:shadow-lg transition-all duration-300 ${isEven ? "mt-16" : "mb-16"}`}
                >
                  {/* Step icon placeholder */}
                  <div className="w-10 h-10 rounded-xl bg-[#105d97]/10 flex items-center justify-center mb-1">
                    <span className="text-[#105d97] font-bold text-sm">{s.step}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm leading-6">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-6 flex-1">{s.desc}</p>
                  <span className="text-xs bg-[#105d97]/8 text-[#105d97] rounded-full px-2.5 py-1 self-start font-medium">
                    {s.time}
                  </span>

                  {/* Step number badge at bottom */}
                  <div className="absolute -bottom-5 left-6 w-10 h-10 rounded-full bg-[#105d97] text-white flex items-center justify-center font-bold text-sm shadow-md z-10">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Dashed arrow to next step */}
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 pointer-events-none">
                    <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
                      <path
                        d="M2 12 C12 4, 36 4, 46 12"
                        stroke="#105d97"
                        strokeWidth="1.8"
                        strokeDasharray="4 3"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <path d="M40 8 L46 12 L40 16" stroke="#105d97" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile: simple vertical stack */}
        <div className="lg:hidden space-y-4 max-w-lg mx-auto">
          {PROCESS_STEPS.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#105d97] text-white flex items-center justify-center font-bold text-sm">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">{s.title}</h3>
                  <span className="text-xs bg-[#105d97]/10 text-[#105d97] rounded-full px-2 py-0.5">{s.time}</span>
                </div>
                <p className="text-xs text-gray-500 leading-6">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <button
            onClick={toggleForm}
            className="inline-flex items-center gap-2 bg-[#105d97] hover:bg-[#0d4f82] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Bắt đầu quy trình ngay →
          </button>
        </div>
      </div>

      {contactOpen && (
        <div
          className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={(e) => e.target === e.currentTarget && toggleForm()}
        >
          <div
            ref={modalRef}
            className="modal-content rounded-lg overflow-hidden"
          >
            <div className="bg-white px-6 py-4 flex justify-center items-center border-b rounded-t-lg relative">
              <h3 className="text-[#105d97] font-bold text-base md:text-lg tracking-wide uppercase text-center">
                Đăng ký tư vấn đồng phục Univi
              </h3>

              <button
                onClick={toggleForm}
                aria-label="Đóng form liên hệ"
                className="absolute right-4 text-[#105d97] hover:text-[#0d4c7a] focus:outline-none rounded-full p-2 transition-all hover:rotate-90 duration-300 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-white">
              <ContactForm source="Process Steps" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
