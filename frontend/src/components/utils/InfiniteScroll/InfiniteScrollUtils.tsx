import { ClipLoader } from "react-spinners";

export const FEED_PAGE_SIZE = 5;
export const PROFILE_FEED_PAGE_SIZE = 12;

export const noMoreDataElement = (
  <p className="infinite-scroll-end">No more data to load</p>
);

export const loaderElement = (
  <div className="infinite-scroll-loader">
    <ClipLoader />
  </div>
);
