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
    <div className="container">
      <div className="row">
        {utilityTypes?.map((utility, index) => (
          <div key={index} className="col-md-3 mb-4">
            {utility.values ? (
              <div className="card">
                <div className="card-header text-center">
                  <i className={`${utility.icon} fs-3`}></i>
                  <h5>{utility.name}</h5>
                </div>
                <div className="card-body">
                  {utility.values.map((value, i) => (
                    <Link
                      key={i}
                      href={`${utility.path}?type=${value.id}`}
                      className="text-decoration-none d-block mb-2 text-black"
                    >
                      <div className="d-flex align-items-center p-2 hover-bg">
                        <Image
                          src={value.image}
                          alt={value.name}
                          width={24}
                          height={24}
                          className="me-2"
                        />
                        <span className={styles.utilityName}>{value.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link href={utility.path} className="text-decoration-none">
                <div className="card text-center" style={{ cursor: "pointer" }}>
                  <div className={`${styles.col} card-body`}>
                    <i className={`${utility.icon} fs-3 mb-2`}></i>
                    <h5 className="card-title">{utility.name}</h5>
                  </div>
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
