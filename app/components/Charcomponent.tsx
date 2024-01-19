"use client";
import { Char } from "./types";
import React, { useState, useEffect } from "react";
import styles from "./ComponentStyle.module.css";

const CharComponent: React.FC<{ char: Char }> = ({ char }) => {
  const [wordChar, setChar] = useState<Char>(char);

  useEffect(() => {
    setChar(char);
  }, [char]);

  return (
    <div className={styles.charContainer}>
      {char.state == 0 && <div>{}</div>}
      {char.state == 1 && (
        <div className={styles.greenChar}>{char.char}</div>
      )}
      {char.state == 2 && (
        <div className={styles.redChar}>{char.inputChar}</div>
      )}
    </div>
  );
};

export default CharComponent;
