import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useState } from "react";

const useTableExports = (columns, data = []) => {
  const tableData = async (headers, body) => {
    let data = [];
    const header = headers.map((ele) => ele.name);
    data.push(header);
    body.forEach((element) => {
      const values = headers.map((key) => element[`${key["key"]}`]);
      data.push(values);
    });
    return data;
  };
  const exportToExcel = async () => {
    const excelData = await tableData(columns, data);
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "merchants.xlsx");
  };

  const exportToCSV = async () => {
    const csvData = await tableData(columns, data);
    const ws = XLSX.utils.aoa_to_sheet(csvData);
    const csvContent = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merchants.csv";
    a.click();
  };

  const exportToPDF = async () => {
    const pdfData = await tableData(columns, data);
    const doc = new jsPDF();
    doc.autoTable({
      head: [pdfData[0]],
      body: pdfData.slice(1),
    });
    doc.save("merchants.pdf");
  };

  const [showModal, setShowModal] = useState(false);
  const handleViewModal = () => {
    setShowModal(!showModal);
  };
  return {
    exportToExcel,
    exportToCSV,
    exportToPDF,
    handleViewModal,
    showModal,
  };
};
export default useTableExports;
