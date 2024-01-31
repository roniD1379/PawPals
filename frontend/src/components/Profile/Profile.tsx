import { useEffect, useState } from "react";
import "./Profile.css";
import Post, { IPostProp } from "../Post/Post";
import Modal from "../utils/Modal/Modal";
import EditProfileModal from "./EditProfileModal/EditProfileModal";
import {
  PROFILE_FEED_PAGE_SIZE,
  loaderElement,
  noMoreDataElement,
} from "../utils/InfiniteScroll/InfiniteScrollUtils";
import InfiniteScroll from "react-infinite-scroll-component";
import { globals } from "../utils/Globals";
import api from "../utils/AxiosInterceptors";
import { ClipLoader } from "react-spinners";
import defaultProfileImg from "../../assets/images/default_profile_img.png";

function Profile() {
  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState("");
  const [numOfPosts, setNumOfPosts] = useState(0);
  const [description, setDescription] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [posts, setPosts] = useState<IPostProp[][]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const getUserDetails = async () => {
    await api
      .get(globals.users.userDetails)
      .then((response) => {
        setUsername(response.data.username);
        setUserImage(response.data.userImage);
        setNumOfPosts(response.data.numOfPosts);
        setDescription(response.data.description);
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setPhoneNumber(response.data.phoneNumber);
      })
      .catch((error) => {
        console.log("Failed to get user details from server: ", error);
      });
  };

  const chunkArray = (array: IPostProp[], size: number) => {
    if (array.length === 0) return [[]];
    const chunks = Math.ceil(array.length / size);
    return Array.from({ length: chunks }, (_, index) => {
      const start = index * size;
      const end = start + size;
      return array.slice(start, end);
    });
  };

  const getPostsForUserProfile = async (isRefresh = false) => {
    const postsPage = isRefresh ? 0 : page;

    await api
      .get(globals.posts.userPosts + "/" + postsPage)
      .then((response) => {
        const newPosts = response.data;
        setPage(postsPage + 1);
        if (newPosts.length < PROFILE_FEED_PAGE_SIZE) setHasMore(false);
        if (isRefresh) setPosts([...chunkArray(newPosts, 3)]);
        else setPosts((prevData) => [...prevData, ...chunkArray(newPosts, 3)]);
      })
      .catch((error) => {
        setPosts([]);
        console.log("Failed to get user posts posts", error);
      });
  };

  const fetchMorePosts = () => {
    getPostsForUserProfile();
  };

  const onRefresh = async () => {
    setHasMore(true);
    setPage(0);
    getPostsForUserProfile(true);
  };

  const getProfileData = async () => {
    await getUserDetails();
    await getPostsForUserProfile();
  };

  useEffect(() => {
    getProfileData().then(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="Profile">
      {loading ? (
        <div className="profile-loading">
          <ClipLoader />
        </div>
      ) : (
        <>
          <div className="profile-details-container">
            <div className="profile-details-data-container">
              <span className="profile-details-username">{username}</span>
              <p className="profile-details-description">{description}</p>
              <p className="profile-details-posts">
                <span className="profile-details-posts-amount">
                  {numOfPosts}
                </span>
                <span>posts</span>
              </p>
              <button
                className="btn btn-medium profile-edit-btn"
                onClick={() => {
                  setShowEditProfile(true);
                }}
              >
                Edit Profile
              </button>
            </div>
            <div className="profile-details-image-container">
              <img
                className="profile-img"
                src={
                  userImage === ""
                    ? defaultProfileImg
                    : userImage.startsWith("https") // For google authentication
                    ? userImage
                    : globals.files + userImage
                }
                alt="profile-image"
              />
            </div>
          </div>
          <div className="profile-posts-container">
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
                    <Post
                      key={columnIndex}
                      postDetails={post}
                      isProfilePage={true}
                      onDeleteSuccess={onRefresh}
                    />
                  ))}
                  {row.length < 3 &&
                    Array.from({ length: 3 - row.length }, (_, index) => (
                      <div
                        key={index}
                        className="profile-feed-post-img-size-warper"
                      ></div>
                    ))}
                </div>
              ))}
            </InfiniteScroll>
          </div>
        </>
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
              phoneNumber={phoneNumber}
              setShowEditProfile={setShowEditProfile}
              onEditSuccess={getUserDetails}
            />
          }
        />
      )}
    </div>
  );
}

export default Profile;
