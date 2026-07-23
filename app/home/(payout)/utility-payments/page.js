import React from "react";
import Link from "next/link";
import styles from "./page.module.css";
import prepaid from "./logos/prepaid.png";
import postpaid from "./logos/postpaid.png";
import ura from "./logos/ura.png";
import nssf from "./logos/nssf.png";
import nwsc from "./logos/nwsc.png";
import Image from "next/image";

export default function Page() {
  const utilityTypes = [
    {
      name: "Electricity",
      values: [
        {
          id: "UEDCLPRE",
          name: "PREPAID",
          image: prepaid,
        },
        {
          id: "UEDCLPOS",
          name: "POSTPAID",
          image: postpaid,
        },
      ],
      path: "/home/utility-payments/electricity",
      icon: "bi bi-lightning-charge",
    },
    {
      name: "Tax",
      values: [
        {
          id: "URA",
          name: "URA",
          image: ura,
        },
        {
          id: "NSSF",
          name: "NSSF",
          image: nssf,
        },
      ],
      icon: "bi bi-cash-stack",
      path: "/home/utility-payments/tax",
    },
    {
      name: "Water",
      values: [
        {
          id: "NWSC",
          name: "NWSC",
          image: nwsc,
        },
      ],
      icon: "bi bi-droplet",
      path: "/home/utility-payments/water",
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Payout</p>
          <h1 className={styles.title}>Utility Payments</h1>
          <p className={styles.subtitle}>
            Choose a utility category and provider to continue
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {utilityTypes.map((utility) => (
          <div key={utility.name} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.iconWrap}>
                <i className={utility.icon} aria-hidden="true" />
              </span>
              <h5 className={styles.cardTitle}>{utility.name}</h5>
            </div>
            <div className={styles.cardBody}>
              {utility.values.map((value) => (
                <Link
                  key={value.id}
                  href={`${utility.path}?type=${value.id}`}
                  className={styles.optionLink}
                >
                  <div className={styles.option}>
                    <Image
                      src={value.image}
                      alt={value.name}
                      width={24}
                      height={24}
                      className={styles.optionLogo}
                    />
                    <span className={styles.utilityName}>{value.name}</span>
                    <i
                      className={`bi bi-chevron-right ${styles.optionChevron}`}
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
