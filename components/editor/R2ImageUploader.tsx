import { FC, useState, useRef, useEffect, DragEvent, ChangeEvent } from "react";
import axios from "axios";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FiImage, FiX, FiFolder, FiCheck, FiArrowRight, FiArrowLeft, FiChevronRight } from "react-icons/fi";
import { toast } from "react-toastify";
import R2FolderSelect from "./R2FolderSelect";

export interface UploadSuccessPayload {
  url: string;
  key: string;
  altText?: string;
  caption?: string;
}

interface Props {
  folders: string[];
  selectedFolder: string;
  initialFile?: File | null;
  onFolderChange(folder: string): void;
  onFolderCreated(folder: string): void;
  onSuccess(payload: UploadSuccessPayload): void;
}

const R2ImageUploader: FC<Props> = ({
  folders,
  selectedFolder,
  initialFile = null,
  onFolderChange,
  onFolderCreated,
  onSuccess,
}) => {
  // Logic 2 bước: Nếu đã có selectedFolder hoặc có initialFile thì vào thẳng Bước 2 (Upload), không cần bắt người dùng chọn lại
  const [step, setStep] = useState<1 | 2>(selectedFolder || initialFile ? 2 : 1);
  const userManuallyNavigatedStep1 = useRef(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialFile) {
      handleFileChange(initialFile);
      userManuallyNavigatedStep1.current = false;
      setStep(2);
    }
  }, [initialFile]);

  useEffect(() => {
    if (!userManuallyNavigatedStep1.current && (selectedFolder || initialFile)) {
      setStep(2);
    }
  }, [selectedFolder, initialFile]);

  const handleFileChange = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WEBP, GIF, SVG)!");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPreviewUrl(objectUrl);
    setProgress(0);
    // Gợi ý alt text từ tên file không có đuôi mở rộng
    const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    if (!altText) {
      setAltText(nameWithoutExt);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const clearSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl("");
    setAltText("");
    setCaption("");
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Vui lòng chọn ảnh trước khi upload!");
      return;
    }

    setUploading(true);
    setProgress(5);

    try {
      // 1. Lấy presigned URL từ server Next.js
      const { data: presignedData } = await axios.post("/api/r2/upload", {
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        folder: selectedFolder || "uploads",
      });

      let finalUrl = presignedData.publicUrl;
      let finalKey = presignedData.key;

      // 2. Upload trực tiếp file lên Cloudflare R2 qua presigned URL
      let directUploadSuccess = false;
      try {
        await axios.put(presignedData.uploadUrl, file, {
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(percent);
            }
          },
        });
        directUploadSuccess = true;
      } catch (directErr: any) {
        console.warn("Direct upload gặp lỗi (có thể do CORS hoặc mạng), tự động chuyển sang upload qua máy chủ:", directErr);
        // Fallback: Upload qua API server
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", selectedFolder || "uploads");

        const { data: proxyData } = await axios.post("/api/r2/upload-proxy", formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(percent);
            }
          },
        });

        if (proxyData?.publicUrl) {
          finalUrl = proxyData.publicUrl;
          finalKey = proxyData.key;
          directUploadSuccess = true;
        } else {
          throw directErr;
        }
      }

      if (directUploadSuccess) {
        setProgress(100);
        toast.success("Upload ảnh lên Cloudflare R2 thành công!");

        // 3. Callback để tự động chèn vào editor
        onSuccess({
          url: finalUrl,
          key: finalKey,
          altText: altText.trim(),
          caption: caption.trim(),
        });

        // Dọn dẹp trạng thái
        clearSelection();
      }
    } catch (err: any) {
      console.error("Lỗi khi upload ảnh lên R2:", err);
      const msg = err.response?.data?.error || err.message || "Upload ảnh thất bại. Vui lòng thử lại!";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Thanh tiến trình 2 bước trực quan */}
      <div className="flex items-center gap-2 p-2 bg-slate-100/90 dark:bg-gray-750 rounded-xl border border-slate-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => {
            userManuallyNavigatedStep1.current = true;
            setStep(1);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            step === 1
              ? "bg-[#105d97] text-white shadow-sm"
              : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 cursor-pointer"
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            step === 2 ? "bg-white/20 text-white" : "bg-emerald-500 text-white"
          }`}>
            {step === 2 ? <FiCheck size={12} /> : "1"}
          </span>
          <span>1. Chọn thư mục lưu</span>
        </button>

        <FiChevronRight className="text-gray-400 shrink-0" size={14} />

        <button
          type="button"
          onClick={() => {
            if (selectedFolder) {
              userManuallyNavigatedStep1.current = false;
              setStep(2);
            }
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            step === 2
              ? "bg-[#105d97] text-white shadow-sm"
              : selectedFolder
              ? "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 cursor-pointer"
              : "text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            step === 2 ? "bg-white/20 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          }`}>
            2
          </span>
          <span>2. Tải ảnh lên R2</span>
        </button>
      </div>

      {/* ── BƯỚC 1: CHỌN THƯ MỤC LƯU TRỮ ── */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-xl flex items-start gap-2.5">
            <FiFolder className="w-4 h-4 text-[#105d97] dark:text-sky-400 mt-0.5 shrink-0" />
            <div className="text-xs text-sky-900 dark:text-sky-200 space-y-0.5">
              <p className="font-bold">Bước 1: Chọn thư mục lưu trữ ảnh trên Cloudflare R2</p>
              <p className="text-[11px] text-sky-700 dark:text-sky-300">
                Vui lòng duyệt chọn thư mục mong muốn (ví dụ: <span className="font-bold font-mono">mockup</span>) hoặc tạo thư mục mới. Sau đó bấm <strong>&quot;Xác nhận thư mục này &amp; Tiếp tục tải ảnh&quot;</strong> để chuyển sang bước chọn file.
              </p>
            </div>
          </div>

          {/* Component duyệt folder R2 */}
          <div className="bg-gray-50 dark:bg-gray-750/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <R2FolderSelect
              selectedFolder={selectedFolder}
              folders={folders}
              onChange={onFolderChange}
              onFolderCreated={onFolderCreated}
              label="Chọn thư mục lưu trữ:"
            />
          </div>

          {/* Thanh xác nhận thư mục để bước sang Bước 2 */}
          <div className="p-3.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Thư mục đang chọn:</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#105d97] dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-3 py-1 rounded-lg">
                <FiFolder className="w-3.5 h-3.5 text-[#105d97]" />
                {selectedFolder || "Thư mục gốc"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                userManuallyNavigatedStep1.current = false;
                setStep(2);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#105d97] hover:bg-[#0c4a7c] text-white font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <FiCheck className="w-4 h-4" />
              <span>Xác nhận thư mục này &amp; Tiếp tục tải ảnh</span>
              <FiArrowRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── BƯỚC 2: TẢI ẢNH LÊN THƯ MỤC ĐÃ CHỌN ── */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Thông tin thư mục đã được xác nhận */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-medium text-emerald-900 dark:text-emerald-300">
                Lưu vào thư mục:{" "}
                <strong className="font-mono underline font-bold">{selectedFolder || "Thư mục gốc"}</strong>
              </span>
            </div>
            <button
              type="button"
              disabled={uploading}
              onClick={() => {
                userManuallyNavigatedStep1.current = true;
                setStep(1);
              }}
              className="text-xs font-semibold text-[#105d97] dark:text-sky-400 hover:underline flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            >
              <FiArrowLeft size={13} />
              <span>Đổi thư mục khác</span>
            </button>
          </div>

          {/* Vùng Drag & Drop */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />

          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-[#105d97] bg-blue-50/50 dark:bg-gray-700/60 scale-[1.01]"
                  : "border-gray-300 dark:border-gray-600 hover:border-[#105d97] bg-gray-50/50 dark:bg-gray-800/50 hover:bg-blue-50/20"
              }`}
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center text-[#105d97]">
                <AiOutlineCloudUpload size={36} />
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Kéo và thả ảnh vào đây, hoặc <span className="text-[#105d97] underline">chọn file từ máy tính</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Hỗ trợ JPG, PNG, WEBP, GIF, SVG (Tải lên Cloudflare R2 / {selectedFolder || "gốc"})
              </p>
            </div>
          ) : (
            <div className="space-y-4 bg-gray-50 dark:bg-gray-700/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Ảnh xem trước */}
                <div className="relative w-36 h-36 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Xem trước"
                    className="w-full h-full object-contain"
                  />
                  {!uploading && (
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Hủy chọn ảnh"
                    >
                      <FiX size={14} />
                    </button>
                  )}
                </div>

                {/* Thông tin file & metadata */}
                <div className="flex-1 w-full space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                    <span className="font-semibold truncate max-w-[200px]" title={file.name}>
                      {file.name}
                    </span>
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mô tả ảnh (Alt text):
                    </label>
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Mô tả cho ảnh..."
                      disabled={uploading}
                      className="w-full text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#105d97]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Chú thích hiển thị (Caption - tùy chọn):
                    </label>
                    <input
                      type="text"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Chú thích ảnh..."
                      disabled={uploading}
                      className="w-full text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#105d97]"
                    />
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              {uploading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
                    <span>Đang upload trực tiếp lên R2...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#105d97] h-2 rounded-full transition-all duration-200 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Nút hành động */}
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  onClick={clearSelection}
                  disabled={uploading}
                  className="px-4 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  Chọn file khác
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#105d97] hover:bg-[#0c4672] rounded-lg transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-sm"
                >
                  <AiOutlineCloudUpload size={16} />
                  <span>{uploading ? `Đang tải lên (${progress}%)` : "Tải lên Cloudflare R2 & Chọn ảnh"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default R2ImageUploader;
