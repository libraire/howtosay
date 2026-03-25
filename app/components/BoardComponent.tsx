"use client";
import { Word } from "./types";
import React, { useState, useEffect } from "react";
import styles from "./ComponentStyle.module.css";
import WordComponent from "./WordComponent";
import KeyBoardComponent from "./KeyBoardComponent";
import ToolBoxComponent from "./ToolBoxComponent";
import { useCustomAuth } from "@/app/context/CustomAuthProvider";
import StarComponent from "./StarComponent";
import { fetchImageWords, fetchMarkedWords, fetchNextWords } from "@/app/lib/dict-api";
import { markWord as markWordApi, unmarkWord as unmarkWordApi } from "@/app/lib/practice-api";

const selectItems = [
  { label: "Fruit", value: "fruit" },
  { label: "Food", value: "food" },
  { label: "Kitchen", value: "kitchen" },
  { label: "Body", value: "body" },
  { label: "Room", value: "room" },
  { label: "Animal", value: "animal" },
  { label: "Emoji-Activity", value: "emoji-1" },
  { label: "Emoji-Animal&Nature", value: "emoji-2" },
  { label: "Emoji-Food&Drink", value: "emoji-3" },
  { label: "Emoji-Object", value: "emoji-4" },
  { label: "Emoji-Travel&Place", value: "emoji-5" },
]

const BoardComponent: React.FC<{}> = () => {
  const [word, setWord] = useState<Word>();
  const [level, setLevel] = useState<string>(selectItems[0].value);
  const [wordList, setWordList] = useState<Word[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [marked, setMarked] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, login } = useCustomAuth();

  useEffect(() => {
    if (wordList.length == 0 && !isLoading) {
      fetchData(level);
    }
  }, [level]);

  function shuffleList(list: Word[]) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  const fetchData = async (lv: string) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      let wordlist: Word[]
      if (lv.includes("emoji")) {
        wordlist = await fetchNextWords(lv) as Word[];
      } else {
        wordlist = await fetchImageWords(lv) as Word[];
      }
      let list = shuffleList(wordlist);
      fetchMarkList(list)
      var wd = list.shift()
      setWord(wd);
      setMarked(!!wd?.marked);
      setWordList(list);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function nextWord() {
    setCompleted(false);
    if (word) {
      var idx = wordList.indexOf(word);
      if (idx < wordList.length - 1) {
        var wd = wordList[idx + 1];
        setWord(wd);
        setMarked(!!wd?.marked);
      } else {
        fetchData(level)
      }
    } else if (wordList.length > 0) {
      var wd = wordList[0];
      setWord(wd);
      setMarked(!!wd?.marked);
    }
  }

  function prevWord() {
    setCompleted(false);
    if (word) {
      var idx = wordList.indexOf(word);
      if (idx > 0) {
        var wd = wordList[idx - 1];
        setWord(wd);
        setMarked(!!wd?.marked);
      }
    }
  }

  function fetchMarkList(wordList: Word[]) {

    if (!isAuthenticated) {
      return wordList
    }

    fetchMarkedWords(wordList.map(word => word.word))
      .then((markedWords) => {
        if (!markedWords) {
          return
        }

        const map = markedWords.reduce((res: { [key: string]: number }, n: { word: string; mark: number }) => {
          res[n['word']] = n['mark'];
          return res;
        }, {});

        const newList = wordList.map(word => {
          word.marked = Boolean(map[word.word])
          return word
        })

        if (newList.length > 0) {
          setMarked(Boolean(newList[0].marked));
          newList.shift()
          setWordList(newList)
        }
      })

  }

  function markWord() {
    if (!isAuthenticated) {
      login()
      return
    }

    if (word) {
      markWordApi(word.word).then(() => {
        word.marked = true;
        setMarked(true);
      });
    }
  }

  function unmarkWord() {
    if (!isAuthenticated) {
      login()
      return
    }

    if (word) {
      unmarkWordApi(word.word).then(() => {
        word.marked = false;
        setMarked(false);
      });
    }
  }

  function toggleMore() {
    setIsOpen(!isOpen);
  }

  return (
    <div className={styles.boardContainer}>

      <ToolBoxComponent
        selectItems={selectItems}
        selectLevel={(lv) => {
          setLevel(lv);
          fetchData(lv);
        }}
        marked={marked}
        mark={markWord}
        unmark={unmarkWord}
        onClose={undefined}
        word={word?.word ?? ""}
        random={() => {
          setWordList(shuffleList(wordList))
          nextWord()
        }}
        playable={true}
        showIgnore={true}
        next={() => { nextWord() }}
      />

      {completed && <StarComponent word={word?.word ?? ""}></StarComponent>}


      <WordComponent
        word={word?.word ?? ""}
        next={() => nextWord()}
        complete={() => setCompleted(true)}
        definition={word?.definition ?? ""}
        imgurl={word?.imgurl ?? ""}
        emoji={word?.emoji ?? ""}
        showExample={false}
        prev={() => { prevWord() }}
      />

      <KeyBoardComponent />

    </div>
  );
};

export default BoardComponent;
