"use client";
import { Char } from "./types";
import React, { useState, useEffect, AudioHTMLAttributes } from "react";
import styles from "./ComponentStyle.module.css";
import CharComponent from "./Charcomponent";
import useAudioContext from "./AudioComponent";

type Props = {
  word: string;
  next: () => void;
  definition: string;
};

const WordComponent: React.FC<Props> = ({ word, next, definition }) => {
  const [chars, setChars] = useState<Char[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const audioContext = useAudioContext();

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
    loadBuffer();
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [word, audioContext]);

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
    } else if (key === "-") {
      speechSynthesis.speak(new SpeechSynthesisUtterance(word));
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
    // const audio: HTMLAudioElement = document.getElementById(
    //   name
    // ) as HTMLAudioElement;
    // audio.currentTime = 0; // Rewind to the beginning of the audio file
    // audio.play();

    var buffer:AudioBuffer | null = null;
    if (name == "press") {
      buffer = pressBuffer;
    }else if(name == "alert") {
      buffer = alertBuffer;
    }else if(name == "complete") {
      buffer = completeBuffer;
    }

    if (buffer && audioContext != null) {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
      return;
    }

  }

  let pressBuffer: AudioBuffer;
  let alertBuffer: AudioBuffer;
  let completeBuffer: AudioBuffer;

  function loadBuffer() {

    fetch("/press.mp3")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext?.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        // Use the audioBuffer as needed
        pressBuffer = audioBuffer!;
      })
      .catch((error) => {
        console.error("Error loading sound file:", error);
      });


      fetch("/completed.mp3")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext?.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        // Use the audioBuffer as needed
        completeBuffer = audioBuffer!;
      })
      .catch((error) => {
        console.error("Error loading sound file:", error);
      });

      fetch("/alert.mp3")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext?.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        // Use the audioBuffer as needed
        alertBuffer = audioBuffer!;
      })
      .catch((error) => {
        console.error("Error loading sound file:", error);
      });
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
          Congratulations! Press any key to continue.
        </div>
      )}

      <p className={styles.definition}> {definition}</p>

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
