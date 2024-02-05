"use client";
import { Char } from "./types";
import React, { useState, useEffect } from "react";
import styles from "./ComponentStyle.module.css";
import CharComponent from "./Charcomponent";
import Image from "next/image";

type Props = {
  word: string;
  next: () => void;
  complete: () => void;
  definition: string;
  imgurl: string;
  emoji: string;
};

const WordComponent: React.FC<Props> = ({
  word,
  next,
  complete,
  definition,
  imgurl,
  emoji
}) => {
  const [chars, setChars] = useState<Char[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState(imgurl);
  useEffect(() => {
    setChars(
      word
        ?.toLowerCase()
        ?.replaceAll(" ", "-")
        ?.split("")
        .map((c, i) => {
          var state = c == "-" ? 3 : 0;
          return { char: c, index: i, state: state, inputChar: "" };
        })
    );

    setImageUrl(imgurl);
    setCompleted(false);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [word]);

  function handleKeyDown(event: KeyboardEvent) {
    const key = event.key;

    if (key == " " || key == "Enter") {
      setChars((prevChars) => {
        if (checkComplete(prevChars)) {
          next();
        }
        return prevChars;
      });
    } else if (key === "Backspace") {
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
      speechSynthesis.speak(new SpeechSynthesisUtterance(word));
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
          setCompleted((pre) => {
            complete();
            return true;
          });
        }

        return newChars;
      });
    }
  }

  function checkComplete(chars: Char[]) {
    for (var c of chars) {
      if (c.state == 3) {
        continue;
      }

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
        if (c.state != 1 && c.state != 3) {
          c.state = 1;
          if (!all) {
            break;
          }
        }
      }

      if (checkComplete(newChars)) {
        playSound("complete");
        setCompleted((pre) => {
          complete();
          return true;
        });
      }
      return newChars;
    });
  }

  function nextChar(chars: Char[]) {
    for (var c of chars) {
      if (c.state != 1 && c.state != 3) {
        return c;
      }
    }
    return null;
  }

  function curChar(chars: Char[]) {
    for (var i = chars.length - 1; i >= 0; i--) {
      if (chars[i].state != 0 && chars[i].state != 3) {
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
    if (completed) {
      return originalString;
    }

    const mask = "_".repeat(wordToMask.length);
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

      <div className={styles.definition}>
        {mask(word, definition)}
        {imageUrl != "" && (
          <div>
            <Image
              src={imageUrl}
              alt={word}
              key={imageUrl}
              width={500}
              height={500}
              placeholder="blur"
              blurDataURL="/loading.png"
            />
          </div>
        )}
        {emoji != "" && (
          <div className="text-9xl mt-10">{emoji}</div>
        )}
      </div>
    </>
  );
};

export default WordComponent;
