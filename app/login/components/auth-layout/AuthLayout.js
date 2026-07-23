import Image from "next/image";
import styles from "../../page.module.css";
import logo from "../../../../public/images/kuberPay_logo.png";

export default function AuthLayout({
  children,
  wide = false,
  heroTitle = "Welcome to Kuber Payss",
  heroText = "Fast, secure payments designed for merchants who value clarity, control, and reliability.",
  heroItems = [
    "Instant transaction visibility",
    "Secure login with powerful UX",
    "Built for merchants and finance teams",
  ],
}) {
  return (
    <div className={styles.loginPage}>
      <div className={`${styles.loginCard} ${wide ? styles.wideCard : ""}`}>
        <div className={styles.heroSection}>
          <div className={styles.heroLogo}>
            <Image
              src={logo}
              alt="Kuber Payss Logo"
              width={260}
              height={120}
              className={styles.heroLogoImage}
              priority
            />
          </div>
          <h1 className={styles.heroTitle}>{heroTitle}</h1>
          <p className={styles.heroText}>{heroText}</p>
          <ul className={styles.heroList}>
            {heroItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className={styles.formSection}>{children}</div>
      </div>
    </div>
  );
}
