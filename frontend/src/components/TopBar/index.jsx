import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useMatch } from "react-router-dom";
// import models from "../../modelData/models";
import "./styles.css";
import { useState, useEffect } from "react";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {
  const detailMatch = useMatch("/users/:userId");
  const photosMatch = useMatch("/photos/:userId");
  const userId = detailMatch?.params.userId ?? photosMatch?.params.userId;
  let context = "Danh sách người dùng";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      setError("");
      setUser(null);
      try {
        const data = await fetchModel(`/user/${userId}`);
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [userId]);

  if (detailMatch) {
    if (loading) {
      context = "Loading...";
    } else if (error) {
      context = error;
    } else if (user) {
      context = `${user.first_name} ${user.last_name}`;
    } else {
      context = "Không tìm thấy người dùng";
    }
  } else if (photosMatch) {
    if (loading) {
      context = "Loading...";
    } else if (error) {
      context = error;
    } else if (user) {
      context = `Photos of ${user.first_name} ${user.last_name}`;
    } else {
      context = "Không tìm thấy người dùng";
    }
  }
  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit">
          Hoàng Anh Minh-B23DCAT192
        </Typography>
        <Typography variant="h5" color="inherit" sx={{ marginLeft: "auto" }}>
          {context}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
