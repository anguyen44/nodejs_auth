const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.log("error while uploading to cloudinary", error);
    throw new Error("error while uploading to cloudinary");
  }
};

const deleleImageFromCloudinary = async (id) => {
  try {
    await cloudinary.uploader.destroy(id);
  } catch (error) {
    console.log("error while deleting from cloudinary", error);
    throw new Error(
      "error while deleting from cloudinary with public file id ",
      id
    );
  }
};

module.exports = {
  uploadToCloudinary,
  deleleImageFromCloudinary,
};
