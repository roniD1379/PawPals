import { CgClose } from "react-icons/cg";
import "./Modal.css";

interface IProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  component: JSX.Element;
  style?: React.CSSProperties;
}

export default function Modal({ setIsOpen, component, style }: IProps) {
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
        <div className="modal" style={style}>
          <span className="close-button" onClick={closeModal}>
            <CgClose />
          </span>
          {component}
        </div>
      </div>
    </div>
  );
}
