import { CgClose } from "react-icons/cg";
import "./Modal.css";

interface IProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  component: JSX.Element;
}

export default function Modal({ setIsOpen, component }: IProps) {
  const closeModal = () => {
    setIsOpen(false);
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Prevent clicks inside the modal from closing it
    if ((event.target as HTMLDivElement).classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  return (
    <div className="Modal">
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal">
          <span className="close-button" onClick={closeModal}>
            <CgClose />
          </span>
          {component}
        </div>
      </div>
    </div>
  );
}
