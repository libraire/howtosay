import React, { useState, ChangeEvent,useEffect } from "react";
import styles from "./ComponentStyle.module.css";

type SelectItem = {
  value: string;
  label: string;
};

type Props = {
  choose: (value: string) => void;
  items: SelectItem[];
};

const SelectComponent: React.FC<Props> = ({ choose, items }) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    choose(value);
    const selectElement = document.getElementById("mySelect");
    selectElement?.blur();
  };

  useEffect(() => {
    setSelectedValue(items[0].value);
  }, [items]);

  return (
    <select
      id="mySelect"
      value={selectedValue}
      onChange={handleSelectChange}
      className={[styles.selectComponent].join(" ")}
    >
      {
        items.map((item, index) => (
          <option key={index} value={item.value}>{item.label}</option>
        ))
      }

    </select>
  );
};

export default SelectComponent;
