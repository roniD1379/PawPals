import React from "react";
import "./FormInput.css";

interface IProps {
  placeholder?: string;
  type?: "text" | "number" | "password";
  icon?: JSX.Element;
  name?: string;
  isRequired?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState?: React.SetStateAction<any>;
}

function FormInput({
  placeholder = "",
  type = "text",
  icon,
  isRequired = false,
  state,
  setState,
}: IProps) {
  return (
    <div className="form-input">
      <span className="form-input-icon">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        name="name"
        required={isRequired}
        value={state}
        onChange={(e) => setState(e.target.value)}
      />
    </div>
  );
}

export default FormInput;
