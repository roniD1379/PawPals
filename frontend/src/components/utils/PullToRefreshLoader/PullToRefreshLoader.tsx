import "./PullToRefreshLoader.css";
import { ClipLoader } from "react-spinners";

function PullToRefreshLoader() {
  return (
    <div className="pull-to-refresh-content">
      <ClipLoader color="var(--color-red)" />
    </div>
  );
}

export default PullToRefreshLoader;
