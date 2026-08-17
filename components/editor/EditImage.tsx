import { FC, useCallback, useState, useEffect } from "react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { BubbleMenu, Editor } from "@tiptap/react";

interface Props {
  editor: Editor;
}

const EditImage: FC<Props> = ({ editor }): JSX.Element => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");

  const handleEditClick = () => {
    const attrs = editor.getAttributes("image");
    setSrc(attrs.src || "");
    setAlt(attrs.alt || "");
    setCaption(attrs.caption || "");
    setShowEditForm(true);
  };

  const handleDeleteClick = () => {
    if (confirm("Bạn có chắc chắn muốn xóa ảnh này không?")) {
      editor.chain().focus().deleteSelection().run();
    }
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
    if (isActiveImage && !showEditForm) {
      const attrs = editor.getAttributes("image");
      setSrc(attrs.src || "");
      setAlt(attrs.alt || "");
      setCaption(attrs.caption || "");
    }
  }, [editor, isActiveImage, showEditForm]);

  return (
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
        }
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
            title="Xóa ảnh"
          >
            <BsTrash size={16} />
          </button>
        </div>
      )}
    </BubbleMenu>
  );
};

export default EditImage;
