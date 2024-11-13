const Image = require("../models/Image");
const {
  uploadToCloudinary,
  deleleImageFromCloudinary,
} = require("../helpers/cloudinaryHelper");
const fs = require("fs");

const uploadImageController = async (req, res) => {
  try {
    //checking if file is missing in req project
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required. Please upload an image",
      });
    }
    //upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);
    console.log(req.file.path);

    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await newlyUploadedImage.save();

    //delete the file from local storage
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Image uploaded",
      image: newlyUploadedImage,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

const fetchImagesController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const images = await Image.find({}).sort(sortObj).skip(skip).limit(limit);
    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        data: images,
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,

      message: "Something went wrong! Please try again",
    });
  }
};

const deleteImageController = async (req, res) => {
  try {
    const getCurrentIfOfImageToBeDeleted = req.params.id;
    const userId = req.userInfo.userId;

    const image = await Image.findById(getCurrentIfOfImageToBeDeleted);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "image not found",
      });
    }

    //check if this image is uploaded by current user who is trying to delete this image
    if (image.uploadedBy.toString() !== userId) {
      return res.status(401).json({
        success: false,
        message:
          "you are not authorized to delete this image because you haven't upload it",
      });
    }

    //delete this image from cloudinary first
    await deleleImageFromCloudinary(image.publicId);

    await Image.findByIdAndDelete(getCurrentIfOfImageToBeDeleted);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

module.exports = {
  uploadImageController,
  fetchImagesController,
  deleteImageController,
};