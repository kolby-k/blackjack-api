import React from "react";

function Button({ title, onClick, disabled, style }) {
  return (
    <button onClick={onClick} disabled={disabled} className={style}>
      {title}
    </button>
  );
}

export default Button;
