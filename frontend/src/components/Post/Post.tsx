import { FaHeart, FaPaperPlane, FaRegHeart } from "react-icons/fa";
import "./Post.css";
import { useEffect, useState } from "react";

export interface IPostProp {
  id: number;
  ownerId: number;
  ownerUsername: string;
  img: string;
  description: string;
  isLikedByUser: boolean;
  numOfLikes: number;
  numOfComments: number;
  breed: string;
  createdAt: string;
}

interface IPostComment {
  comment: string;
  ownerUsername: string;
  createdAt: string;
}

interface IProps {
  post: IPostProp;
  setPost: React.Dispatch<React.SetStateAction<IPostProp>>;
  setShowPostDetails: React.Dispatch<React.SetStateAction<boolean>>;
  isShowingDetails?: boolean;
}

function Post({
  post,
  setPost,
  setShowPostDetails,
  isShowingDetails = false,
}: IProps) {
  const {
    id,
    ownerId,
    ownerUsername,
    img,
    description,
    isLikedByUser,
    numOfLikes,
    numOfComments,
    breed,
    createdAt,
  } = post;

  const [isLiked, setIsLiked] = useState(isLikedByUser);
  const [postNumOfLikes, setPostNumOfLikes] = useState(numOfLikes);
  const [postNumOfComments, setPostNumOfComments] = useState(numOfComments);
  const [comments, setComments] = useState<IPostComment[]>([]);
  const [newComment, setNewComment] = useState("");

  const getPostedOn = (postedDate: string) => {
    const today = new Date().getTime();
    const dateOfPost = Date.parse(postedDate);
    const diffDays = Math.floor((today - dateOfPost) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      const diffHours = Math.floor((today - dateOfPost) / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor((today - dateOfPost) / (1000 * 60));
        return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
      } else {
        return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
      }
    } else {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    }
  };

  const likePost = () => {
    // TODO: write likePost functionality

    setPostNumOfLikes(postNumOfLikes + 1);
    setIsLiked(true);
  };

  const unLikePost = () => {
    // TODO: write unLikePost functionality

    // Updating the amount to likes
    setPostNumOfLikes(postNumOfLikes - 1);
    setIsLiked(false);
  };

  const commentOnPost = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: write commentOnPost functionality

    setPostNumOfComments(postNumOfComments + 1);

    if (isShowingDetails) {
      setComments([
        {
          comment: newComment,
          ownerUsername: "snirAshwal",
          createdAt: new Date().toISOString(),
        },
        ...comments,
      ]);
    }

    // Reset form
    setNewComment("");
  };

  const showAllComments = () => {
    // TODO: write showAllComments functionality

    setShowPostDetails(true);
    setPost(post);
  };

  const getPostComments = (postId: number): void => {
    // TODO: write getPostComments functionality
    console.log("Getting post comments for post id: " + postId);

    setComments([
      {
        comment: "Wow, what a beautiful dog!",
        ownerUsername: "snirAshwal",
        createdAt: "2022-10-11T12:00:00Z",
      },
      {
        comment: "Wow, what a beautiful dog!",
        ownerUsername: "snirAshwal",
        createdAt: "2022-10-11T12:00:00Z",
      },
      {
        comment: "Wow, what a beautiful dog!",
        ownerUsername: "snirAshwal",
        createdAt: "2022-10-11T12:00:00Z",
      },
      {
        comment: "Wow, what a beautiful dog!",
        ownerUsername: "snirAshwal",
        createdAt: "2022-10-11T12:00:00Z",
      },
      {
        comment: "Wow, what a beautiful dog!",
        ownerUsername: "snirAshwal",
        createdAt: "2022-10-11T12:00:00Z",
      },
    ]);
  };

  useEffect(() => {
    if (isShowingDetails) {
      getPostComments(id);
    }
  }, []);

  return (
    <div
      id={"post-" + id}
      className="Post"
      data-id={id}
      data-owner-id={ownerId}
    >
      <div className="post-img-container">
        <img
          className="post-img"
          src={img}
          alt="post-img"
          onDoubleClick={() => {
            if (!isLiked) likePost();
            // TODO: show heart on image when liking
          }}
        />
        <span className="post-created-at">{getPostedOn(createdAt)}</span>
      </div>
      <div className="post-details">
        <div className="post-likes-and-breed-container">
          <div className="post-like-container">
            {isLiked ? (
              <FaHeart
                size={20}
                color={"var(--color-red)"}
                onClick={unLikePost}
              />
            ) : (
              <FaRegHeart
                size={20}
                color={"var(--color-red)"}
                onClick={likePost}
              />
            )}
            {numOfLikes > 0 && (
              <span className="post-likes">{postNumOfLikes} likes</span>
            )}
          </div>
          <span className="post-breed">{breed}</span>
        </div>
        <span className="post-username">{ownerUsername}</span>
        <span className="post-description">
          {description.length > 90
            ? description.substring(0, 90) + "..."
            : description}
        </span>
        {isShowingDetails ? (
          <div className="post-all-comments">
            {comments.map((commentObject, i) => {
              const { comment, ownerUsername, createdAt } = commentObject;
              return (
                <div key={i} className="post-comment">
                  <span className="post-comment-username">{ownerUsername}</span>
                  <span className="post-comment-comment">{comment}</span>
                  <div className="post-comment-created-at">
                    {getPostedOn(createdAt)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          numOfComments > 0 && (
            <span
              id={"post-" + id + "-num-of-comments"}
              className="post-show-comments"
              onClick={showAllComments}
            >
              Show all {postNumOfComments} comments
            </span>
          )
        )}
        <form
          className="post-comment-container"
          onSubmit={(e) => commentOnPost(e)}
        >
          <input
            className="post-comment-input"
            placeholder="Write something..."
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          ></input>
          <button className="post-comment-btn" type="submit">
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Post;
