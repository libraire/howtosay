import React, { useState, ChangeEvent } from "react";
import styles from "./ComponentStyle.module.css";

type Props = {
  choose: (value: string) => void;
  className: string;
};

const SelectComponent: React.FC<Props> = ({ choose, className }) => {
  const [selectedValue, setSelectedValue] = useState<string>("default");
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    choose(value);
    const selectElement = document.getElementById("mySelect");
    selectElement?.blur();
  };

  return (
    <select
      id="mySelect"
      value={selectedValue}
      onChange={handleSelectChange}
      className={[styles.selectComponent, className].join(" ")}
    >
      <optgroup label="Emoji">
        <option value="default">Activity</option>
        <option value="emoji-2">Animal&Nature</option>
        <option value="emoji-3">Food&Drink</option>
        <option value="emoji-4">Object</option>
        <option value="emoji-5">Travel&Place</option>
      </optgroup>

      <optgroup label="Image">
        <option value="18">Fruits</option>
        <option value="17">Kitchen</option>
        <option value="19">Animals</option>
        <option value="20">Food</option>
      </optgroup>

      <optgroup label="Vocabulary">
        <option value="16">Scene</option>
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
      </optgroup>
    </select>
  );
};

export default SelectComponent;
