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
import { CanceledError } from "axios";

function Feed() {
  const [posts, setPosts] = useState<IPostProp[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const getPosts = async (
    isRefresh = false,
    abortController?: AbortController
  ) => {
    const postsPage = isRefresh ? 0 : page;

    await api
      .get(
        globals.posts.feedPosts + "/" + postsPage,
        !abortController ? {} : { signal: abortController.signal }
      )
      .then((response) => {
        const newPosts = response.data;
        setPage(postsPage + 1);
        if (newPosts.length < FEED_PAGE_SIZE) setHasMore(false);
        if (isRefresh) setPosts([...newPosts]);
        else setPosts((prevData) => [...prevData, ...newPosts]);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        setPosts([]);
        console.log("Failed to get feed posts", error);
      });
  };

  const fetchMorePosts = () => {
    getPosts();
  };

  useEffect(() => {
    const abortController = new AbortController();
    getPosts(undefined, abortController);
    return () => abortController.abort();
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
