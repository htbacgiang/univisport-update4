import { FC, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { FiVideo } from "react-icons/fi";
import Button from "./Button";
import useOutsideClick from "./useOutsideClick";

interface CloudinaryVideoItem {
  id: string;
  name: string;
  src: string;
  thumbnail: string;
  duration?: number;
  aspectRatio?: "square" | "vertical" | "horizontal";
}

interface Props {
  onSubmit(video: CloudinaryVideoItem): void;
  onToggle?(isOpen: boolean): void;
  selectedVideo?: { src?: string } | null;
  open?: boolean;
  hideTrigger?: boolean;
  centered?: boolean;
}

const ratioValue = (ratio?: CloudinaryVideoItem["aspectRatio"]) =>
  ratio === "square" ? "1 / 1" : ratio === "vertical" ? "9 / 16" : "16 / 9";

const formatDuration = (duration?: number) => {
  if (!duration) return "";
  const seconds = Math.round(duration);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

const EmbedCloudinaryVideo: FC<Props> = ({ onSubmit, onToggle, selectedVideo, open, hideTrigger = false, centered = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(open ?? false);
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<CloudinaryVideoItem[]>([]);
  const [error, setError] = useState("");

  const hideForm = useCallback(() => {
    setVisible(false);
    onToggle?.(false);
  }, [onToggle]);

  useOutsideClick(containerRef, visible, hideForm, centered ? popupRef : undefined);

  const loadVideos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/api/cloudinary-videos");
      setVideos(data.videos || []);
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || "Không thể tải danh sách video.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open === undefined) return;
    setVisible(open);
    if (open && videos.length === 0) loadVideos();
  }, [open, videos.length, loadVideos]);

  useEffect(() => {
    if (!visible) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") hideForm();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [visible, hideForm]);

  useEffect(() => {
    // Popup mở từ toolbar được ToolBar quản lý scroll. Chỉ popup chỉnh sửa
    // (không có trigger riêng) tự khóa scroll để tránh chồng nhiều effect.
    if (!centered || !visible || !hideTrigger) return;
    const html = document.documentElement;
    const scrollContainers = Array.from(document.querySelectorAll<HTMLElement>(".custom-scrollbar, [data-editor-scroll-container]"));
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousContainerStyles = scrollContainers.map((element) => ({
      element,
      overflow: element.style.overflow,
      overflowY: element.style.overflowY,
      overscrollBehavior: element.style.overscrollBehavior,
    }));

    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    scrollContainers.forEach((element) => {
      element.style.overflow = "hidden";
      element.style.overflowY = "hidden";
      element.style.overscrollBehavior = "none";
    });

    return () => {
      html.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      previousContainerStyles.forEach(({ element, overflow, overflowY, overscrollBehavior }) => {
        element.style.overflow = overflow;
        element.style.overflowY = overflowY;
        element.style.overscrollBehavior = overscrollBehavior;
      });
    };
  }, [centered, visible]);

  const popup = visible ? (
    <div
      ref={popupRef}
      className={`${centered ? "fixed left-1/2 top-1/2 z-[100000] max-h-[88vh] -translate-x-1/2 -translate-y-1/2" : "absolute right-0 top-full z-50 mt-3"} w-[min(94vw,900px)] rounded-xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-700 dark:bg-gray-800`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Chọn video Cloudinary</h3>
          <p className="text-xs text-gray-500">Thư mục: videounivi</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={loadVideos} className="text-xs font-medium text-[#105d97] hover:underline">Tải lại</button>
          <button type="button" onClick={hideForm} className="rounded-md px-2 py-1 text-lg leading-none text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700" aria-label="Đóng popup">×</button>
        </div>
      </div>
      {loading && <p className="py-10 text-center text-sm text-gray-500">Đang tải danh sách video...</p>}
      {!loading && error && <p className="py-8 text-center text-sm text-red-600">{error}</p>}
      {!loading && !error && videos.length === 0 && <p className="py-10 text-center text-sm text-gray-500">Chưa có video trong thư mục videounivi.</p>}
      {!loading && !error && videos.length > 0 && (
        <div className="grid max-h-[min(70vh,620px)] grid-cols-2 gap-4 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-4">
          {videos.map((video) => (
            <button
              type="button"
              key={video.id}
              onClick={() => { onSubmit(video); hideForm(); }}
              className={`group overflow-hidden rounded-lg border bg-gray-50 text-left transition hover:border-[#105d97] hover:shadow-md dark:bg-gray-700 ${selectedVideo?.src === video.src ? "border-[#105d97] ring-2 ring-[#105d97]/30" : "border-gray-200 dark:border-gray-600"}`}
              title={`Chọn ${video.name}`}
            >
              <div className="relative bg-black" style={{ aspectRatio: ratioValue(video.aspectRatio) }}>
                <img src={video.thumbnail} alt="" className="h-full w-full object-contain" loading="lazy" />
                {video.duration && <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1 text-[10px] text-white">{formatDuration(video.duration)}</span>}
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/25 group-hover:opacity-100">Chọn</span>
              </div>
              <span className="block truncate px-2 py-2 text-xs text-gray-700 dark:text-gray-100">{video.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  ) : null;

  return (
    <div ref={containerRef} className="relative">
      {!hideTrigger && <Button onClick={visible ? hideForm : () => { setVisible(true); onToggle?.(true); if (videos.length === 0) loadVideos(); }}><FiVideo title="Chọn video Cloudinary" /></Button>}
      {centered && typeof document !== "undefined" ? createPortal(popup, document.body) : popup}
    </div>
  );
};

export default EmbedCloudinaryVideo;
