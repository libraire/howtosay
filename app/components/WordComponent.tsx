"use client";
import { Char } from "./types";
import React, { useState, useEffect } from "react";
import styles from "./ComponentStyle.module.css";
import CharComponent from "./Charcomponent";

type Props = {
  word: string;
  next: () => void;
};

const WordComponent: React.FC<Props> = ({ word, next }) => {
  const [chars, setChars] = useState<Char[]>([]);

  useEffect(() => {
    setChars(
      word
        ?.toLowerCase()
        ?.split("")
        .map((c, i) => {
          return { char: c, index: i, state: 0, inputChar: "" };
        })
    );

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [word]);

  function handleKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (key === "Backspace") {
      setChars((prevChars) => {
        const newChars = [...prevChars];
        const char = curChar(prevChars);
        if (char != null) {
          char.state = 0;
        }
        return newChars;
      });
    } else if (key === "?") {
      hint();
    } else if (/^[a-zA-Z]$/.test(key)) {
      setChars((prevChars) => {
        if (checkComplete(prevChars)) {
          next();
          return [];
        }
        const newChars = [...prevChars];
        const char = nextChar(prevChars);
        if (char !== null) {
          char.state = char.char == key ? 1 : 2;
          char.inputChar = key;
        }
        return newChars;
      });
    } else {
      setChars((prevChars) => {
        if (checkComplete(prevChars)) {
          next();
        }
        return prevChars;
      });
    }
  }

  function checkComplete(chars: Char[]) {
    for (var c of chars) {
      if (c.state != 1) {
        return false;
      }
    }
    return true;
  }

  function hint() {
    setChars((prevChars) => {
      const newChars = [...prevChars];
      for (var c of newChars) {
        if (c.state != 1) {
          c.state = 1;
          break;
        }
      }
      return newChars;
    });
  }

  function nextChar(chars: Char[]) {
    for (var c of chars) {
      if (c.state != 1) {
        return c;
      }
    }
    return null;
  }

  function curChar(chars: Char[]) {
    for (var i = chars.length - 1; i >= 0; i--) {
      if (chars[i].state != 0) {
        return chars[i];
      }
    }
    return null;
  }

  return (
    <div className={styles.wordContainer}>
      {chars?.map((char, index) => (
        <CharComponent char={char} />
      ))}
    </div>
  );
};

export default WordComponent;
