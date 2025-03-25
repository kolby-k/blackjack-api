import React from "react";

function Button({ title, onClick, disabled, style }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={style + " " + " cursor-pointer"}
    >
      {title}
    </button>
  );
}

export default Button;
