import "./FormUploadImage.css";
import { FaImage } from "react-icons/fa";

interface IProps {
  uploadedImageId: string;
  isLarge?: boolean;
}

function FormUploadImage({ uploadedImageId, isLarge = false }: IProps) {
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
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            const img = document.getElementById(uploadedImageId);
            if (img != null) {
              img.onload = () => {
                URL.revokeObjectURL(img.getAttribute("src")!);
              };

              img.setAttribute("src", URL.createObjectURL(e.target.files[0]));

              img.style.display = "block";
              document.getElementById("default-upload-image")?.remove();
            }
          }
        }}
      />
      <img id={uploadedImageId} className="upload-image-img" src="#" />
    </div>
  );
}

export default FormUploadImage;
