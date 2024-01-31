import {
  FaHeart,
  FaInfoCircle,
  FaPaperPlane,
  FaPaw,
  FaPhone,
  FaRegHeart,
  FaTrash,
} from "react-icons/fa";
import "./Post.css";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdModeEditOutline } from "react-icons/md";
import Modal from "../utils/Modal/Modal";
import BreedInfo from "../BreedInfo/BreedInfo";
import { getDogBreeds } from "../utils/Api";
import { globals } from "../utils/Globals";
import api from "../utils/AxiosInterceptors";
import toast from "react-hot-toast";
import { getSelectedText } from "../utils/FormUtils";
import PostContactDetails from "../PostContactDetails/PostContactDetails";

export interface IPostProp {
  _id: string;
  ownerId: number;
  ownerUsername: string;
  img: string;
  description: string;
  isLikedByUser: boolean;
  isPostOwner: boolean;
  numOfLikes: number;
  numOfComments: number;
  breed: string;
  breedId: number;
  createdAt: string;
  ownerFirstName: string;
  ownerPhoneNumber: string;
}

interface IPostComment {
  comment: string;
  ownerUsername: string;
  createdAt: string;
}

interface IProps {
  postDetails: IPostProp;
  setParentPost?: React.Dispatch<React.SetStateAction<IPostProp>>;
  setShowParentPostDetails?: React.Dispatch<React.SetStateAction<boolean>>;
  isShowingDetails?: boolean;
  isProfilePage?: boolean;
  onDeleteSuccess?: () => void;
}

