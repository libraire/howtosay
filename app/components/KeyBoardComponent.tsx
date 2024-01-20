"use client";
import React, { useState, useEffect } from "react";
import styles from "./ComponentStyle.module.css";
import { FuncKey } from "./types";

const KeyBoardRowComponent: React.FC<{ char: string }> = ({ char }) => {
  const [wordChar, setChar] = useState<string[]>(char.split(""));

  useEffect(() => {
    setChar(char.split(""));
  }, [char]);

  return (
    <div className={styles.keyboardRow}>
      {wordChar?.map((char, index) => (
        <div
          key={index}
          className={styles.keybaordChar}
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: char, // The key you want to simulate
              // code: 'Enter', // Optional - the code associated with the key
              // keyCode: 13, // Optional - the key code of the key
              // which: 13, // Optional - the key code of the key
            });

            document.dispatchEvent(event);
          }}
        >
          {char}
        </div>
      ))}
    </div>
  );
};

const KeyBoardFuncComponent: React.FC = () => {
  const [wordChar, setChar] = useState<FuncKey[]>([
    { char: "Skip", key: "!" },
    { char: "Hint", key: "?" },
    { char: "Pronounce", key: "-" },
    { char: "Delete", key: "Backspace" },
  ]);

  return (
    <div className={styles.keyboardRow}>
      {wordChar?.map((char, index) => (
        <div
          key={index}
          className={styles.keybaordFunc}
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: char.key, // The key you want to simulate
              // code: 'Enter', // Optional - the code associated with the key
              // keyCode: 13, // Optional - the key code of the key
              // which: 13, // Optional - the key code of the key
            });

            document.dispatchEvent(event);
          }}
        >
          {char.char}
        </div>
      ))}
    </div>
  );
};

const KeyBoardComponent: React.FC = () => {
  return (
    <div className={styles.keyboardContainer}>
      <KeyBoardFuncComponent />
      <KeyBoardRowComponent char="qwertyuiop" />
      <KeyBoardRowComponent char="asdfghjkl" />
      <KeyBoardRowComponent char="zxcvbnm" />
    </div>
  );
};

export default KeyBoardComponent;
