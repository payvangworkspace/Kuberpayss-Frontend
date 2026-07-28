import React, { useState, useEffect, useRef } from "react";
import styles from "./DraggableTable.module.css";

const DraggableTable = ({ initialData, onOrderChange }) => {
  const [data, setData] = useState(initialData);
  const [draggingRowId, setDraggingRowId] = useState(null);
  const [dragOverRowId, setDragOverRowId] = useState(null);
  const tableBodyRef = useRef(null);

  useEffect(() => {
    if (data[0]?.priority === undefined) {
      const updatedData = initialData;
      setData(updatedData);
    }
  }, [onOrderChange, initialData]);

  useEffect(() => {
    const storedOrderKey = `draggableTableOrder_${
      initialData.length > 0 ? initialData[0]?.userId : "default"
    }`;
    const storedOrder = localStorage.getItem(storedOrderKey);
    if (storedOrder) {
      try {
        const parsedOrder = JSON.parse(storedOrder);
        const orderedData = parsedOrder
          .map((id) => data.find((item) => item.userId === id))
          .filter(Boolean);
        if (orderedData.length === data.length) {
          setData(
            orderedData.map((item, index) =>
              ({ ...item, priority: index + 1 }.priority.toString())
            )
          );
        } else {
          setData(
            data.map((item, index) => ({
              ...item,
              priority: (index + 1).toString(),
            }))
          );
        }
      } catch (error) {
        console.error("Error parsing stored order:", error);
        setData(
          data.map((item, index) => ({
            ...item,
            priority: (index + 1).toString(),
          }))
        );
      }
    } else {
      setData(
        data.map((item, index) => ({
          ...item,
          priority: (index + 1).toString(),
        }))
      );
    }
  }, [initialData, data.length]);

  useEffect(() => {
    const storedOrderKey = `draggableTableOrder_${
      initialData.length > 0 ? initialData[0]?.userId : "default"
    }`;
    const currentOrder = data.map((item) => item.userId);
    localStorage.setItem(storedOrderKey, JSON.stringify(currentOrder));
  }, [data, initialData]);

  // useEffect(() => {
  //   if (onOrderChange) {
  //     onOrderChange(data);
  //   }
  // }, [dragOverRowId]);

  const handleDragStart = (e, userId) => {
    setDraggingRowId(userId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", userId);
    const target = e.target.closest("tr");
    if (target) {
      target.classList.add(styles["is-dragging"]);
    }
  };

  const handleDragOver = (e, userId) => {
    e.preventDefault();
    if (draggingRowId !== userId && dragOverRowId !== userId) {
      setDragOverRowId(userId);
    }
  };

  const handleDragLeave = (e, userId) => {
    if (dragOverRowId === userId) {
      setDragOverRowId(null);
    }
  };

  const handleDragEnd = (e) => {
    setDraggingRowId(null);
    const target = e.target.closest("tr");
    if (target) {
      target.classList.remove(styles["is-dragging"]);
    }
  };

  const handleDrop = (e, dropUserId) => {
    if (draggingRowId === null || draggingRowId === dropUserId) {
      return;
    }

    const newData = [...data];
    const draggingIndex = newData.findIndex(
      (item) => item.userId === draggingRowId
    );
    const dropIndex = newData.findIndex((item) => item.userId === dropUserId);

    if (draggingIndex !== -1 && dropIndex !== -1) {
      const [draggedItem] = newData.splice(draggingIndex, 1);
      newData.splice(dropIndex, 0, draggedItem);

      const updatedData = newData.map((item, index) => ({
        ...item,
        priority: (index + 1).toString(),
      }));
      setData(updatedData);
    }

    setDraggingRowId(null);
    setDragOverRowId(null);
  };

  const getTableRowProps = (item) => ({
    draggable: true,
    onDragStart: (e) => handleDragStart(e, item.userId),
    onDragOver: (e) => handleDragOver(e, item.userId),
    onDrop: (e) => handleDrop(e, item.userId),
    onDragLeave: (e) => handleDragLeave(e, item.userId),
    onDragEnd: handleDragEnd,
    className: `${dragOverRowId === item.userId ? styles["drag-over"] : ""} ${
      draggingRowId === item.userId ? styles["is-dragging"] : ""
    }`,
  });

  return (
    <div className={styles["draggable-table-container"]}>
      <table
        id="table"
        className={styles["draggable-table"]}
        ref={tableBodyRef}
      >
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {data
            .sort((a, b) => parseInt(a.priority) - parseInt(b.priority))
            .map((item) => (
              <tr key={item.userId} {...getTableRowProps(item)}>
                <td>{item.fullName}</td>
                <td>{item.priority}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-end align-items-center mt-3">
        <button className={styles.blueBg+" btn btn-primary py-1"} onClick={() => onOrderChange(data)}>
          Save
        </button>

      </div>
    </div>
  );
};

export default DraggableTable;
