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
      {wordChar?.map((char, index) => {
        if (char == "⌫") {
          return (
            <div
              key={index}
              className={styles.keybaordCharWider}
              onClick={() => {
                const event = new KeyboardEvent("keydown", {
                  key: "Backspace",
                });

                document.dispatchEvent(event);
              }}
            >
              {char}
            </div>
          );
        }

        return (
          <div
            key={index}
            className={styles.keybaordChar}
            onClick={() => {
              const event = new KeyboardEvent("keydown", {
                key: char,
              });

              document.dispatchEvent(event);
            }}
          >
            {char}
          </div>
        );
      })}
    </div>
  );
};

const KeyBoardFuncComponent: React.FC = () => {
  const [wordChar, setChar] = useState<FuncKey[]>([
    { char: "▶", key: "ArrowUp" },
    { char: "Hint", key: "ArrowRight" },
    { char: "Reveal", key: "ArrowLeft" },
    { char: "Next", key: "ArrowDown" },
  ]);

  return (
    <div className={styles.keyboardRow}>
      {wordChar?.map((char, index) => (
        <div
          key={index}
          className={styles.keybaordFunc}
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: char.key,
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
      <KeyBoardRowComponent char="qwertyuiop" />
      <KeyBoardRowComponent char="asdfghjkl" />
      <KeyBoardRowComponent char="zxcvbnm⌫" />
      <KeyBoardFuncComponent />
    </div>
  );
};

export default KeyBoardComponent;