function Post({
  postDetails,
  setParentPost,
  isShowingDetails = false,
  isProfilePage = false,
  setShowParentPostDetails,
  onDeleteSuccess,
}: IProps) {
  const [post, setPost] = useState<IPostProp>(postDetails);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [showPostOwnerContactDetails, setShowPostOwnerContactDetails] =
    useState(false);
  const [comments, setComments] = useState<IPostComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [showBreedInfo, setShowBreedInfo] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [breeds, setBreeds] = useState<[{ value: string; text: string }]>([
    { value: "-1", text: "Not Selected" },
  ]);

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

  const likePost = async () => {
    await api
      .put(globals.posts.like, { postId: post._id })
      .then(() => {
        setPost({
          ...post,
          numOfLikes: post.numOfLikes + 1,
          isLikedByUser: true,
        });
        if (setParentPost)
          setParentPost({
            ...post,
            numOfLikes: post.numOfLikes + 1,
            isLikedByUser: true,
          });
      })
      .catch((error) => {
        console.log("Failed to like post: ", error);
      });
  };

  const dislikePost = async () => {
    await api
      .put(globals.posts.dislike, { postId: post._id })
      .then(() => {
        setPost({
          ...post,
          numOfLikes: post.numOfLikes - 1,
          isLikedByUser: false,
        });
        if (setParentPost)
          setParentPost({
            ...post,
            numOfLikes: post.numOfLikes - 1,
            isLikedByUser: false,
          });
      })
      .catch((error) => {
        console.log("Failed to dislike post: ", error);
      });
  };

  const commentOnPost = async (e: React.FormEvent) => {
    e.preventDefault();

    await api
      .post(globals.posts.createComment, { postId: post._id, text: newComment })
      .then((res) => {
        setPost({ ...post, numOfComments: post.numOfComments + 1 });
        if (setParentPost)
          setParentPost({ ...post, numOfComments: post.numOfComments + 1 });

        if (isShowingDetails) {
          const newComment = res.data.newComment;
          const ownerUsername = res.data.ownerUsername;
          setComments([
            {
              comment: newComment.text,
              ownerUsername: ownerUsername,
              createdAt: newComment.createdAt,
            },
            ...comments,
          ]);
        }

        // Reset form
        setNewComment("");
      })
      .catch((error) => {
        console.log("Failed to comment on post: ", error);
        toast.error(error.response.data);
      });
  };

  const showAllComments = () => {
    setShowPostDetails(true);
    setPost(post);
  };

  const editPost = async () => {
    const breedName = getSelectedText(
      "post-" + post._id + "-edit-breed-select"
    );

    await api
      .put(globals.posts.edit, {
        postId: post._id,
        description: post.description,
        breedId: post.breedId,
        breed: breedName,
      })
      .then(() => {
        // Update UI
        setIsEditMode(false);
        setPost({
          ...post,
          description: post.description,
          breed: breedName,
          breedId: post.breedId,
        });
        if (setParentPost)
          setParentPost({
            ...post,
            description: post.description,
            breed: breedName,
            breedId: post.breedId,
          });
      })
      .catch((error) => {
        console.log("Failed to edit post: ", error);
        toast.error(error.response.data);
      });
  };

  const deletePost = async () => {
    await api
      .delete(globals.posts.delete + "/" + post._id)
      .then(() => {
        // Delete from UI
        const postElement = document.getElementById("post-" + post._id);
        if (postElement) postElement.remove();
        setShowDeletePostModal(false);
        if (setShowParentPostDetails) setShowParentPostDetails(false);
        else setShowPostDetails(false);
        if (onDeleteSuccess) onDeleteSuccess();
      })
      .catch((error) => {
        console.log("Failed to delete post: ", error);
        toast.error(error.response.data);
      });
  };

  const getPostComments = async (postId: string) => {
    await api
      .get(globals.posts.comments + "/" + postId)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.log("Failed to get post comments", error);
      });
  };

  const showHeartOnPost = (element: HTMLElement) => {
    const heart = document.createElement("div");

    heart.innerHTML = "&hearts;";
    heart.className = "heart-on-post";
    heart.style.opacity = "1";
    element.parentElement?.appendChild(heart);

    setTimeout(() => {
      heart.style.opacity = "0";
    }, 200);

    setTimeout(() => {
      heart.remove();
    }, 300);
  };

  useEffect(() => {
    if (isShowingDetails) {
      getPostComments(post._id);
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {isProfilePage ? (
        <div className="profile-feed-post-img-size-warper">
          <div className="profile-feed-post-img-warper">
            <img
              src={globals.files + post.img}
              alt="post-image"
              className="profile-feed-post-img"
              onClick={showAllComments}
            />
          </div>
        </div>
      ) : (
        <div
          id={"post-" + post._id}
          className="Post"
          data-id={post._id}
          data-owner-id={post.ownerId}
        >
          <div className="post-img-container">
            <img
              className="post-img"
              src={globals.files + post.img}
              alt="post-img"
              onDoubleClick={(e) => {
                if (!post.isLikedByUser) {
                  likePost().then(() => {
                    showHeartOnPost(e.target as HTMLElement);
                  });
                }
              }}
            />
            <span className="post-created-at">
              {getPostedOn(post.createdAt)}
            </span>
            {post.isPostOwner && (
              <div className="post-operations">
                <span className="post-options">
                  <BsThreeDotsVertical />
                </span>
                <span
                  className="post-edit"
                  onClick={() => {
                    setIsEditMode(true);
                    getDogBreeds().then((breeds) => {
                      setBreeds(breeds);
                    });
                  }}
                >
                  <MdModeEditOutline />
                </span>
                <span
                  className="post-delete"
                  onClick={() => setShowDeletePostModal(true)}
                >
                  <FaTrash />
                </span>
              </div>
            )}
          </div>
          <div className="post-details">
            <div className="post-likes-and-breed-container">
              <div className="post-like-container">
                {post.isLikedByUser ? (
                  <FaHeart
                    size={20}
                    color={"var(--color-red)"}
                    onClick={dislikePost}
                  />
                ) : (
                  <FaRegHeart
                    size={20}
                    color={"var(--color-red)"}
                    onClick={likePost}
                  />
                )}
                {post.numOfLikes > 0 && (
                  <span className="post-likes">{post.numOfLikes} likes</span>
                )}
              </div>
              <div
                className={`post-breed-and-contact-container ${
                  isEditMode && "post-breed-and-contact-container-edit"
                }`}
              >
                <span
                  className="post-breed-info"
                  onClick={() => {
                    setShowBreedInfo(true);
                  }}
                  title="Breed info"
                >
                  <FaInfoCircle size={18} />
                </span>
                <span
                  className="post-contact"
                  onClick={() => {
                    setPost(post);
                    setShowPostOwnerContactDetails(true);
                  }}
                  title="Contact owner"
                >
                  <FaPhone />
                </span>
                {isEditMode ? (
                  <span className="post-breed-edit-select">
                    <div
                      className="form-select"
                      style={{ width: "180px", marginTop: "0" }}
                    >
                      <select
                        id={"post-" + post._id + "-edit-breed-select"}
                        value={post.breedId}
                        onChange={(e) =>
                          setPost({
                            ...post,
                            breedId: parseInt(e.target.value),
                          })
                        }
                        required={true}
                      >
                        {breeds.map((breed, i) => {
                          return (
                            <option key={i} value={breed.value}>
                              {breed.text}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </span>
                ) : windowWidth > 600 ? (
                  <span className="post-breed">{post.breed}</span>
                ) : (
                  <FaPaw size={18} title={post.breed} />
                )}
              </div>
            </div>
            <span className="post-username">{post.ownerUsername}</span>
            <span
              className={`post-description ${
                isEditMode && "post-description-edit"
              }`}
            >
              {isEditMode ? (
                <>
                  <div className="form-input">
                    <input
                      type={"text"}
                      placeholder={"* Description"}
                      name={"description"}
                      required={true}
                      value={post.description}
                      onChange={(e) =>
                        setPost({ ...post, description: e.target.value })
                      }
                      style={{ width: "100%" }}
                    />
                  </div>
                  <button className="btn post-save-btn" onClick={editPost}>
                    Save
                  </button>
                </>
              ) : post.description.length > 90 ? (
                post.description.substring(0, 90) + "..."
              ) : (
                post.description
              )}
            </span>
            {isShowingDetails ? (
              <div className="post-all-comments">
                {comments.map((commentObject, i) => {
                  const { comment, ownerUsername, createdAt } = commentObject;
                  return (
                    <div key={i} className="post-comment">
                      <span className="post-comment-username">
                        {ownerUsername}
                      </span>
                      <span className="post-comment-comment">{comment}</span>
                      <div className="post-comment-created-at">
                        {getPostedOn(createdAt)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              post.numOfComments > 0 && (
                <span
                  id={"post-" + post._id + "-num-of-comments"}
                  className="post-show-comments"
                  onClick={showAllComments}
                >
                  Show all {post.numOfComments} comments
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
      )}
      {showPostDetails && (
        <Modal
          setIsOpen={
            setShowParentPostDetails
              ? setShowParentPostDetails
              : setShowPostDetails
          }
          component={
            <Post
              postDetails={post}
              setParentPost={setPost}
              setShowParentPostDetails={
                setShowParentPostDetails
                  ? setShowParentPostDetails
                  : setShowPostDetails
              }
              isShowingDetails={true}
              onDeleteSuccess={onDeleteSuccess}
            />
          }
          style={{ width: "80%", maxWidth: "850px" }}
        />
      )}
      {showPostOwnerContactDetails && (
        <Modal
          setIsOpen={setShowPostOwnerContactDetails}
          component={
            <PostContactDetails
              ownerFirstName={post.ownerFirstName}
              ownerPhoneNumber={post.ownerPhoneNumber}
            />
          }
        />
      )}
      {showDeletePostModal && (
        <Modal
          setIsOpen={setShowDeletePostModal}
          component={
            <div className="delete-post-modal">
              <p>Are you sure you want to delete this post?</p>
              <button
                className="btn btn-large delete-post-btn"
                onClick={deletePost}
              >
                Delete
              </button>
            </div>
          }
        />
      )}
      {showBreedInfo && (
        <Modal
          setIsOpen={setShowBreedInfo}
          component={<BreedInfo breedId={post.breedId} />}
        />
      )}
    </>
  );
}

export default Post;
