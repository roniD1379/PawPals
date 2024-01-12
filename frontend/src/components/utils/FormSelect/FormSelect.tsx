import { useEffect, useState } from "react";
import "./FormSelect.css";

interface IProps {
  elements?: [
    {
      value: string;
      text: string;
    }
  ];
  getElementsFunc?: () => Promise<[{ value: string; text: string }]>;
  icon?: JSX.Element;
  width?: string;
  optionState: string;
  setOptionState: React.Dispatch<React.SetStateAction<string>>;
  selectId?: string;
}

function FormSelect({
  elements,
  getElementsFunc,
  icon,
  width,
  optionState,
  setOptionState,
  selectId,
}: IProps) {
  const [selectElements, setSelectElements] = useState(elements);

  useEffect(() => {
    if (getElementsFunc) {
      getElementsFunc().then((elements) => {
        setSelectElements(elements);
      });
    }
  }, []);

  return (
    <div className="form-select" style={{ width: width }}>
      {icon && <span className="form-select-icon">{icon}</span>}
      <select
        id={selectId}
        value={optionState}
        onChange={(e) => setOptionState(e.target.value)}
      >
        {elements
          ? elements.map((element, i) => {
              return (
                <option key={i} value={element.value}>
                  {element.text}
                </option>
              );
            })
          : selectElements?.map((element, i) => {
              return (
                <option key={i} value={element.value}>
                  {element.text}
                </option>
              );
            })}
      </select>
    </div>
  );
}

export default FormSelect;
