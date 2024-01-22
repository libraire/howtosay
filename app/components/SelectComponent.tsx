import React, { useState, ChangeEvent } from "react";
import Select from "react-select";
import styles from "./ComponentStyle.module.css";

type Props = {
  choose: (value: string) => void;
  className: string
};

const SelectComponent: React.FC<Props> = ({ choose, className }) => {
  const [selectedValue, setSelectedValue] = useState<string>("15");
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    choose(value);
  };

  return (
    <select
      value={selectedValue}
      onChange={handleSelectChange}
      className={[styles.selectComponent, className].join(" ")}
    >
      <option value="15">IELT</option>
      <option value="14">TOEFL</option>
      <option value="13">SAT</option>
      <option value="12">12th Grade</option>
      <option value="11">11th Grade</option>
      <option value="10">10th Grade</option>
      <option value="9">9th Grade</option>
      <option value="8">8th Grade</option>
      <option value="7">7th Grade</option>
      <option value="6">6th Grade</option>
      <option value="5">5th Grade</option>
      <option value="4">4th Grade</option>
      <option value="3">3th Grade</option>
      <option value="2">2th Grade</option>
      <option value="1">1th Grade</option>
      <option value="0">Kindergarten</option>
    </select>
  );
};

export default SelectComponent;
