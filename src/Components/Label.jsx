import React from "react";

const Label = ({ text, className, id, name, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} id={id} name={name} className={`mb-2 block text-sm font-medium text-gray-700 ${className} `}
    >
      {text}
    </label>
  );
}

export default Label;
