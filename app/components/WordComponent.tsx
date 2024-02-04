"use client";
import { Char } from "./types";
import React, { useState, useEffect, AudioHTMLAttributes } from "react";
import styles from "./ComponentStyle.module.css";
import CharComponent from "./Charcomponent";
import Image from "next/image";

type Props = {
  word: string;
  next: () => void;
  definition: string;
  imgurl: string;
};

const WordComponent: React.FC<Props> = ({ word, next, definition, imgurl }) => {
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

    updateImage(imgurl);
    setCompleted(false);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [word]);

  function handleKeyDown(event: KeyboardEvent) {
    console.log(event);
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
        setCompleted(true);
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

  const [isLoading, setIsLoading] = useState(false);

  const updateImage = (imgurl: string) => {
    setIsLoading(true);
    setImageUrl(imgurl);
  };

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

      <p className={styles.definition}>
        {" "}
        {mask(word, definition)}{" "}
        {imageUrl != "" && (
          <div>
            {isLoading && <div className="placeholder"></div>}
            <Image
              src={imageUrl}
              alt="Picture of the author"
              width={500}
              height={500}
              onLoad={() => {
                setIsLoading(false);
              }}
              onError={()=>{
                setIsLoading(false);
              }}
              placeholder="blur"
              blurDataURL="/bg.png"
              quality={100}
            />
            <style jsx>{`
              .placeholder {
                width: 500px;
                height: 500px;
                background-image: url("/bg.png");
                background-size: auto;
                background-color: #f3f3f3;
              }
            `}</style>
          </div>
        )}
      </p>
    </>
  );
};

export default WordComponent;
