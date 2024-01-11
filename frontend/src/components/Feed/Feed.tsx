import "./Feed.css";
import Post, { IPostProp } from "../Post/Post";
import { postsData } from "../Post/PostsData";
import Modal from "../utils/Modal/Modal";
import { useState } from "react";

function Feed() {
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [showPostOwnerContactDetails, setShowPostOwnerContactDetails] =
    useState(false);
  const [post, setPost] = useState<IPostProp>({
    id: 0,
    ownerId: 0,
    ownerUsername: "",
    img: "",
    description: "",
    isLikedByUser: false,
    numOfLikes: 0,
    numOfComments: 0,
    breed: "",
    createdAt: "",
    ownerFirstName: "",
    ownerPhoneNumber: "",
  });

  const getAllPosts = () => {
    // TODO: write getAllPosts functionality
    return postsData;
  };

  return (
    <div className="Feed">
      {getAllPosts().map((post, i) => {
        return (
          <Post
            key={i}
            post={post}
            setPost={setPost}
            setShowPostDetails={setShowPostDetails}
            setShowPostOwnerContactDetails={setShowPostOwnerContactDetails}
          />
        );
      })}
      {showPostDetails && (
        <Modal
          setIsOpen={setShowPostDetails}
          component={
            <Post
              post={post}
              setPost={setPost}
              setShowPostDetails={setShowPostDetails}
              setShowPostOwnerContactDetails={setShowPostOwnerContactDetails}
              isShowingDetails={true}
            />
          }
        />
      )}
      {showPostOwnerContactDetails && (
        <Modal
          setIsOpen={setShowPostOwnerContactDetails}
          component={
            <div className="post-owner-contact-details">
              <p>Contact name: {post.ownerFirstName}</p>
              <p>Phone number: {post.ownerPhoneNumber}</p>
            </div>
          }
        />
      )}
    </div>
  );
}

export default Feed;
