"use client";
import { Word } from "./types";
import React, { useState, useEffect } from "react";
import styles from "./ComponentStyle.module.css";
import WordComponent from "./WordComponent";
import KeyBoardComponent from "./KeyBoardComponent";
import SelectComponent from "./SelectComponent";
import UserButton from "./user-button"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'


const BoardComponent: React.FC<{}> = () => {
  const [word, setWord] = useState<Word>();
  const [level, setLevel] = useState<string>("default");
  const [wordList, setWordList] = useState<Word[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [marked, setMarked] = useState<boolean>(false);
  const router = useRouter()

  const { data: session, update } = useSession({
    required: false,
  })

  useEffect(() => {
    if (wordList.length == 0) {
      fetchData(level);
    }
  }, [word, wordList, level]);

  function shuffleList(list: Word[]) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  const fetchData = async (lv: string) => {
    try {
      const response = await fetch("api/words?level=" + lv);
      const jsonData = await response.json();
      let list = shuffleList(jsonData.wordlist);
      var wd = list.shift()
      setWord(wd);
      setMarked(!!wd?.marked);
      setWordList(list);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function nextWord() {
    setCompleted(false);
    var wd = wordList.shift();
    setWord(wd);
    setMarked(!!wd?.marked);
    setWordList(wordList);
  }

  function markWord() {

    if (!session?.user) {
      router.push('/api/auth/signin')
    }

    if (word) {
      word.marked = true;
      setMarked(true);
    }
  }

  function unmarkWord() {
    if (!session?.user) {
      router.push('/api/auth/signin')
    }

    if (word) {
      word.marked = false;
      setMarked(false);
    }
  }

  return (
    <div className={styles.boardContainer}>
      <div className={styles.headContainer}>
        <div className={styles.title}>
          {" "}
          <span className={styles.displayNarrow}>💡 </span>How To Say
        </div>
        <div className="ml-2">
          <SelectComponent
            className={styles.displayNarrow}
            choose={(lv) => {
              setLevel(lv);
              fetchData(lv);
            }}
          />
        </div>

        <div className="flex-1 "> </div>
        <a className="text-base text-black" href="https://feedback.bytegush.com/">Feedback</a>
        <a className="text-base text-black mx-4" href="http://donation.bytegush.com/">Donation</a>
        <UserButton />
      </div>

      <div className={styles.manual}>
        <div className={styles.manualItem}>⬅️ Reveal</div>
        <div className={styles.manualItem}>➡️ Hint </div>
        <div className={styles.manualItem}>⬆️ Pronounce</div>
        <div className={styles.manualItem}>⬇️ Next</div>
      </div>

      {completed && (
        <div className={"text-yellow-500 text-base"}>
          🎉🎉🎉 Bravo! Press any key to continue.
        </div>
      )}

      {!completed && (
        <div className={"text-base≠"}>
          Type the word by its definition.
          {!marked && <button onClick={markWord} className={styles.star_button}>★</button>}
          {marked && <button onClick={unmarkWord} className={styles.star_button_marked}>★</button>}
        </div>
      )}

      <WordComponent
        word={word?.word ?? ""}
        next={() => nextWord()}
        complete={() => setCompleted(true)}
        definition={word?.definition ?? ""}
        imgurl={word?.imgurl ?? ""}
        emoji={word?.emoji ?? ""}
      />

      <KeyBoardComponent />
    </div>
  );
};

export default BoardComponent;
