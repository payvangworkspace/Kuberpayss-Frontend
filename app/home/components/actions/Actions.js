"use client";
import PageName from "@/app/ui/headings/PageName";
import Search from "../search/Search";
import AddButton from "../addButton/AddButton";

const Actions = ({ pageName, link, label }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <PageName name={pageName} />
      <span className="d-flex gap-2 align-items-center">
        <Search />
        <AddButton icon="bi bi-plus-circle" label={label} link={link} />
      </span>
    </div>
  );
};

export default Actions;
