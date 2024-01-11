import { FaPaw, FaUser } from "react-icons/fa";
import FormInput from "../../utils/FormInput/FormInput";
import FormUploadImage from "../../utils/FormUploadImage/FormUploadImage";
import "./EditProfileModal.css";
import { useState } from "react";

interface IProps {
  firstName: string;
  lastName: string;
  description: string;
  profileImg: string;
  setShowEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditProfileModal({
  firstName,
  lastName,
  description,
  profileImg,
  setShowEditProfile,
}: IProps) {
  const [userFirstName, setUserFirstName] = useState(firstName);
  const [userLastName, setUserLastName] = useState(lastName);
  const [userDescription, setUserDescription] = useState(description);

  const updateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: write updateProfile functionality

    setShowEditProfile(false);
  };

  return (
    <div className="EditProfileModal">
      <form className="register-form" onSubmit={(e) => updateProfile(e)}>
        <FormUploadImage
          uploadedImageId="edit-profile-img"
          currentImage={profileImg}
        />
        <FormInput
          name="first-name"
          placeholder="First name"
          icon={<FaUser size={20} />}
          isRequired={true}
          state={userFirstName}
          setState={setUserFirstName}
        />
        <FormInput
          name="last-name"
          placeholder="Last name"
          icon={<FaUser size={20} />}
          isRequired={true}
          state={userLastName}
          setState={setUserLastName}
        />
        <FormInput
          name="description"
          placeholder="description"
          icon={<FaPaw size={20} />}
          state={userDescription}
          setState={setUserDescription}
        />
        <button type="submit" className="btn btn-medium update-profile-btn">
          Update profile
        </button>
      </form>
    </div>
  );
}

export default EditProfileModal;
