import "./Feed.css";
import Post, { IPostProp } from "../Post/Post";
import { postsData } from "../Post/PostsData";
import Modal from "../utils/Modal/Modal";
import { useState } from "react";

function Feed() {
  const [showPostDetails, setShowPostDetails] = useState(false);
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
              isShowingDetails={true}
            />
          }
        />
      )}
    </div>
  );
}

export default Feed;
