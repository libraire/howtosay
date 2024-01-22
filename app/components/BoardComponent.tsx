"use client";
import { Word } from "./types";
import React, { useState, useEffect } from "react";
import styles from "./ComponentStyle.module.css";
import WordComponent from "./WordComponent";
import KeyBoardComponent from "./KeyBoardComponent";

const BoardComponent: React.FC<{}> = () => {
  const [word, setWord] = useState<Word>();
  const [wordList, setWordList] = useState<Word[]>([]);

  useEffect(() => {
    if (wordList.length == 0) {
      fetchData();
    }
  }, [word, wordList]);

  const fetchData = async () => {
    try {
      const response = await fetch("api/words");
      const jsonData = await response.json();
      let list = jsonData.wordlist;
      setWord(list.shift());
      setWordList(list);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function nextWord() {
    setWord(wordList.shift());
    setWordList(wordList);
    if (wordList.length == 0) {
      fetchData();
    }
  }

  return (
    <div className={styles.boardContainer}>
      <div className={styles.title}> How To Say</div>
      <div className={styles.subTitle}>Type the word by its definition</div>
      <div className={styles.manual}>
        <div className={styles.manualItem}>⬅️ Reveal</div>
        <div className={styles.manualItem}>➡️ Hint </div>
        <div className={styles.manualItem}>⬆️ Pronounce</div>
        <div className={styles.manualItem}>⬇️ Skip</div>
      </div>
      <WordComponent
        word={word?.word ?? ""}
        next={() => nextWord()}
        definition={word?.definition ?? ""}
      />

      <KeyBoardComponent />
    </div>
  );
};

export default BoardComponent;
