import { FC } from "react";
import { useState } from "react";
import { Editor } from "@tiptap/react";
import { AiFillCaretDown } from "react-icons/ai";
import { RiDoubleQuotesL } from "react-icons/ri";
import {
  BsTypeStrikethrough,
  BsBraces,
  BsCode,
  BsListOl,
  BsListUl,
  BsTypeBold,
  BsTypeItalic,
  BsTypeUnderline,
  BsImageFill,
  BsImages,
} from "react-icons/bs";
import { MdFormatAlignCenter, MdFormatAlignRight, MdFormatAlignLeft } from "react-icons/md";
import { MdTableRows, MdTableView, MdDeleteOutline } from "react-icons/md";

import Button from "./Button";
import { getFocusedEditor } from "../EditorUtils";
import DropdownOptions from "../../common/DropdownOptions";
import InsertLink from "../Link/InsertLink";
import { linkOption } from "../Link/LinkForm";
import { getEditorLinkAttributes } from "../../../utils/internalLinks";
import EmbedYoutube from "./EmbedYoutube";
import EmbedImage from "./EmbedImage";
import InsertTable from "./InsertTable";
import EmbedFacebookReels from "./EmbedFacebookReels";
import InsertAdBanner from "./InsertAdBanner";
import InsertComponent from "./InsertComponent";
import FindReplace from "./FindReplace";

interface Props {
  editor: Editor | null;
  onOpenImageClick?(): void;
  onOpenGalleryClick?(): void;
  onDropdownToggle?(isOpen: boolean): void;
}

