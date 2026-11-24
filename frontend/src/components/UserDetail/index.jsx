import React from "react";
import { Typography } from "@mui/material";

import "./styles.css";
import { useParams, Link } from "react-router-dom";
// import models from "../../modelData/models";
import { useState, useEffect } from "react";
import fetchModel from "../../lib/fetchModelData";
/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const user = useParams();
  const userId = user.userId;
  // const userReal = models.userModel(userId);
  const [userReal, setUserReal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      setError("");
      setUserReal(null);
      try {
        const data = await fetchModel(`/user/${userId}`);
        setUserReal(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [userId]);
  if (loading) {
    return <h3>Loading...</h3>;
  }
  if (error) {
    return <h3>{error}</h3>;
  }
  if (!userReal) {
    return (
      <>
        <h3>Không tìm thấy người dùng</h3>
      </>
    );
  } else
    return (
      <div className="user-detail">
        {/* <Typography variant="body1">
        This should be the UserDetail view of the PhotoShare app. Since it is
        invoked from React Router the params from the route will be in property
        match. So this should show details of user: {user.userId}. You can fetch
        the model for the user from models.userModel.
      </Typography> */}
        <h2>
          {userReal.first_name} {userReal.last_name}
        </h2>
        <h4>
          <b>Địa điểm: </b>
          {userReal.location}
        </h4>
        <h4>
          <b>Nghề nghiệp: </b>
          {userReal.occupation}
        </h4>
        <h4>
          <b>Giới thiệu: </b>
          {userReal.description}
        </h4>
        <Link to={`/photos/${userReal._id}`}>
          View photos: {userReal.first_name}
        </Link>
      </div>
    );
}

export default UserDetail;
