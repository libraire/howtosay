"use client";
import { Char } from "./types";
import React, { useState, useEffect, useRef } from "react";
import styles from "./ComponentStyle.module.css";
import CharComponent from "./Charcomponent";
import Image from "next/image";
import { fetchWordExamples } from "@/app/lib/dict-api";

type Props = {
  word: string;
  next: () => void;
  prev: () => void;
  complete: () => void;
  onSolved?: (result: "correct" | "hinted") => void;
  onSkip?: () => void;
  definition: string;
  imgurl: string;
  emoji: string;
  showExample: boolean
};

const WordComponent: React.FC<Props> = ({
  word,
  next,
  prev,
  complete,
  onSolved,
  onSkip,
  definition,
  imgurl,
  emoji,
  showExample
}) => {
  const [chars, setChars] = useState<Char[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [usedHint, setUsedHint] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState(imgurl);
  const [examples, setExamples] = useState<string[]>([]);
  const charsRef = useRef<Char[]>([]);
  const completedRef = useRef(false);
  const nextRef = useRef(next);
  const prevRef = useRef(prev);
  const completeRef = useRef(complete);

  useEffect(() => {
    charsRef.current = chars;
  }, [chars]);

  useEffect(() => {
    completedRef.current = completed;
  }, [completed]);

  useEffect(() => {
    nextRef.current = next;
  }, [next]);

  useEffect(() => {
    prevRef.current = prev;
  }, [prev]);

  useEffect(() => {
    completeRef.current = complete;
  }, [complete]);

  function handleKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (key == "ArrowRight") {
      if (!completedRef.current && !checkComplete(charsRef.current) && charsRef.current.length > 0) {
        onSkip?.();
      }
      playSound("press");
      nextRef.current();
    } else if (key == "ArrowLeft") {
      playSound("press");
      prevRef.current();
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
    } else if (key === "Enter") {
      playSound("press");
      if (completedRef.current || checkComplete(charsRef.current)) {
        nextRef.current();
      } else {
        hint(true);
      }

    } else if (/^[a-zA-Z]$/.test(key)) {
      setChars((prevChars) => {
        if (checkComplete(prevChars)) {
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

        return newChars;
      });
    }
  }

  useEffect(() => {
    setExamples([]);
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

    if (showExample && word) {
      fetchWordExamples(word).then((results) => {
        if (results.length > 0) {
          setExamples(
            results
              .map((r: any) => extractSentence(r.snippet, word))
              .filter((s: string | null): s is string => !!s)
          );
        }
      });
    }

    if (imgurl.startsWith("/")) {
      const host = "https://158f2f6d.telegraph-image-bya.pages.dev";
      setImageUrl(host + imgurl);
    } else {
      setImageUrl(imgurl);
    }
    setCompleted(false);
    setUsedHint(false);
  }, [word]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!completed && checkComplete(chars)) {
      playSound("complete");
      setCompleted(true);
      onSolved?.(usedHint ? "hinted" : "correct");
      completeRef.current();
    }
  }, [chars, completed, onSolved, usedHint]);
  function checkComplete(chars: Char[]) {
    let hasPlayableChar = false;

    for (var c of chars) {
      if (c.state == 3) {
        continue;
      }

      hasPlayableChar = true;
      if (c.state != 1) {
        return false;
      }
    }
    return hasPlayableChar;
  }

  function hint(all: boolean) {
    setUsedHint(true);
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
      <div className={`${styles.wordSuccessWrap} ${completed ? styles.wordSuccessActive : ""}`}>
        <div className={styles.wordContainer}>
          {chars?.map((char, index) => (
            <CharComponent key={index} char={char} />
          ))}
        </div>
      </div>

      <div className="max-w-[600px] mx-auto mt-5 px-4 flex flex-col text-lg overflow-y flex-auto">
        {imageUrl == "" && emoji == "" && <div className="bg-white rounded-lg p-5 text-gray-900 whitespace-pre-wrap">{mask(word, definition)}</div>}
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

              <div key={index} className="mb-5 text-[#A5A5A5] bg-[#1B1B1B] rounded-lg p-5"
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

function extractSentence(snippet: string, word: string) {
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `(?:^|\\s)([A-Z0-9"][^.?!]*?\\b${escapedWord}\\b[^.?!]*?[.?!])(?![.?!])`,
    "i"
  );
  const match = snippet.match(regex);
  if (match && !match[1].includes("...")) {
    return match[1];
  }
  return null;
}
