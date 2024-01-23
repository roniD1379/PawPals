import {
  FaHeart,
  FaInfoCircle,
  FaPaperPlane,
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
import FormSelect from "../utils/FormSelect/FormSelect";
import { getDogBreeds } from "../utils/Api";
import FormInput from "../utils/FormInput/FormInput";
import { globals } from "../utils/Globals";
import api from "../utils/AxiosInterceptors";
import toast from "react-hot-toast";

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
  post: IPostProp;
  setPost: React.Dispatch<React.SetStateAction<IPostProp>>;
  setShowPostDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPostOwnerContactDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setRenderPosts?: React.Dispatch<React.SetStateAction<boolean>>;
  isShowingDetails?: boolean;
}

function Post({
  post,
  setPost,
  setShowPostDetails,
  setShowPostOwnerContactDetails,
  setRenderPosts,
  isShowingDetails = false,
}: IProps) {
  const {
    _id,
    ownerId,
    ownerUsername,
    img,
    description,
    isLikedByUser,
    isPostOwner,
    numOfLikes,
    numOfComments,
    breed,
    breedId,
    createdAt,
  } = post;

  const [isLiked, setIsLiked] = useState(isLikedByUser);
  const [postNumOfLikes, setPostNumOfLikes] = useState(numOfLikes);
  const [postNumOfComments, setPostNumOfComments] = useState(numOfComments);
  const [comments, setComments] = useState<IPostComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [showBreedInfo, setShowBreedInfo] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editBreedId, setEditBreedId] = useState(breedId.toString());
  const [editDescription, setEditDescription] = useState(description);
  const [postDescription, setPostDescription] = useState(description);
  const [postBreed, setPostBreed] = useState(breed);

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
      .put(globals.posts.like, { postId: _id })
      .then(() => {
        setPostNumOfLikes(postNumOfLikes + 1);
        setIsLiked(true);
      })
      .catch((error) => {
        console.log("Failed to like post: ", error);
      });
  };

  const dislikePost = async () => {
    await api
      .put(globals.posts.dislike, { postId: _id })
      .then(() => {
        setPostNumOfLikes(postNumOfLikes - 1);
        setIsLiked(false);
      })
      .catch((error) => {
        console.log("Failed to dislike post: ", error);
      });
  };

  const commentOnPost = async (e: React.FormEvent) => {
    e.preventDefault();

    await api
      .post(globals.posts.createComment, { postId: _id, text: newComment })
      .then((res) => {
        setPostNumOfComments(postNumOfComments + 1);

        if (isShowingDetails) {
          const newComment = res.data.newComment;
          const ownerUsername = res.data.ownerUsername;
          console.log(res.data);

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

  const editPost = () => {
    // TODO: write editPost functionality

    // Update UI
    setIsEditMode(false);
    setPostDescription(editDescription);
    const selectBreedElement = document.getElementById(
      "post-" + _id + "-edit-breed-select"
    );
    setPostBreed(
      (selectBreedElement as HTMLSelectElement)[
        (selectBreedElement as HTMLSelectElement).selectedIndex
      ].innerText
    );
  };

  const deletePost = () => {
    // TODO: write deletePost functionality

    // Delete from UI
    const postElement = document.getElementById("post-" + _id);
    if (postElement) postElement.remove();
    setShowDeletePostModal(false);
    setShowPostDetails(false);
    if (setRenderPosts) setRenderPosts((prevVal) => !prevVal);
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
      getPostComments(_id);
    }
  }, []);

  return (
    <div
      id={"post-" + _id}
      className="Post"
      data-id={_id}
      data-owner-id={ownerId}
    >
      <div className="post-img-container">
        <img
          className="post-img"
          src={globals.files + img}
          alt="post-img"
          onDoubleClick={(e) => {
            if (!isLiked) {
              likePost().then(() => {
                showHeartOnPost(e.target as HTMLElement);
              });
            }
          }}
        />
        <span className="post-created-at">{getPostedOn(createdAt)}</span>
        {isPostOwner && (
          <div className="post-operations">
            <span className="post-options">
              <BsThreeDotsVertical />
            </span>
            <span
              className="post-edit"
              onClick={() => {
                setIsEditMode(true);
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
            {isLiked ? (
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
            {postNumOfLikes > 0 && (
              <span className="post-likes">{postNumOfLikes} likes</span>
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
                <FormSelect
                  selectId={"post-" + _id + "-edit-breed-select"}
                  getElementsFunc={getDogBreeds}
                  optionState={editBreedId}
                  setOptionState={setEditBreedId}
                  width="180px"
                />
              </span>
            ) : (
              <span className="post-breed">{postBreed}</span>
            )}
          </div>
        </div>
        <span className="post-username">{ownerUsername}</span>
        <span
          className={`post-description ${
            isEditMode && "post-description-edit"
          }`}
        >
          {isEditMode ? (
            <>
              <FormInput
                state={editDescription}
                setState={setEditDescription}
                width="100%"
              />
              <button className="btn post-save-btn" onClick={editPost}>
                Save
              </button>
            </>
          ) : postDescription.length > 90 ? (
            postDescription.substring(0, 90) + "..."
          ) : (
            postDescription
          )}
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
          postNumOfComments > 0 && (
            <span
              id={"post-" + _id + "-num-of-comments"}
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
          component={<BreedInfo breedId={breedId} />}
        />
      )}
    </div>
  );
}

export default Post;
