import { FaPaw } from "react-icons/fa";
import FormInput from "../utils/FormInput/FormInput";
import "./CreatePost.css";
import { useEffect, useState } from "react";
import FormUploadImage from "../utils/FormUploadImage/FormUploadImage";
import FormSelect from "../utils/FormSelect/FormSelect";
import { getDogBreeds } from "../utils/Api";
import { globals } from "../utils/Globals";
import api from "../utils/AxiosInterceptors";
import { getSelectedText } from "../utils/FormUtils";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

interface CreatePostData {
  description: string;
  breedId: string;
  breed: string;
  image: string;
}

interface IProps {
  showFeed: () => void;
}

function CreatePost({ showFeed }: IProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<CreatePostData>({
    description: "",
    breedId: "",
    breed: "",
    image: "",
  });
  const [breeds, setBreeds] = useState<
    [
      {
        value: string;
        text: string;
      }
    ]
  >([
    {
      value: "0",
      text: "",
    },
  ]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createPost = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFile === null) {
      toast.error("Please select an image");
      return;
    }

    const requestFormData = new FormData();
    if (selectedFile) requestFormData.append("image", selectedFile);
    requestFormData.append("description", formData.description);
    requestFormData.append("breedId", selectedBreed);
    requestFormData.append(
      "breed",
      getSelectedText("create-post-select-breed")
    );

    setLoading(true);

    api
      .post(globals.posts.create, requestFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setLoading(false);
        showFeed();
        toast.success("Post created successfully!");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data);
      });
  };

  useEffect(() => {
    getDogBreeds().then((breeds) => {
      setBreeds(breeds);
    });
  }, []);

  return (
    <div className="CreatePost">
      {loading && (
        <div className="create-post-loading">
          <ClipLoader />
        </div>
      )}
      <h1 className="create-post-title">Create Post</h1>
      <form className="create-post-form" onSubmit={(e) => createPost(e)}>
        <FormUploadImage
          uploadedImageId="create-post-img"
          isLarge={true}
          setSelectedFile={setSelectedFile}
        />
        <FormSelect
          elements={breeds}
          optionState={selectedBreed}
          setOptionState={setSelectedBreed}
          icon={<FaPaw size={20} />}
          width="300px"
          isRequired={true}
          selectId="create-post-select-breed"
        />
        <FormInput
          name="description"
          placeholder="Description"
          icon={<FaPaw size={20} />}
          isRequired={true}
          state={formData.description}
          setState={handleInputChange}
          width="300px"
        />
        <button type="submit" className="btn btn-medium create-post-btn">
          Create
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
