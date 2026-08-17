import formidable from "formidable";
import { NextApiHandler } from "next";
import cloudinary from "../../../lib/cloudinary";
import { uploadPostThumbnail } from "../../../lib/cloudinary-upload";
import { readFile } from "../../../lib/utils";
import { postValidationSchema, validateSchema } from "../../../lib/validator";
import Post from "../../../models/Post";
import { IncomingPost } from "../../../utils/types";

export const config = {
  api: { bodyParser: false },
};

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "PATCH":
      return updatePost(req, res);
    case "DELETE":
      return removePost(req, res);
    default:
      return res.status(404).send("Not found!");
  }
};

const removePost: NextApiHandler = async (req, res) => {
  try {
    // Lấy postId từ query (vd: /api/posts/1234567890)
    const postId = req.query.postId as string;
    if (!postId) {
      return res.status(400).json({ error: "Invalid post id" });
    }

    const post = await Post.findByIdAndDelete(postId);
    if (!post) return res.status(404).json({ error: "Post not found!" });

    // Nếu bài viết có thumbnail, xoá ảnh trên Cloudinary
    const publicId = post.thumbnail?.public_id;
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
    res.json({ removed: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const updatePost: NextApiHandler = async (req, res) => {
  try {
    const postId = req.query.postId as string;
    if (!postId) {
      return res.status(400).json({ error: "Invalid post id" });
    }
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found!" });

    const { files, body } = await readFile<IncomingPost>(req);
    const error = validateSchema(postValidationSchema, { ...body });
    if (error) return res.status(400).json({ error });

    const { title, content, meta, slug, category, thumbnailUrl, isFeatured: isFeaturedRaw, isDirectPost: isDirectPostRaw, faqs: faqsRaw, postAuthorId, keywords } = body as any;
    const isFeatured = isFeaturedRaw === "true" || isFeaturedRaw === true;
    const isDirectPost = isDirectPostRaw === "true" || isDirectPostRaw === true;
    let faqs = [];
    try {
      if (faqsRaw) faqs = JSON.parse(faqsRaw as string);
    } catch (e) {
      console.error("Lỗi parse faqs:", e);
    }

    if (isFeatured && !post.isFeatured) {
      const featuredCount = await Post.countDocuments({ isFeatured: true });
      if (featuredCount >= 4) {
        return res.status(400).json({ error: "Chỉ được tối đa 4 bài viết nổi bật. Vui lòng bỏ chọn nổi bật cho bài khác trước!" });
      }
    }

    post.title = title;
    post.content = content;
    post.meta = meta;
    post.slug = slug;
    if (category !== undefined) post.category = category;
    post.isFeatured = isFeatured;
    post.isDirectPost = isDirectPost;
    post.faqs = faqs;
    post.postAuthor = (postAuthorId && postAuthorId !== "undefined" && postAuthorId !== "null" && postAuthorId !== "") ? postAuthorId : null;
    if (keywords !== undefined) post.keywords = keywords;

    // Xử lý thumbnail - có thể là file upload hoặc URL từ thư viện
    const thumbnail = files.thumbnail as formidable.File;
    if (thumbnail) {
      const { secure_url: url, public_id } = await uploadPostThumbnail(
        thumbnail.filepath,
        post._id.toString()
      );
      const oldPublicId = post.thumbnail?.public_id;
      if (oldPublicId && oldPublicId !== public_id) {
        await cloudinary.uploader.destroy(oldPublicId);
      }
      post.thumbnail = { url, public_id };
    } else if (thumbnailUrl) {
      // Sử dụng URL từ thư viện (đã có sẵn trên Cloudinary)
      // Chỉ cập nhật nếu URL khác với URL hiện tại
      if (post.thumbnail?.url !== thumbnailUrl) {
        post.thumbnail = { url: thumbnailUrl, public_id: "" };
      }
    }

    await post.save();
    res.json({ post });
  } catch (error: any) {
    console.error("Lỗi khi updatePost:", error);
    res.status(500).json({ error: error.message });
  }
};

export default handler;
