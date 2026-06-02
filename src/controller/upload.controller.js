import httpStatus from "http-status";
import cloudinary from "../config/cloudinary.js";
import { User } from "../model/user.js";

const updateProfile = async (req, res) => {
  try {
    let imageUrl = {};

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      );

      imageUrl = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        image: imageUrl,
      },
      {
        returnDocument: "after",
      },
    );

    res
      .status(httpStatus.OK)
      .json({ message: "image upload successfully." }, user);
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

export { updateProfile };
