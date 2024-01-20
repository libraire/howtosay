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
    } else if (key === "?") {
      playSound("press");
      hint();
    } else if (key === "!") {
      playSound("press");
      next();
    } else if (/^[a-zA-Z]$/.test(key)) {
      setChars((prevChars) => {
        if (checkComplete(prevChars)) {
          next();
          return [];
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
    const audio: HTMLAudioElement = document.getElementById(
      name
    ) as HTMLAudioElement;
    audio.currentTime = 0; // Rewind to the beginning of the audio file
    audio.play();
  }

  return (
    <>
      <audio id="press" src="/press.mp3"></audio>
      <audio id="alert" src="/alert.mp3"></audio>
      <audio id="complete" src="/completed.mp3"></audio>

      <div className={styles.wordContainer}>
        {chars?.map((char, index) => (
          <CharComponent key={index} char={char} />
        ))}
      </div>

      {completed && (
        <div className={styles.congratulation}>
          Congratulations! <br /> Press any key to continue.
        </div>
      )}

      <p className={styles.definition}> {definition}</p>

      {completed && (
        <a
          className={styles.youglish}
          href={"https://youglish.com/pronounce/" + word + "/english"}
          target="_blank"
        >
          learn pronunciation on youglish.
        </a>
      )}
    </>
  );
};

export default WordComponent;
