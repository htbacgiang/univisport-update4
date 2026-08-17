import { useState } from "react";
import Image from "next/image";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebookF,
  FaYoutube,
  FaPaperPlane,
  FaUser,
  FaLinkedin,
  FaCalendarAlt,
  FaCheckCircle,
  FaTshirt
} from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import {
  trackContact,
  trackPhoneClick,
  trackZaloClick,
} from "../../lib/meta-pixel";

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState("contact");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    uniformType: "",
    quantity: "",
    location: "",
    message: "",
    consultationDate: "",
    consultationTime: "",
    consultationType: "office"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const contactInfo = {
    address: "Nhà D14, Ngõ 180 đường Thanh Bình, Hà Đông, Hà Nội",
    phone: "0834.204.999",
    email: "dongphucunivi@gmail.com",
    workingHours: {
      weekdays: "Thứ 2 - Thứ 7: 8:00 - 18:00",
      weekend: "Chủ nhật: 9:00 - 17:00"
    }
  };

  const socialLinks = [
    { name: "Facebook", icon: FaFacebookF, url: "https://facebook.com/Dongphucunivi", color: "bg-blue-600" },
    { name: "YouTube", icon: FaYoutube, url: "https://youtube.com/@dongphucunivi", color: "bg-red-600" },
    { name: "Zalo", icon: SiZalo, url: "https://zalo.me/0834204999", color: "bg-blue-500" },
    { name: "Linkedin", icon: FaLinkedin, url: "https://www.linkedin.com/company/univi-uniform", color: "bg-blue-500" }

  ];

  const uniformTypes = [
    "Đồng phục Gym",
    "Đồng phục áo Polo",
    "Đồng phục Pickleball",
    "Đồng phục áo thun",
    "Đồng phục Yoga - Pilates",
    "Đồng phục công sở",
    "Đồng phục Chạy bộ",
    "Đồng phục Team building",
    "Đồng phục Lễ tân",
    "Đồng phục Sự kiện",
    "Đồng phục MMA"
  ];


  const timeSlots = [
    "09:00 - 10:00",
    "10:00 - 11:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00"
  ];

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Họ và tên là bắt buộc';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else {
      // Basic phone validation
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
    }

    // Validate email if provided
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Email không hợp lệ';
      }
    }

    // Validate consultation date if provided
    if (formData.consultationDate) {
      const selectedDate = new Date(formData.consultationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.consultationDate = 'Ngày tư vấn phải là ngày trong tương lai';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create a simplified payload that matches the Contact API
      const contactPayload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: `Loại đồng phục: ${formData.uniformType || 'Chưa chọn'}
Số lượng: ${formData.quantity || 'Chưa xác định'}
Vị trí giao hàng: ${formData.location || 'Chưa xác định'}
${formData.consultationDate ? `Ngày tư vấn: ${formData.consultationDate}` : ''}
${formData.consultationTime ? `Khung giờ: ${formData.consultationTime}` : ''}
${formData.consultationType ? `Hình thức: ${formData.consultationType === 'office' ? 'Tại văn phòng' : 'Trực tuyến'}` : ''}

Yêu cầu chi tiết: ${formData.message || 'Không có yêu cầu cụ thể'}`
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactPayload),
      });

      const result = await response.json();

      if (result.success) {
        trackContact({
          content_name: "Trang liên hệ",
          uniform_type: formData.uniformType || "Chưa chọn",
          quantity: formData.quantity || "Chưa xác định",
        });
        setSubmitStatus("success");
        setErrors({});
        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          uniformType: "",
          quantity: "",
          location: "",
          message: "",
          consultationDate: "",
          consultationTime: "",
          consultationType: "office"
        });
      } else {
        setSubmitStatus("error");
        console.error('API Error:', result.message);
      }
    } catch (error) {
      setSubmitStatus("error");
      console.error('Network Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="h-[80px]"></div>
      {/* Contact Information */}
      <section className="md:py-20 py-6">
        <div className="container mx-auto md:px-4 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Thông tin liên hệ
              </h2>

              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Địa chỉ văn phòng</h3>
                    <p className="text-gray-700 leading-6">{contactInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Hotline</h3>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      data-meta-tracked="true"
                      onClick={() => trackPhoneClick(contactInfo.phone, { source: "contact_page" })}
                      className="text-blue-600 hover:text-blue-700 font-medium text-lg transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FaClock className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Giờ làm việc</h3>
                    <p className="text-gray-700">{contactInfo.workingHours.weekdays}</p>
                    <p className="text-gray-700">{contactInfo.workingHours.weekend}</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Kết nối với chúng tôi</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-meta-tracked={social.name === "Zalo" ? "true" : undefined}
                        onClick={() => {
                          if (social.name === "Zalo") trackZaloClick({ source: "contact_page" });
                        }}
                        aria-label={`${social.name} Đồng Phục Univi`}
                        title={`${social.name} Đồng Phục Univi`}
                        className={`w-12 h-12 ${social.color} rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="text-xl" aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.2342853220844!2d105.77886910000001!3d20.983243699999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345390f181a5bd%3A0xcdf3833aed740992!2zxJBvzILMgG5nIFBodcyjYyBVbml2aQ!5e0!3m2!1svi!2s!4v1758983479311!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
