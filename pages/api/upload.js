import multiparty from "multiparty";
import { mongooseConnect } from "../../lib/mongoose";
import { uploadLibraryImage } from "../../lib/cloudinary-upload";

export default async function handle(req, res) {
  await mongooseConnect();

  const form = new multiparty.Form({
    maxFilesSize: 100 * 1024 * 1024, // 🔥 100MB total
  });

  try {
    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    if (!files?.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadPromises = files.file.map((file) =>
      uploadLibraryImage(file.path).then(({ result }) => result)
    );

    const results = await Promise.all(uploadPromises);

    const links = results.map((r) => r.secure_url);

    return res.json({ links });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
