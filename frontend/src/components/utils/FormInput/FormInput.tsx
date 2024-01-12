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
  width?: string;
}

function FormInput({
  placeholder = "",
  type = "text",
  icon,
  isRequired = false,
  state,
  setState,
  width,
}: IProps) {
  return (
    <div className="form-input" style={{ width: width }}>
      {icon && <span className="form-input-icon">{icon}</span>}
      <input
        type={type}
        placeholder={(isRequired ? "* " : "") + placeholder}
        name="name"
        required={isRequired}
        value={state}
        onChange={(e) => setState(e.target.value)}
        style={icon ? {} : { width: "100%" }}
      />
    </div>
  );
}

export default FormInput;
