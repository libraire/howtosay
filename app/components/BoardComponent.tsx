"use client";
import { Word } from "./types";
import React, { useState, useEffect } from "react";
import styles from "./ComponentStyle.module.css";
import WordComponent from "./WordComponent";
import KeyBoardComponent from "./KeyBoardComponent";
import ToolBoxComponent from "./ToolBoxComponent";
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import StarComponent from "./StarComponent";

const selectItems = [
  { label: "Fruit", value: "fruit" },
  { label: "Food", value: "food" },
  { label: "Kitchen", value: "kitchen" },
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
  const router = useRouter()

  const { data: session, update } = useSession({
    required: false,
  })

  useEffect(() => {

    if (wordList.length == 0) {
      fetchData(level);
    }

  }, [session, word, wordList, level]);

  function shuffleList(list: Word[]) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  const fetchData = async (lv: string) => {
    try {

      var response
      if (lv.includes("emoji")) {
        response = await fetch("api/words?level=" + lv);
      } else {
        response = await fetch("/hts/api/v1/dict/image?category=" + lv);
      }

      const jsonData = await response.json();
      let list = shuffleList(jsonData.wordlist);
      fetchMarkList(list)
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

    if (!session?.user) {
      return wordList
    }

    const words = wordList.map(word => word.word).join(",")
    fetch("/hts/api/v1/mark?words=" + words, { method: 'GET', })
      .then((response) => response.json())
      .then((jsonData) => {
        if (!jsonData['words']) {
          return
        }

        const map = jsonData['words'].reduce((res: { [key: string]: number }, n: { word: string; mark: number }) => {
          res[n['word']] = n['mark'];
          return res;
        }, {});

        const newList = wordList.map(word => {
          word.marked = map[word.word] ?? false
          return word
        })

        if (newList.length > 0) {
          setMarked(newList[0].marked);
          newList.shift()
          setWordList(newList)
        }
      })

  }

  function markWord() {

    if (!session?.user) {
      console.log("22222222222")
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
      console.log("111111111")
      router.push('/api/auth/signin')
    }

    if (word) {
      fetch("/hts/api/v1/mark?word=" + word.word, { method: 'DELETE', }).then((response: Response) => {
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
        showIgnore={false}
        next={() => { }}
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
