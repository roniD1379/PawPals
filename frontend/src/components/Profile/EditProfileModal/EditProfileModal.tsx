import { FaPaw, FaUser } from "react-icons/fa";
import FormInput from "../../utils/FormInput/FormInput";
import FormUploadImage from "../../utils/FormUploadImage/FormUploadImage";
import "./EditProfileModal.css";
import { useState } from "react";
import { globals } from "../../utils/Globals";
import toast from "react-hot-toast";
import api from "../../utils/AxiosInterceptors";
import { ClipLoader } from "react-spinners";
import defaultProfileImg from "../../../assets/images/default_profile_img.png";

interface EditUserData {
  description: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface IProps {
  firstName: string;
  lastName: string;
  description: string;
  profileImg: string;
  phoneNumber: string;
  setShowEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
  onEditSuccess: () => void;
}

function EditProfileModal({
  firstName,
  lastName,
  description,
  profileImg,
  phoneNumber,
  setShowEditProfile,
  onEditSuccess,
}: IProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<EditUserData>({
    description: description,
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const requestFormData = new FormData();
    if (selectedFile) requestFormData.append("image", selectedFile);

    requestFormData.append("description", formData.description);
    requestFormData.append("firstName", formData.firstName);
    requestFormData.append("lastName", formData.lastName);
    requestFormData.append("phoneNumber", formData.phoneNumber);

    setLoading(true);

    api
      .put(globals.users.edit, requestFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setShowEditProfile(false);
        setLoading(false);
        if (onEditSuccess) onEditSuccess();
        toast.success("Details updated successfully!");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data);
      });
  };

  return (
    <div className="EditProfileModal">
      {loading && (
        <div className="edit-profile-details-loading">
          <ClipLoader />
        </div>
      )}
      <form className="register-form" onSubmit={(e) => updateProfile(e)}>
        <FormUploadImage
          uploadedImageId="edit-profile-img"
          currentImage={
            profileImg === ""
              ? defaultProfileImg
              : profileImg.startsWith("https")
              ? profileImg
              : globals.files + profileImg
          }
          setSelectedFile={setSelectedFile}
        />
        <FormInput
          name="firstName"
          placeholder="First name"
          icon={<FaUser size={20} />}
          isRequired={true}
          state={formData.firstName}
          setState={handleInputChange}
        />
        <FormInput
          name="lastName"
          placeholder="Last name"
          icon={<FaUser size={20} />}
          isRequired={true}
          state={formData.lastName}
          setState={handleInputChange}
        />
        <FormInput
          name="description"
          placeholder="Description"
          icon={<FaPaw size={20} />}
          state={formData.description}
          setState={handleInputChange}
        />
        <FormInput
          name="phoneNumber"
          placeholder="Phone number"
          icon={<FaPaw size={20} />}
          isRequired={true}
          state={formData.phoneNumber}
          setState={handleInputChange}
        />
        <button type="submit" className="btn btn-medium update-profile-btn">
          Update profile
        </button>
      </form>
    </div>
  );
}

export default EditProfileModal;
