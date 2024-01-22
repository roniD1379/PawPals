import "./Feed.css";
import Post, { IPostProp } from "../Post/Post";
import { postsData } from "../Post/PostsData";
import Modal from "../utils/Modal/Modal";
import { useEffect, useState } from "react";
import PostContactDetails from "../PostContactDetails/PostContactDetails";
import { PullToRefresh, PullDownContent } from "react-js-pull-to-refresh";
import PullToRefreshLoader from "../utils/PullToRefreshLoader/PullToRefreshLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  FEED_PAGE_SIZE,
  loaderElement,
  noMoreDataElement,
} from "../utils/InfiniteScroll/InfiniteScrollUtils";

function Feed() {
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [showPostOwnerContactDetails, setShowPostOwnerContactDetails] =
    useState(false);
  const [post, setPost] = useState<IPostProp>({
    _id: "0",
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
  const [posts, setPosts] = useState<IPostProp[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const getPosts = (isRefresh = false) => {
    // TODO: write getAllPosts functionality
    const postsPage = isRefresh ? 0 : page;

    const newPosts = postsData.slice(
      postsPage * FEED_PAGE_SIZE,
      (postsPage + 1) * FEED_PAGE_SIZE
    );

    setPage(postsPage + 1);
    if (newPosts.length < FEED_PAGE_SIZE) setHasMore(false);
    if (isRefresh) setPosts([...newPosts]);
    else setPosts((prevData) => [...prevData, ...newPosts]);
    // api.get(globals.posts.feedPosts).then((response) => {
    //   setPosts(response.data);
    // });
  };

  const fetchMorePosts = () => {
    getPosts();
  };

  const onRefresh = async () => {
    setHasMore(true);
    setPage(0);
    getPosts(true);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="Feed">
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
          height={"calc(100vh - 155px)"}
        >
          {posts.map((post, i) => {
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
        </InfiniteScroll>
      </PullToRefresh>
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
            <PostContactDetails
              ownerFirstName={post.ownerFirstName}
              ownerPhoneNumber={post.ownerPhoneNumber}
            />
          }
        />
      )}
    </div>
  );
}

export default Feed;