const ToolBar: FC<Props> = ({
  editor,
  onOpenImageClick,
  onOpenGalleryClick,
  onDropdownToggle,
}): JSX.Element | null => {
  const [textColor, setTextColor] = useState<string>("#000000");

  const handleTextColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) return;
    
    const selectedColor = event.target.value;
    setTextColor(selectedColor);
    getFocusedEditor(editor).setColor(selectedColor).run();
  };

  const options = [
    {
      label: "Đoạn văn",
      onClick: () => {
        if (!editor) return;
        getFocusedEditor(editor).setParagraph().run();
      },
    },
    {
      label: "Tiêu đề 1",
      onClick: () => {
        if (!editor) return;
        getFocusedEditor(editor).toggleHeading({ level: 1 }).run();
      },
    },
    {
      label: "Tiêu đề 2",
      onClick: () => {
        if (!editor) return;
        getFocusedEditor(editor).toggleHeading({ level: 2 }).run();
      },
    },
    {
      label: "Tiêu đề 3",
      onClick: () => {
        if (!editor) return;
        getFocusedEditor(editor).toggleHeading({ level: 3 }).run();
      },
    },
  ];

  const getLabel = (): string => {
    if (!editor) return "Đoạn văn";
    
    if (editor.isActive("heading", { level: 1 })) return "Tiêu đề 1";
    if (editor.isActive("heading", { level: 2 })) return "Tiêu đề 2";
    if (editor.isActive("heading", { level: 3 })) return "Tiêu đề 3";

    return "Đoạn văn";
  };

  const handleLinkSubmit = ({ url, openInNewTab }: linkOption) => {
    if (!editor) return;
    
    const { commands } = editor;
    commands.setLink(getEditorLinkAttributes(url, openInNewTab));
  };

  const handleEmbedYoutube = (url: string) => {
    if (!editor) return;
    
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const handleEmbedFacebookReels = (url: string) => {
    if (!editor) return;

    let normalizedUrl = url.trim();

    if (!normalizedUrl.includes("facebook.com")) {
      alert("Vui lòng nhập URL Facebook Reels hợp lệ");
      return;
    }

    const encodedUrl = encodeURIComponent(normalizedUrl);
    const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=500&height=281`;

    editor.chain().focus().setFacebookReel({ src: embedUrl }).run();
  };

  const handleEmbedImage = (url: string, altText?: string, caption?: string) => {
    if (!editor) return;
    
    (editor.chain().focus() as any).setImage({ src: url, alt: altText || "", caption: caption || "" }).run();
  };

  const handleInsertTable = (rows: number, cols: number, withHeaderRow: boolean) => {
    if (!editor) return;
    
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow })
      .run();
  };

  const handleInsertAdBanner = (options: { src: string; href: string; alt?: string }) => {
    if (!editor) return;
    editor.chain().focus().setAdBanner(options).run();
  };

  const handleInsertComponent = (name: string, props?: Record<string, string>) => {
    if (!editor) return;
    editor.chain().focus().setEmbedComponent({ name, props: props ? JSON.stringify(props) : "{}" }).run();
  };

  const Head = () => {
    return (
      <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
        <span className="text-sm">{getLabel()}</span>
        <AiFillCaretDown size={12} />
      </div>
    );
  };

  // Early return after all hooks
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 p-3 bg-white dark:bg-gray-800 border-b border-[#105d97]/20 dark:border-gray-700 min-h-[60px]">
      {/* Text Formatting Group */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <DropdownOptions options={options} head={<Head />} />
        
        <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <Button
          active={editor.isActive("bold")}
          onClick={() => getFocusedEditor(editor).toggleBold().run()}
        >
          <BsTypeBold />
        </Button>

        <Button
          active={editor.isActive("italic")}
          onClick={() => getFocusedEditor(editor).toggleItalic().run()}
        >
          <BsTypeItalic />
        </Button>

        <Button
          active={editor.isActive("underline")}
          onClick={() => getFocusedEditor(editor).toggleUnderline().run()}
        >
          <BsTypeUnderline />
        </Button>

        <Button
          active={editor.isActive("strike")}
          onClick={() => getFocusedEditor(editor).toggleStrike().run()}
        >
          <BsTypeStrikethrough />
        </Button>

        {/* Color Picker */}
        <div className="flex items-center gap-1 ml-1">
          <input
            type="color"
            value={textColor}
            onChange={handleTextColorChange}
            title="Chọn màu chữ"
            className="w-6 h-6 p-0 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Alignment Group */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <Button
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <MdFormatAlignLeft />
        </Button>

        <Button
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <MdFormatAlignCenter />
        </Button>

        <Button
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <MdFormatAlignRight />
        </Button>
      </div>

      {/* Content Formatting Group */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <Button
          active={editor.isActive("blockquote")}
          onClick={() => getFocusedEditor(editor).toggleBlockquote().run()}
        >
          <RiDoubleQuotesL />
        </Button>

        <Button
          active={editor.isActive("code")}
          onClick={() => getFocusedEditor(editor).toggleCode().run()}
        >
          <BsCode />
        </Button>

        <Button
          active={editor.isActive("codeBlock")}
          onClick={() => getFocusedEditor(editor).toggleCodeBlock().run()}
        >
          <BsBraces />
        </Button>

        <InsertLink onSubmit={handleLinkSubmit} onToggle={onDropdownToggle} />
        <FindReplace editor={editor} onToggle={onDropdownToggle} />

        <Button
          active={editor.isActive("orderedList")}
          onClick={() => getFocusedEditor(editor).toggleOrderedList().run()}
        >
          <BsListOl />
        </Button>

        <Button
          active={editor.isActive("bulletList")}
          onClick={() => getFocusedEditor(editor).toggleBulletList().run()}
        >
          <BsListUl />
        </Button>
      </div>

      {/* Media & Tools Group */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <EmbedYoutube onSubmit={handleEmbedYoutube} onToggle={onDropdownToggle} />
        <EmbedFacebookReels onSubmit={handleEmbedFacebookReels} onToggle={onDropdownToggle} />
        <EmbedImage onSubmit={handleEmbedImage} onToggle={onDropdownToggle} />
        <InsertAdBanner onSubmit={handleInsertAdBanner} onToggle={onDropdownToggle} />
        <InsertComponent onSubmit={handleInsertComponent} onToggle={onDropdownToggle} />

        <Button onClick={onOpenImageClick}>
          <BsImageFill title="Chèn một ảnh" />
        </Button>

        {onOpenGalleryClick && (
          <Button onClick={onOpenGalleryClick}>
            <BsImages title="Chèn Gallery ảnh" />
          </Button>
        )}
      </div>

      {/* Table Tools Group */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Insert table với form chọn số hàng/cột */}
        <InsertTable onSubmit={handleInsertTable} onToggle={onDropdownToggle} />

        {/* Thêm hàng */}
        <Button
          onClick={() => editor.chain().focus().addRowAfter().run()}
        >
          <MdTableRows title="Thêm hàng bên dưới" />
        </Button>

        {/* Xóa hàng */}
        <Button
          onClick={() => editor.chain().focus().deleteRow().run()}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <title>Xóa hàng hiện tại</title>
            <rect x="1" y="2" width="14" height="12" rx="1"/>
            <line x1="1" y1="6" x2="15" y2="6"/>
            <line x1="1" y1="10" x2="15" y2="10"/>
            <line x1="5" y1="7.2" x2="11" y2="8.8"/>
            <line x1="11" y1="7.2" x2="5" y2="8.8"/>
          </svg>
        </Button>

        {/* Thêm cột */}
        <Button
          onClick={() => editor.chain().focus().addColumnAfter().run()}
        >
          <MdTableView title="Thêm cột bên phải" />
        </Button>

        {/* Xóa cột */}
        <Button
          onClick={() => editor.chain().focus().deleteColumn().run()}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <title>Xóa cột hiện tại</title>
            <rect x="1" y="2" width="14" height="12" rx="1"/>
            <line x1="6" y1="2" x2="6" y2="14"/>
            <line x1="10" y1="2" x2="10" y2="14"/>
            <line x1="7.2" y1="5" x2="8.8" y2="11"/>
            <line x1="8.8" y1="5" x2="7.2" y2="11"/>
          </svg>
        </Button>

        {/* Xóa bảng */}
        <Button
          onClick={() => editor.chain().focus().deleteTable().run()}
        >
          <MdDeleteOutline title="Xóa bảng" />
        </Button>
      </div>
    </div>
  );
};

export default ToolBar;
