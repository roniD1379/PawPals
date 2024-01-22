import { useEffect, useState } from "react";
import "./Profile.css";
import { FaUser } from "react-icons/fa";
import Post, { IPostProp } from "../Post/Post";
import Modal from "../utils/Modal/Modal";
import { postsData } from "../Post/PostsData";
import EditProfileModal from "./EditProfileModal/EditProfileModal";
import PostContactDetails from "../PostContactDetails/PostContactDetails";
import { PullToRefresh, PullDownContent } from "react-js-pull-to-refresh";
import PullToRefreshLoader from "../utils/PullToRefreshLoader/PullToRefreshLoader";
import {
  PROFILE_FEED_PAGE_SIZE,
  loaderElement,
  noMoreDataElement,
} from "../utils/InfiniteScroll/InfiniteScrollUtils";
import InfiniteScroll from "react-infinite-scroll-component";
import { globals } from "../utils/Globals";

function Profile() {
  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState("");
  const [numOfPosts, setNumOfPosts] = useState(0);
  const [description, setDescription] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [posts, setPosts] = useState<IPostProp[][]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [renderPosts, setRenderPosts] = useState(false);
  const [showPostOwnerContactDetails, setShowPostOwnerContactDetails] =
    useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [post, setPost] = useState<IPostProp>({
    id: 0,
    ownerId: 0,
    ownerUsername: "",
    img: "",
    description: "",
    isLikedByUser: false,
    isPostOwner: false,
    numOfLikes: 0,
    numOfComments: 0,
    breed: "",
    breedId: 0,
    createdAt: "",
    ownerFirstName: "",
    ownerPhoneNumber: "",
  });
  const [page, setPage] = useState(0);

  const getUserDetails = () => {
    // TODO: write getUserDetails functionality
    setUsername("snirAshwal");
    setUserImage("");
    setNumOfPosts(10);
    setDescription("Welcome to my page!");
    setFirstName("Snir");
    setLastName("Ashwal");
  };

  const chunkArray = (array: IPostProp[], size: number) => {
    const chunks = Math.ceil(array.length / size);
    return Array.from({ length: chunks }, (_, index) => {
      const start = index * size;
      const end = start + size;
      return array.slice(start, end);
    });
  };

  const getPostsForUserProfile = (isRefresh = false): void => {
    // TODO: write getPostsForUserProfile functionality
    const postsPage = isRefresh ? 0 : page;
    const newPosts = postsData.slice(
      postsPage * PROFILE_FEED_PAGE_SIZE,
      (postsPage + 1) * PROFILE_FEED_PAGE_SIZE
    );

    setPage(postsPage + 1);
    if (newPosts.length < PROFILE_FEED_PAGE_SIZE) setHasMore(false);
    if (isRefresh) setPosts([...chunkArray(newPosts, 3)]);
    else setPosts((prevData) => [...prevData, ...chunkArray(newPosts, 3)]);
  };

  const fetchMorePosts = () => {
    getPostsForUserProfile();
  };

  const onRefresh = async () => {
    setHasMore(true);
    setPage(0);
    getPostsForUserProfile(true);
  };

  useEffect(() => {
    getUserDetails();
    getPostsForUserProfile();
  }, [renderPosts]);

  return (
    <div className="Profile">
      <div className="profile-details-container">
        <div className="profile-details-data-container">
          <span className="profile-details-username">{username}</span>
          <p className="profile-details-description">{description}</p>
          <p className="profile-details-posts">
            <span className="profile-details-posts-amount">{numOfPosts}</span>
            <span>posts</span>
          </p>
        </div>
        <div className="profile-details-image-container">
          {userImage === "" ? (
            <div className="profile-img-default">
              <FaUser size={80} />
            </div>
          ) : (
            <img
              className="profile-img"
              src={userImage === "" ? "#" : userImage}
              alt="profile-image"
            />
          )}
          <button
            type="submit"
            className="btn btn-large profile-edit-btn"
            onClick={() => {
              setShowEditProfile(true);
            }}
          >
            Edit Profile
          </button>
        </div>
      </div>
      <div className="profile-posts-container">
        <PullToRefresh
          pullDownContent={<PullDownContent />}
          releaseContent={<PullToRefreshLoader />}
          refreshContent={<PullToRefreshLoader />}
          pullDownThreshold={80}
          onRefresh={onRefresh}
          triggerHeight={500}
          backgroundColor="white"
        >
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchMorePosts}
            hasMore={hasMore}
            loader={loaderElement}
            endMessage={noMoreDataElement}
            height={
              "calc(100vh - 175px - var(--profile-details-container-height))"
            }
          >
            {posts.map((row, rowIndex) => (
              <div key={rowIndex} className="profile-feed-post-img-row">
                {row.map((post, columnIndex) => (
                  <img
                    key={columnIndex}
                    src={globals.files + post.img}
                    alt="post-image"
                    className="profile-feed-post-img"
                    onClick={() => {
                      setPost(post);
                      setShowPostDetails(true);
                    }}
                  />
                ))}
              </div>
            ))}
          </InfiniteScroll>
        </PullToRefresh>
      </div>
      {showPostDetails && (
        <Modal
          setIsOpen={setShowPostDetails}
          component={
            <Post
              post={post}
              setPost={setPost}
              setShowPostDetails={setShowPostDetails}
              setShowPostOwnerContactDetails={setShowPostOwnerContactDetails}
              setRenderPosts={setRenderPosts}
              isShowingDetails={true}
            />
          }
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
      {showEditProfile && (
        <Modal
          setIsOpen={setShowEditProfile}
          component={
            <EditProfileModal
              firstName={firstName}
              lastName={lastName}
              description={description}
              profileImg={userImage}
              setShowEditProfile={setShowEditProfile}
            />
          }
        />
      )}
    </div>
  );
}

export default Profile;
