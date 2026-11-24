import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function UserComments() {
  const { userId } = useParams();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadComments = async () => {
      setLoading(true);
      setError("");
      setComments([]);

      try {
        const data = await fetchModel(`/user/${userId}/comments`);
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [userId]);

  if (loading) {
    return <h3>Đang tải bình luận...</h3>;
  }

  if (error) {
    return <h3>{error}</h3>;
  }

  return (
    <div className="user-comments">
      <h2>Bình luận của người dùng</h2>

      {comments.length === 0 && <p>Người dùng chưa có bình luận.</p>}

      {comments.map((item) => (
        <Link
          key={item._id}
          className="user-comment-card"
          to={`/photos/${item.photo_user_id}#photo-${item.photo_id}`}
        >
          <img
            src={`http://localhost:8081/images/${item.file_name}`}
            alt={item.file_name}
          />

          <div>
            <p>{item.comment}</p>
            <small>{new Date(item.date_time).toLocaleString("vi-VN")}</small>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default UserComments;
