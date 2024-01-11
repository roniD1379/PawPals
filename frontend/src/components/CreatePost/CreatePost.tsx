import { FaPaw } from "react-icons/fa";
import FormInput from "../utils/FormInput/FormInput";
import "./CreatePost.css";
import { useEffect, useState } from "react";
import FormUploadImage from "../utils/FormUploadImage/FormUploadImage";
import axios from "axios";
import FormSelect from "../utils/FormSelect/FormSelect";

function CreatePost() {
  const [description, setDescription] = useState("");
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState("");

  const createPost = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: write createPost functionality
  };

  const getDogBreeds = async () => {
    await axios
      .get("https://dog.ceo/api/breeds/list/all")
      .then((response) => {
        const breedsList = Object.keys(response.data.message);
        setBreeds(breedsList);
      })
      .catch((error) => {
        console.error("Error fetching dog breeds:", error);
      });
  };

  useEffect(() => {
    getDogBreeds();
  }, []);

  return (
    <div className="CreatePost">
      <h1 className="create-post-title">Create Post</h1>
      <form className="create-post-form" onSubmit={(e) => createPost(e)}>
        <FormUploadImage uploadedImageId="create-post-img" isLarge={true} />
        <FormSelect
          elements={breeds}
          optionState={selectedBreed}
          setOptionState={setSelectedBreed}
          icon={<FaPaw size={20} />}
          width="300px"
        />
        <FormInput
          name="description"
          placeholder="Description"
          icon={<FaPaw size={20} />}
          isRequired={true}
          state={description}
          setState={setDescription}
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
