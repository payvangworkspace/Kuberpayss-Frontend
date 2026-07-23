import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { formatDashboardData, summarizeSeries } from "./formatDashboardData";
import styles from "./Chart.module.css";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TransactionCount = ({ data, rangeLabel = "" }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    if (data) {
      const chartData = formatDashboardData(
        data,
        "Count",
        "totalCount",
        0,
        1000,
        "#3b82f6"
      );
      setState(chartData);
    }
  }, [data]);

  const stats = useMemo(
    () => summarizeSeries(state?.series || [], Object.keys(data || {})),
    [state, data]
  );

  if (state && data) {
    return (
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div className={styles.chartHeaderLeft}>
            <span className={`${styles.chartHeaderIcon} ${styles.iconBlue}`}>
              <i className="bi bi-graph-up" aria-hidden="true" />
            </span>
            <div>
              <h6 className={styles.chartTitle}>Transaction Count</h6>
              <p className={styles.chartSubtitle}>
                24Hrs Transaction Count Analysis
              </p>
            </div>
          </div>
          <div className={styles.chartHeaderRight}>
            {rangeLabel && (
              <span className={styles.chartChip}>
                <i className="bi bi-calendar3" aria-hidden="true" />
                {rangeLabel}
              </span>
            )}
            <span className={styles.chartChip}>24 Hours</span>
          </div>
        </div>

        <div className={styles.kpiRow}>
          <div className={`${styles.kpiCard} ${styles.kpiBlue}`}>
            <span className={styles.kpiIcon}>
              <i className="bi bi-graph-up-arrow" aria-hidden="true" />
            </span>
            <div>
              <span className={styles.kpiLabel}>Total Transactions</span>
              <p className={styles.kpiValue}>{stats.total.toLocaleString()}</p>
            </div>
          </div>
          <div className={`${styles.kpiCard} ${styles.kpiGreen}`}>
            <span className={styles.kpiIcon}>
              <i className="bi bi-activity" aria-hidden="true" />
            </span>
            <div>
              <span className={styles.kpiLabel}>Average / Hour</span>
              <p className={styles.kpiValue}>
                {stats.average.toLocaleString()}
              </p>
            </div>
          </div>
          <div className={`${styles.kpiCard} ${styles.kpiOrange}`}>
            <span className={styles.kpiIcon}>
              <i className="bi bi-clock" aria-hidden="true" />
            </span>
            <div>
              <span className={styles.kpiLabel}>Peak Hour</span>
              <p className={styles.kpiValue}>{stats.peak.toLocaleString()}</p>
              {stats.peakLabel && (
                <span className={styles.kpiMeta}>{stats.peakLabel}</span>
              )}
            </div>
          </div>
          <div className={`${styles.kpiCard} ${styles.kpiPurple}`}>
            <span className={styles.kpiIcon}>
              <i className="bi bi-bar-chart" aria-hidden="true" />
            </span>
            <div>
              <span className={styles.kpiLabel}>Lowest Hour</span>
              <p className={styles.kpiValue}>{stats.lowest.toLocaleString()}</p>
              {stats.lowestLabel && (
                <span className={styles.kpiMeta}>{stats.lowestLabel}</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.chartBody}>
          <ApexChart
            options={state?.options}
            series={state?.series}
            type="area"
            height={250}
          />
        </div>

        <div className={styles.insightBar}>
          <i className="bi bi-info-circle" aria-hidden="true" />
          <span>
            Most transactions occurred around{" "}
            <strong>{stats.peakLabel || "—"}</strong> with a peak of{" "}
            <strong>{stats.peak.toLocaleString()}</strong>.
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default TransactionCount;
