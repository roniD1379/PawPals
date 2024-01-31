import "./Feed.css";
import Post, { IPostProp } from "../Post/Post";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  FEED_PAGE_SIZE,
  loaderElement,
  noMoreDataElement,
} from "../utils/InfiniteScroll/InfiniteScrollUtils";
import api from "../utils/AxiosInterceptors";
import { globals } from "../utils/Globals";

function Feed() {
  const [posts, setPosts] = useState<IPostProp[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const getPosts = async (isRefresh = false) => {
    const postsPage = isRefresh ? 0 : page;

    await api
      .get(globals.posts.feedPosts + "/" + postsPage)
      .then((response) => {
        const newPosts = response.data;
        setPage(postsPage + 1);
        if (newPosts.length < FEED_PAGE_SIZE) setHasMore(false);
        if (isRefresh) setPosts([...newPosts]);
        else setPosts((prevData) => [...prevData, ...newPosts]);
      })
      .catch((error) => {
        setPosts([]);
        console.log("Failed to get feed posts", error);
      });
  };

  const fetchMorePosts = () => {
    getPosts();
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="Feed">
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMorePosts}
        hasMore={hasMore}
        loader={loaderElement}
        endMessage={noMoreDataElement}
        height={"calc(100vh - 155px)"}
      >
        {posts.map((post, i) => {
          return <Post key={i} postDetails={post} />;
        })}
      </InfiniteScroll>
    </div>
  );
}

export default Feed;
