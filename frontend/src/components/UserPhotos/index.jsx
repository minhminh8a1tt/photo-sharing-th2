import React from "react";
import { Divider, Typography } from "@mui/material";

import "./styles.css";
import { useParams, Link, useLocation } from "react-router-dom";
// import models from "../../modelData/models";
// import malcolm1 from "../../images/malcolm1.jpg";
// import malcolm2 from "../../images/malcolm2.jpg";
// import ripley1 from "../../images/ripley1.jpg";
// import ripley2 from "../../images/ripley2.jpg";
// import took1 from "../../images/took1.jpg";
// import took2 from "../../images/took2.jpg";
// import kenobi1 from "../../images/kenobi1.jpg";
// import kenobi2 from "../../images/kenobi2.jpg";
// import kenobi3 from "../../images/kenobi3.jpg";
// import kenobi4 from "../../images/kenobi4.jpg";
// import ludgate1 from "../../images/ludgate1.jpg";
// import ouster from "../../images/ouster.jpg";

import { useState, useEffect } from "react";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos() {
  const user = useParams();
  const userId = user.userId;
  // const photos = models.photoOfUserModel(userId);

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { hash } = useLocation();

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      setError("");
      setPhotos([]);
      try {
        const data = await fetchModel(`/photosOfUser/${userId}`);
        setPhotos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadPhotos();
  }, [userId]);

  // const formatDateTime = (s) => {
  //   const [date, time] = s.split(" ");
  //   const [year, month, day] = date.split("-");
  //   return `${day}/${month}/${year} ${time}`;
  // };
  const formatDateTime = (s) => {
    return new Date(s).toLocaleString("vi-VN");
  };
  // const imageMap = {
  //   "malcolm1.jpg": malcolm1,
  //   "malcolm2.jpg": malcolm2,
  //   "ripley1.jpg": ripley1,
  //   "ripley2.jpg": ripley2,
  //   "took1.jpg": took1,
  //   "took2.jpg": took2,
  //   "kenobi1.jpg": kenobi1,
  //   "kenobi2.jpg": kenobi2,
  //   "kenobi3.jpg": kenobi3,
  //   "kenobi4.jpg": kenobi4,
  //   "ludgate1.jpg": ludgate1,
  //   "ouster.jpg": ouster,
  // };

  useEffect(() => {
    if (loading || !hash) {
      return;
    }

    const photoElement = document.getElementById(hash.slice(1));

    if (photoElement) {
      photoElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [loading, photos, hash]);

  if (loading) {
    return <h3>Loading...</h3>;
  }
  if (error) {
    return <h3>{error}</h3>;
  }
  return (
    // <Typography variant="body1">
    //   This should be the UserPhotos view of the PhotoShare app. Since it is
    //   invoked from React Router the params from the route will be in property
    //   match. So this should show details of user:
    //   {user.userId}. You can fetch the model for the user from
    //   models.photoOfUserModel(userId):
    // </Typography>
    <div className="user-photos">
      <h2>View photos:</h2>
      {photos.length === 0 && <h2>Không có ảnh để hiển thị</h2>}
      {photos.map((item) => {
        return (
          <div key={item._id} id={`photo-${item._id}`} className="photo-card">
            <img
              src={`http://localhost:8081/images/${item.file_name}`}
              alt={item.file_name}
            />
            <div>
              <b>Ngày đăng:</b> {formatDateTime(item.date_time)}
            </div>
            <div>
              <b>Bình luận:</b>
            </div>
            {(item.comments ?? []).map((comment) => {
              return (
                <div key={comment._id} className="photo-comment">
                  <Link to={`/users/${comment.user._id}`}>
                    {comment.user.first_name} {comment.user.last_name}
                  </Link>
                  <div>{formatDateTime(comment.date_time)}</div>
                  <div>{comment.comment}</div>
                  <Divider />
                </div>
              );
            })}
            {(!item.comments || item.comments.length === 0) && (
              <>
                <h2>No comments</h2>
                <hr />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default UserPhotos;
