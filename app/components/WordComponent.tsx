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
  showExample: boolean
};

const WordComponent: React.FC<Props> = ({
  word,
  next,
  complete,
  definition,
  imgurl,
  emoji,
  showExample
}) => {
  const [chars, setChars] = useState<Char[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState(imgurl);
  const [examples, setExamples] = useState<string[]>([]);

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

    if (showExample) {
      fetch("/hts/api/v1/search?word=" + word, { method: 'POST', }).then((response: Response) => {
        return response.json()
      }).then((data) => {
        setExamples(data.examples);
      });
    }

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
    } else if (key === "1") {
      playSound("press");
      hint(false);
    } else if (key === "3") {
      playSound("press");
      hint(true);
    } else if (key === "4") {
      playSound("press");
      next();
    } else if (key === "2") {
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

  function mask(wordToMask: string, originalString: string, index: number = -1) {
    if (completed) {
      if (index >= 0) {
        return index + 1 + ". " + originalString
      }
      return originalString;
    }

    const mask = "_".repeat(wordToMask.length);
    const regex = new RegExp(wordToMask, "gi");
    const maskedString = originalString.replace(regex, mask);

    if (index >= 0) {
      return index + 1 + ". " + maskedString
    }

    return maskedString;
  }

  return (
    <>
      <div className={styles.wordContainer}>
        {chars?.map((char, index) => (
          <CharComponent key={index} char={char} />
        ))}
      </div>

      <div className="max-w-[600px] mx-auto mt-5 px-4 flex flex-col text-lg overflow-y flex-auto">
        {imageUrl == "" && emoji == "" && <div className="bg-white rounded-lg p-5 text-gray-900">{mask(word, definition)}</div>}
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

        {examples.length > 0 && <div className="">
          <div className="text-white mt-6 mb-2 ">
            Examples:
          </div>
          {
            examples.map((example, index) => (

              <div key={index} className="mb-5 text-gray-700 bg-white rounded-lg p-5"
                dangerouslySetInnerHTML={{
                  __html: mask(word, example, index)
                }}
              />

            ))
          }
        </div>
        }

      </div>

    </>
  );
};

export default WordComponent;
