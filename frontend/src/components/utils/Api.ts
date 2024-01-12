import axios from "axios";

export interface APIDogDetails {
  id: number;
  bred_for: string;
  breed_group: string;
  height: { imperial: string; metric: string };
  life_span: string;
  name: string;
  origin: string;
  reference_image_id: string;
  temperament: string;
  weight: { imperial: string; metric: string };
}

export const getDogBreeds = async (): Promise<
  [{ value: string; text: string }]
> => {
  return await axios
    .get("https://api.thedogapi.com/v1/breeds")
    .then((response) => {
      const breedsList = response.data;
      return breedsList.map((breed: APIDogDetails) => {
        return { value: breed.id, text: breed.name };
      });
    })
    .catch((error) => {
      console.error("Error fetching dog breeds:", error);
    });
};
