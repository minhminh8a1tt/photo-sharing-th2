import React from "react";
import { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import "./styles.css";
// import models from "../../modelData/models";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  // const users = models.userListModel();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState([]);
  useEffect(() => {
    const loadUser = async () => {
      try {
        const usersData = await fetchModel("/user/list");
        const statsData = await fetchModel("/user/stats");

        setUsers(usersData);
        setStats(statsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);
  return (
    <div className="user-list">
      <Typography variant="body1">
        <b>User List:</b>
      </Typography>
      {loading ? (
        <h3>Loading....</h3>
      ) : error ? (
        <h3>{error}</h3>
      ) : (
        <List component="nav">
          {users.map((item) => {
            const userStats = stats.find((stat) => stat._id === item._id);
            return (
              <li key={item._id}>
                <div className="user-row">
                  <Link to={`/users/${item._id}`} className="user-name">
                    <ListItemText
                      primary={`${item.first_name} ${item.last_name}`}
                    />
                  </Link>

                  <span
                    className="count-bubble photo-count"
                    title="Số ảnh đã đăng"
                  >
                    {userStats?.photo_count ?? 0}
                  </span>

                  <Link
                    to={`/comments/${item._id}`}
                    className="count-bubble comment-count"
                    title="Xem bình luận của người dùng"
                    aria-label={`Xem bình luận của ${item.first_name}`}
                  >
                    {userStats?.comment_count ?? 0}
                  </Link>
                </div>

                <Divider />
              </li>
            );
          })}
        </List>
      )}
      {/* <Typography variant="body1">
        The model comes in from models.userListModel()
      </Typography> */}
    </div>
  );
}

export default UserList;
