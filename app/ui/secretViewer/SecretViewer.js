// components/SecretViewer.js
import React, { useState } from "react";

const SecretViewer = ({ text = "N/A" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <div style={{fontWeight:'normal'}} className="input-group ">
        {isVisible ? (
          <span>{text}</span>
        ) : (
          <span>
            {text.slice(0, 4) +
              "****" +
              text.slice(text.length - 4, text.length)}
          </span>
        )}

        <i
          onClick={toggleVisibility}
          className={`px-2 bi ${isVisible ? "bi-eye-slash-fill" : "bi-eye-fill"}`}
        ></i>
      </div>
    </div>
  );
};

export default SecretViewer;
