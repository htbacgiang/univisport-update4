import { FC, useState, useRef, DragEvent, ChangeEvent } from "react";
import axios from "axios";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FiImage, FiX } from "react-icons/fi";
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
  onFolderChange(folder: string): void;
  onFolderCreated(folder: string): void;
  onSuccess(payload: UploadSuccessPayload): void;
}

const R2ImageUploader: FC<Props> = ({
  folders,
  selectedFolder,
  onFolderChange,
  onFolderCreated,
  onSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      {/* Chọn thư mục dạng folder */}
      <div className="bg-gray-50 dark:bg-gray-750/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <R2FolderSelect
          selectedFolder={selectedFolder}
          folders={folders}
          onChange={onFolderChange}
          onFolderCreated={onFolderCreated}
          label="Lưu vào thư mục:"
        />
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
            Kéo và thả ảnh vào đây, hoặc <span className="text-[#105d97] underline">chọn file</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Hỗ trợ JPG, PNG, WEBP, GIF, SVG (Upload trực tiếp lên Cloudflare R2)
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
                  placeholder="Mô tả chuẩn SEO cho ảnh..."
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
                  placeholder="Chú thích dưới ảnh..."
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
              Chọn lại
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="px-5 py-1.5 text-xs font-medium text-white bg-[#105d97] hover:bg-[#0c4672] rounded-lg transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              <AiOutlineCloudUpload size={16} />
              <span>{uploading ? `Đang tải lên (${progress}%)` : "Tải lên & Chèn vào bài viết"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default R2ImageUploader;
