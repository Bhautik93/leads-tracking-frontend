import React from "react";

const Button = ({ className, text, onClick = {}, disabled = false }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onClick()}
      className={`font-medium ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {text}
    </button>
  );
};

export default Button;
