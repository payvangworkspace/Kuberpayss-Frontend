"use client";
import { useEffect, useState } from "react";
import styles from "../page.module.css";

const TAB_ITEMS = [
  { id: 1, label: "Account" },
  { id: 2, label: "Business" },
  { id: 3, label: "Payin" },
  { id: 4, label: "Payout" },
  { id: 5, label: "Documents" },
  { id: 6, label: "Currency" },
  { id: 7, label: "Country" },
  { id: 8, label: "Web Hooks" },
  { id: 9, label: "Settlement Cycle" },
  { id: 10, label: "Refund Limit" },
  { id: 11, label: "Notifications" },
];

const Tabs = ({ handleTabs }) => {
  const [tab, setTab] = useState(1);
  useEffect(() => {
    handleTabs(tab);
  }, [tab]);
  return (
    <div className={styles.tabBar}>
      {TAB_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={
            tab === item.id
              ? `${styles.button} ${styles.active}`
              : styles.button
          }
          onClick={() => setTab(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
