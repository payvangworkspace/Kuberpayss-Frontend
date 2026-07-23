import dynamic from "next/dynamic";
import { pieChartOptions, getPieColors } from "./formatDashboardData";
import { useEffect, useMemo, useState } from "react";
import styles from "./Chart.module.css";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TYPE_ICONS = {
  netbanking: "bi bi-bank",
  debitcard: "bi bi-credit-card",
  creditcard: "bi bi-credit-card-2-front",
  upi: "bi bi-phone",
  wallet: "bi bi-wallet2",
  qr: "bi bi-qr-code",
};

const iconForType = (name = "") => {
  const key = String(name).toLowerCase().replace(/[^a-z]/g, "");
  return TYPE_ICONS[key] || "bi bi-cash-stack";
};

const PaymentTypeData = ({ data = null, rangeLabel = "" }) => {
  const [options, setOptions] = useState({ label: "", pieData: "" });

  useEffect(() => {
    if (data) {
      const keys = Object.keys(data?.data?.data || {});
      const label = pieChartOptions(keys);
      const pieData = label.labels.map((item) =>
        parseFloat(data.data.data[item] || 0)
      );
      setOptions({ label, pieData });
    }
  }, [data]);

  const legendRows = useMemo(() => {
    if (!options.label?.labels || !options.pieData) return [];
    const total = options.pieData.reduce((a, b) => a + (Number(b) || 0), 0) || 1;
    const colors = getPieColors();
    return options.label.labels.map((name, index) => {
      const count = Number(options.pieData[index]) || 0;
      const pct = (count / total) * 100;
      return {
        name,
        count,
        pct,
        color: colors[index % colors.length],
        icon: iconForType(name),
      };
    });
  }, [options]);

  const topType = legendRows.length
    ? [...legendRows].sort((a, b) => b.count - a.count)[0]
    : null;
  const totalTransactions = legendRows.reduce(
    (total, row) => total + row.count,
    0
  );

  if (options.label && options.pieData) {
    return (
      <div className={`${styles.chartCard} ${styles.paymentChartCard}`}>
        <div className={styles.chartHeader}>
          <div className={styles.chartHeaderLeft}>
            <span
              className={`${styles.chartHeaderIcon} ${styles.paymentHeaderIcon}`}
            >
              <i className="bi bi-credit-card-2-front" aria-hidden="true" />
            </span>
            <div>
              <h6 className={styles.chartTitle}>
                Payment Type Transaction Count
              </h6>
              <p className={styles.chartSubtitle}>
                Distribution of transactions by payment type
              </p>
            </div>
          </div>
          <div className={styles.chartHeaderRight}>
            <button
              type="button"
              className={styles.periodButton}
              title={rangeLabel || "Current month"}
            >
              <i className="bi bi-calendar3" aria-hidden="true" />
              <span>This Month</span>
              <i className="bi bi-chevron-down" aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.moreButton}
              aria-label="More chart options"
            >
              <i className="bi bi-three-dots-vertical" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className={styles.paymentLayout}>
          <div className={styles.paymentDonut}>
            <ApexChart
              options={options.label}
              series={options.pieData}
              type="donut"
              height={280}
            />
            <div className={styles.donutCenter} aria-hidden="true">
              <span className={styles.donutCenterIcon}>
                <i className="bi bi-bar-chart-fill" />
              </span>
              <span className={styles.donutTotalLabel}>Total</span>
              <strong className={styles.donutTotalValue}>
                {totalTransactions.toLocaleString()}
              </strong>
              <span className={styles.donutTotalCaption}>Transactions</span>
            </div>
          </div>

          <div className={styles.legendTable}>
            <div className={styles.legendHead}>
              <span>Payment Type</span>
              <span style={{ textAlign: "right" }}>Transactions</span>
              <span style={{ textAlign: "right" }}>Percentage</span>
            </div>
            {legendRows.map((row) => (
              <div
                className={styles.legendCard}
                key={row.name}
                style={{ borderLeftColor: row.color }}
              >
                <div className={styles.legendType}>
                  <div className={styles.legendName}>
                    <span
                      className={styles.legendIcon}
                      style={{
                        background: `${row.color}1f`,
                        color: row.color,
                      }}
                    >
                      <i className={row.icon} aria-hidden="true" />
                    </span>
                    {row.name}
                  </div>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${Math.min(row.pct, 100)}%`,
                        background: row.color,
                      }}
                    />
                  </div>
                </div>
                <span className={styles.legendCount}>
                  {row.count.toLocaleString()}
                </span>
                <span className={styles.legendPct} style={{ color: row.color }}>
                  {row.pct.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {topType && (
          <div className={`${styles.insightBar} ${styles.paymentInsight}`}>
            <span className={styles.insightIcon}>
              <i className="bi bi-graph-up-arrow" aria-hidden="true" />
            </span>
            <span>
              <strong>Insights</strong>
              <span className={styles.insightCopy}>
                {topType.name} has the highest share of transactions this
                month.
              </span>
            </span>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default PaymentTypeData;
