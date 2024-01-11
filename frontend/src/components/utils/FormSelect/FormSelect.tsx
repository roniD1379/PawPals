import "./FormSelect.css";

interface IProps {
  elements: string[];
  icon: JSX.Element;
  width?: string;
  optionState: string;
  setOptionState: React.Dispatch<React.SetStateAction<string>>;
}

function FormSelect({
  elements,
  icon,
  width,
  optionState,
  setOptionState,
}: IProps) {
  return (
    <div className="form-select" style={{ width: width }}>
      <span className="form-select-icon">{icon}</span>
      <select
        value={optionState}
        onChange={(e) => setOptionState(e.target.value)}
      >
        {elements.map((element, i) => {
          return (
            <option key={i} value={element}>
              {element}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default FormSelect;
