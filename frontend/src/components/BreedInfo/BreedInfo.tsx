import "./BreedInfo.css";
import axios from "axios";
import { APIDogDetails } from "../CreatePost/CreatePost";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

interface IProps {
  breedId: number;
}

function BreedInfo({ breedId }: IProps) {
  const [info, setInfo] = useState<APIDogDetails>({
    id: 0,
    bred_for: "",
    breed_group: "",
    height: { imperial: "", metric: "" },
    life_span: "",
    name: "",
    origin: "",
    reference_image_id: "",
    temperament: "",
    weight: { imperial: "", metric: "" },
  });
  const [img, setImg] = useState("#");
  const [loading, setLoading] = useState(true);

  const getDogDetailsByBreed = async () => {
    return await axios
      .get("https://api.thedogapi.com/v1/breeds/" + breedId)
      .then((response) => {
        setInfo(response.data);
        return response.data.reference_image_id;
      })
      .catch((error) => {
        console.error("Error fetching dog breeds:", error);
      });
  };

  const getBreedImg = async (imageId: number) => {
    await axios
      .get("https://api.thedogapi.com/v1/images/" + imageId)
      .then((response) => {
        setImg(response.data.url);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dog image:", error);
      });
  };

  useEffect(() => {
    getDogDetailsByBreed().then((imageId) => {
      getBreedImg(imageId);
    });
  }, []);

  return (
    <div className="BreedInfo">
      {loading ? (
        <div className="breed-info-loader-container">
          <ClipLoader color="var(--color-red)" />
        </div>
      ) : (
        <>
          <div className="breed-info-img-container">
            <img className="breed-info-img" src={img} alt="breed-default-img" />
          </div>
          <p>
            <b>Name:</b> {info.name}
          </p>
          <p>
            <b>Breed group:</b> {info.breed_group}
          </p>
          <p>
            <b>Temperament:</b> {info.temperament}
          </p>
          <p>
            <b>Bred for:</b> {info.bred_for}
          </p>
          <p>
            <b>Origin:</b> {info.origin}
          </p>
          <p>
            <b>Life span:</b> {info.life_span}
          </p>
          <p>
            <b>Height:</b> {info.height.metric} cm / {info.height.imperial} in
          </p>
          <p>
            <b>Weight:</b> {info.weight.metric} kg / {info.weight.imperial} lbs
          </p>
        </>
      )}
    </div>
  );
}

export default BreedInfo;
