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
import MyDropDown from "./DrowDown";
import HelpSlideOver from "./HelpSlideOver";


const BoardComponent: React.FC<{}> = () => {
  const [word, setWord] = useState<Word>();
  const [level, setLevel] = useState<string>("default");
  const [wordList, setWordList] = useState<Word[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [marked, setMarked] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const handleOnClose = () => setIsOpen(false);
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
      list = await fetchMarkList(list)
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

  async function  fetchMarkList(wordList: Word[]) {

    if (!session?.user) {
      return wordList
    }
    
    const words = wordList.map(word=>word.word).join(",")
    const response = await fetch("/hts/api/v1/mark?words=" + words, { method: 'GET', })
    const jsonData = await response.json()

    if(!jsonData['words']) {
      return wordList
    }

    const map = jsonData['words'].reduce((res: { [key: string]: number }, n: { word: string; mark: number }) => {
      res[n['word']] = n['mark'];
      return res;
    }, {});

    console.log(map)
    
    return wordList.map(word=>{
      word.marked = map[word.word] ?? false
      console.log(word.word,map[word.word])
      return word
    })
  }

  function markWord() {

    if (!session?.user) {
      router.push('/api/auth/signin')
    }

    if (word) {
      fetch("/hts/api/v1/mark?word=" + word.word, { method: 'POST', }).then((response: Response) => {
        console.log(response.body)
        word.marked = true;
        setMarked(true);
      });
    }
  }

  function unmarkWord() {
    if (!session?.user) {
      router.push('/api/auth/signin')
    }

    if (word) {
      fetch("/hts/api/v1/mark?word=" + word.word, { method: 'DELETE', }).then((response: Response) => {
        word.marked = false;
        setMarked(false);
      });
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
        <MyDropDown showHelpSlide={() => {
          setIsOpen(true)
        }} />
        <UserButton />
      </div>

      {completed && (
        <div className="text-yellow-500 text-base mt-10">
          🎉🎉🎉 Bravo! Press any key to continue.
          {!marked && <button onClick={markWord} className={styles.star_button}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>
          </button>}
          {marked && <button onClick={unmarkWord} className={styles.star_button_marked}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>

          </button>}
        </div>
      )}

      {!completed && (
        <div className="text-base≠ mt-10">
          Type the word by its definition.
          {!marked && <button onClick={markWord} className={styles.star_button}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>
          </button>}
          {marked && <button onClick={unmarkWord} className={styles.star_button_marked}>


            <svg xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>
          </button>}
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
      <HelpSlideOver open={isOpen} onClose={handleOnClose} />

    </div>
  );
};

export default BoardComponent;
