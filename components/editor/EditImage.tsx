import { FC, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";
import { BubbleMenu, Editor } from "@tiptap/react";

interface Props {
  editor: Editor;
}

const EditImage: FC<Props> = ({ editor }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePos, setDeletePos] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditClick = () => {
    const attrs = editor.getAttributes("image");
    setSrc(attrs.src || "");
    setAlt(attrs.alt || "");
    setCaption(attrs.caption || "");
    setShowEditForm(true);
  };

  const handleDeleteClick = () => {
    const attrs = editor.getAttributes("image");
    setSrc(attrs.src || "");
    setAlt(attrs.alt || "");
    setCaption(attrs.caption || "");
    const { selection } = editor.state;
    setDeletePos(selection.from);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    if (deletePos !== null) {
      try {
        editor.chain().focus().setNodeSelection(deletePos).deleteSelection().run();
      } catch {
        editor.chain().focus().deleteSelection().run();
      }
    } else {
      editor.chain().focus().deleteSelection().run();
    }
    setDeletePos(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!src.trim()) return;

    editor
      .chain()
      .focus()
      .updateAttributes("image", {
        src: src.trim(),
        alt: alt.trim(),
        caption: caption.trim(),
      })
      .run();
    setShowEditForm(false);
  };

  const handleCancel = () => {
    setShowEditForm(false);
  };

  const isActiveImage = editor.isActive("image");

  // Sync state with image attributes when bubble menu opens/updates
  useEffect(() => {
    if (isActiveImage && !showEditForm && !showDeleteConfirm) {
      const attrs = editor.getAttributes("image");
      setSrc(attrs.src || "");
      setAlt(attrs.alt || "");
      setCaption(attrs.caption || "");
    }
  }, [editor, isActiveImage, showEditForm, showDeleteConfirm]);

  return (
    <>
      <BubbleMenu
        shouldShow={({ editor }) => editor.isActive("image")}
        editor={editor}
        tippyOptions={{
          onHide: () => {
            setShowEditForm(false);
          },
          placement: "top",
          getReferenceClientRect: () => {
            const { selection } = editor.state;
            const dom = editor.view.nodeDOM(selection.from) as HTMLElement;
            if (dom) {
              const rect = dom.getBoundingClientRect();
              const x = rect.left + rect.width / 2;
              const y = rect.top + rect.height / 2;
              return {
                width: 0,
                height: 0,
                top: y,
                bottom: y,
                left: x,
                right: x,
                x: x,
                y: y,
                toJSON: () => {},
              } as DOMRect;
            }
            return new DOMRect();
          },
        }}
      >
        {showEditForm ? (
          <form
            onSubmit={handleSubmit}
            className="rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3 min-w-[320px] z-50"
          >
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Chỉnh sửa hình ảnh
            </h4>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">URL ảnh</label>
                <input
                  type="text"
                  className="w-full text-xs bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 focus:border-blue-500 transition p-2 text-primary-dark dark:text-primary"
                  placeholder="URL hình ảnh"
                  value={src}
                  onChange={({ target }) => setSrc(target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Mô tả (Alt text)</label>
                <input
                  type="text"
                  className="w-full text-xs bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 focus:border-blue-500 transition p-2 text-primary-dark dark:text-primary"
                  placeholder="Mô tả ảnh"
                  value={alt}
                  onChange={({ target }) => setAlt(target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Chú thích (Caption)</label>
                <input
                  type="text"
                  className="w-full text-xs bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 focus:border-blue-500 transition p-2 text-primary-dark dark:text-primary"
                  placeholder="Chú thích ảnh dưới bài viết"
                  value={caption}
                  onChange={({ target }) => setCaption(target.value)}
                />
              </div>
            </div>
            <div className="flex space-x-2 justify-end pt-1">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-[#105d97] text-white rounded text-xs hover:opacity-90 transition font-medium"
              >
                Cập nhật
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-lg bg-gray-900 text-white shadow-xl px-4 py-2 flex items-center space-x-4 z-50 border border-gray-800">
            <span className="text-xs max-w-[150px] truncate font-medium">
              {caption || alt || "Hình ảnh"}
            </span>
            <div className="h-4 w-[1px] bg-gray-700" />
            <button
              onClick={handleEditClick}
              className="p-1 hover:text-blue-400 transition-colors"
              title="Chỉnh sửa thông tin"
            >
              <BsPencilSquare size={16} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-1 hover:text-red-500 transition-colors"
              title="Xóa ảnh khỏi bài viết"
            >
              <BsTrash size={16} />
            </button>
          </div>
        )}
      </BubbleMenu>

      {/* Modal Popup Xác nhận Xóa ảnh trong nội dung bài viết (Mount qua Portal vào document.body) */}
      {mounted && showDeleteConfirm && createPortal(
        <div
          className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-sm w-full p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon cảnh báo */}
            <div className="w-14 h-14 mx-auto mb-3.5 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center">
              <FiAlertTriangle size={28} />
            </div>

            <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
              Xóa ảnh khỏi bài viết?
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              Bạn có chắc chắn muốn xóa hình ảnh này khỏi nội dung bài viết không?
            </p>

            {/* Xem trước ảnh cần xóa */}
            {src && (
              <div className="bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-3 mb-5 text-left">
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-white flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate" title={caption || alt || src}>
                    {caption || alt || "Hình ảnh"}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate" title={src}>
                    {src}
                  </p>
                </div>
              </div>
            )}

            {/* Nút hành động */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BsTrash size={14} />
                <span>Xóa ảnh</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default EditImage;
