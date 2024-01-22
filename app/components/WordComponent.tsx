"use client";
import { Char } from "./types";
import React, { useState, useEffect, AudioHTMLAttributes } from "react";
import styles from "./ComponentStyle.module.css";
import CharComponent from "./Charcomponent";

type Props = {
  word: string;
  next: () => void;
  definition: string;
};

const WordComponent: React.FC<Props> = ({ word, next, definition }) => {
  const [chars, setChars] = useState<Char[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  useEffect(() => {
    setChars(
      word
        ?.toLowerCase()
        ?.split("")
        .map((c, i) => {
          return { char: c, index: i, state: 0, inputChar: "" };
        })
    );

    setCompleted(false);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [word]);

  function handleKeyDown(event: KeyboardEvent) {
    console.log(event);
    const key = event.key;
    if (key === "Backspace") {
      playSound("press");
      setChars((prevChars) => {
        const newChars = [...prevChars];
        const char = curChar(prevChars);
        if (char != null) {
          char.state = 0;
        }
        return newChars;
      });
    } else if (key === "ArrowRight") {
      playSound("press");
      hint(false);
    } else if (key === "ArrowLeft") {
      playSound("press");
      hint(true);
    } else if (key === "ArrowDown") {
      playSound("press");
      next();
    } else if (key === "ArrowUp") {
      speechSynthesis.speak(new SpeechSynthesisUtterance(word));
    } else if (/^[a-zA-Z]$/.test(key)) {
      setChars((prevChars) => {
        if (checkComplete(prevChars)) {
          next();
          return prevChars;
        }
        const newChars = [...prevChars];
        const char = nextChar(prevChars);
        if (char !== null) {
          if (char.char == key) {
            playSound("press");
            char.state = 1;
          } else {
            playSound("alert");
            char.state = 2;
          }
          char.inputChar = key;
        }

        if (checkComplete(newChars)) {
          playSound("complete");
          setCompleted(true);
        }

        return newChars;
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

  function hint(all: boolean) {
    setChars((prevChars) => {
      const newChars = [...prevChars];
      for (var c of newChars) {
        if (c.state != 1) {
          c.state = 1;
          if (!all) {
            break;
          }
        }
      }

      if (checkComplete(newChars)) {
        playSound("complete");
        setCompleted(true);
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

  function playSound(name: string) {
    const eventAwesome = new CustomEvent("playSound", {
      bubbles: true,
      detail: { name: name },
    });
    document.dispatchEvent(eventAwesome);
  }

  function mask(wordToMask: string, originalString: string) {
    const mask = "*".repeat(wordToMask.length);
    const regex = new RegExp(wordToMask, "gi");
    const maskedString = originalString.replace(regex, mask);
    return maskedString;
  }

  return (
    <>
      <div className={styles.wordContainer}>
        {chars?.map((char, index) => (
          <CharComponent key={index} char={char} />
        ))}
      </div>

      {completed && (
        <div className={styles.congratulation}>
          Congratulations! Press any key to continue.
        </div>
      )}

      <p className={styles.definition}> {mask(word, definition)}</p>

      {/* {completed && (
        <a
          className={styles.youglish}
          href={"https://youglish.com/pronounce/" + word + "/english"}
          target="_blank"
        >
          learn pronunciation on youglish.
        </a>
      )} */}
    </>
  );
};

export default WordComponent;
