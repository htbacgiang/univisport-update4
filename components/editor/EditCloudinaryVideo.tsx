import { FC, useEffect, useState } from "react";
import { BubbleMenu, Editor } from "@tiptap/react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import EmbedCloudinaryVideo from "./ToolBar/EmbedCloudinaryVideo";

interface Props {
  editor: Editor;
}

type VideoAspectRatio = "square" | "vertical" | "horizontal";

const EditCloudinaryVideo: FC<Props> = ({ editor }) => {
  const [editing, setEditing] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const active = editor.isActive("cloudinaryVideo");

  useEffect(() => {
    if (!active) {
      setEditing(false);
      setPickerOpen(false);
    }
  }, [active]);

  const replaceVideo = (video: { src: string; name?: string; aspectRatio?: VideoAspectRatio }) => {
    editor.chain().focus().updateAttributes("cloudinaryVideo", {
      src: video.src,
      title: video.name || "Video Univi",
      aspectRatio: video.aspectRatio || "horizontal",
    }).run();
    setPickerOpen(false);
    setEditing(false);
    editor.commands.blur();
  };

  const deleteVideo = () => {
    if (window.confirm("Bạn có chắc muốn xóa video này không?")) {
      editor.chain().focus().deleteSelection().run();
      setEditing(false);
      editor.commands.blur();
    }
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: currentEditor }) => currentEditor.isActive("cloudinaryVideo")}
      tippyOptions={{ placement: "top" }}
    >
      {editing ? (
        <EmbedCloudinaryVideo
          onSubmit={replaceVideo}
          onToggle={setPickerOpen}
          selectedVideo={null}
          open={pickerOpen}
          hideTrigger
          centered
        />
      ) : (
        <div className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white shadow-xl">
          <span className="max-w-[220px] truncate text-xs">Video Cloudinary</span>
          <button type="button" onClick={() => { setEditing(true); setPickerOpen(true); }} className="p-1 hover:text-blue-300" title="Chỉnh sửa video">
            <BsPencilSquare size={16} />
          </button>
          <button type="button" onClick={deleteVideo} className="p-1 hover:text-red-400" title="Xóa video">
            <BsTrash size={16} />
          </button>
        </div>
      )}
    </BubbleMenu>
  );
};

export default EditCloudinaryVideo;
