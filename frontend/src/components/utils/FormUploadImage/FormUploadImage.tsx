import { useEffect } from "react";
import "./FormUploadImage.css";
import { FaImage } from "react-icons/fa";

interface IProps {
  uploadedImageId: string;
  isLarge?: boolean;
  currentImage?: string;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
}

function FormUploadImage({
  uploadedImageId,
  isLarge = false,
  currentImage = "#",
  setSelectedFile,
}: IProps) {
  useEffect(() => {
    if (currentImage !== "#" && currentImage !== "") {
      const img = document.getElementById(uploadedImageId);
      if (img != null) {
        img.style.display = "block";
        document.getElementById("default-upload-image")?.remove();
      }
    }
  }, []);

  return (
    <div
      className={
        "upload-image-container" +
        (isLarge ? " upload-image-container-large" : "")
      }
    >
      <div id="default-upload-image">
        <FaImage size={80} />
      </div>
      <input
        className="upload-image-input"
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            const img = document.getElementById(uploadedImageId);
            if (img != null) {
              img.onload = () => {
                URL.revokeObjectURL(img.getAttribute("src")!);
              };

              img.setAttribute("src", URL.createObjectURL(e.target.files[0]));
              setSelectedFile(e.target.files[0]);
              img.style.display = "block";
              document.getElementById("default-upload-image")?.remove();
            }
          }
        }}
      />
      <img
        id={uploadedImageId}
        className="upload-image-img"
        src={currentImage === "" ? "#" : currentImage}
      />
    </div>
  );
}

export default FormUploadImage;
