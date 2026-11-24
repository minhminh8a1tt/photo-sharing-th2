const express = require("express");
const User = require("../db/userModel");
const mongoose = require("mongoose");
const router = express.Router();
const Photo = require("../db/photoModel");

router.post("/", async (request, response) => {});

router.get("/list", async (request, response) => {
  try {
    const users = await User.find({}).select("_id first_name last_name");
    response.status(200).json(users);
  } catch (error) {
    console.log("Error fetching user lisr", error);
    response.status(500).json({ message: "Ko lay dc danh sach users" });
  }
});

router.get("/stats", async (request, response) => {
  try {
    const users = await User.find({}).select("_id");
    const photos = await Photo.find({}).select("user_id comments.user_id");
    const result = [];
    for (const user of users) {
      let photoCount = 0;
      let commentCount = 0;
      for (const photo of photos) {
        if (String(photo.user_id) === String(user._id)) {
          photoCount++;
        }
        for (const comment of photo.comments ?? []) {
          if (String(comment.user_id) === String(user._id)) {
            commentCount++;
          }
        }
      }
      result.push({
        _id: user._id,
        photo_count: photoCount,
        comment_count: commentCount,
      });
    }
    return response.status(200).json(result);
  } catch (err) {
    console.log("Error", err);
    return response.status(500).json({
      message: "Khong the lay so luong anh va binh luan",
    });
  }
});

router.get("/:id/comments", async (request, response) => {
  const userId = request.params.id;

  if (!mongoose.isObjectIdOrHexString(userId)) {
    return response.status(400).json({
      message: "ID người dùng không hợp lệ",
    });
  }

  try {
    const user = await User.findById(userId).select("_id");

    if (!user) {
      return response.status(400).json({
        message: "Không tìm thấy người dùng",
      });
    }

    const photos = await Photo.find({
      "comments.user_id": userId,
    }).select("_id user_id file_name comments");

    const result = [];

    for (const photo of photos) {
      for (const comment of photo.comments ?? []) {
        if (String(comment.user_id) === String(userId)) {
          result.push({
            _id: comment._id,
            comment: comment.comment,
            date_time: comment.date_time,
            photo_id: photo._id,
            photo_user_id: photo.user_id,
            file_name: photo.file_name,
          });
        }
      }
    }

    return response.status(200).json(result);
  } catch (error) {
    console.error("Error fetching user comments:", error);

    return response.status(500).json({
      message: "Không thể lấy bình luận của người dùng",
    });
  }
});

router.get("/:id", async (request, response) => {
  const userId = request.params.id;
  if (!mongoose.isObjectIdOrHexString(userId)) {
    return response.status(400).json({
      message: "ID người dùng không hợp lệ",
    });
  }
  try {
    const user = await User.findById(userId).select(
      "_id first_name last_name location description occupation",
    );
    if (!user) {
      return response.status(400).json({ message: "ko tim thay user" });
    } else {
      return response.status(200).json(user);
    }
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Ko the lay thong tin nguoi dung" });
  }
});

module.exports = router;
