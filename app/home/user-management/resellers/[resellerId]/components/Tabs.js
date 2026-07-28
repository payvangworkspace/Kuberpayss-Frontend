"use client";
import { useEffect, useState } from "react";
import styles from "../page.module.css";

const Tabs = ({ handleTabs }) => {
  const [tab, setTab] = useState(1);
  useEffect(() => {
    handleTabs(tab);
  }, [tab]);
  return (
    <div className="d-flex gap-4 flex-wrap">
      <button
        className={
          tab === 1 ? styles.button + " " + styles.active : styles.button
        }
        onClick={() => setTab(1)}
      >
        Business
      </button>
    </div>
  );
};

export default Tabs;
