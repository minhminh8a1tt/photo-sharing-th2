const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();
const User = require("../db/userModel");
const mongoose = require("mongoose");
router.post("/", async (request, response) => {});

router.get("/:id", async (request, response) => {
  const userId = request.params.id;
  if (!mongoose.isObjectIdOrHexString(userId)) {
    return response.status(400).json({
      message: "ID người dùng không hợp lệ",
    });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return response.status(400).json({ message: "Ko tim thay user" });
    } else {
      const photos = await Photo.find({ user_id: userId }).select(
        "_id user_id file_name date_time comments._id comments.comment comments.date_time comments.user_id",
      );
      const result = await Promise.all(
        photos.map(async (photo) => {
          const comments = await Promise.all(
            (photo.comments ?? []).map(async (comment) => {
              const author = await User.findById(comment.user_id).select(
                "_id first_name last_name",
              );
              return {
                _id: comment._id,
                comment: comment.comment,
                date_time: comment.date_time,
                user: author,
              };
            }),
          );
          return {
            _id: photo._id,
            user_id: photo.user_id,
            file_name: photo.file_name,
            date_time: photo.date_time,
            comments: comments,
          };
        }),
      );
      return response.status(200).json(result);
    }
  } catch (error) {
    console.log("Error fetching user photos:", error);
    return response.status(500).json({ message: "Ko the lay anh cua user" });
  }
});

module.exports = router;
