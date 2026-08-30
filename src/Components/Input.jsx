import React from "react";

const Input = ({
  name,
  type = "text",
  id,
  className = "",
  placeholder,
  required = false,
  onChange,
  value,
  disabled = false,
  min,
  accept = "",
  checked,
  icon: Icon,
  endIcon: EndIcon,
  onEndIconClick,
}) => {
  const minValue = type === "number" && min === undefined ? 0 : min;

  const handleKeyDown = (e) => {
    if (type === "number" && e.key === "-") {
      e.preventDefault();
    }
  };

  const handleBlur = (e) => {
    if (type === "text" && e.target.value) {
      const trimmedValue = e.target.value.trim();

      if (trimmedValue !== e.target.value) {
        e.target.value = trimmedValue;

        if (onChange) {
          onChange(e);
        }
      }
    }
  };

  return (
    <div className="relative">
      {/* Left Icon */}
      {Icon && (
        <Icon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      )}

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={minValue}
        accept={accept}
        checked={checked}
        step={type === "number" ? "1" : undefined}
        onChange={onChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`
          w-full rounded-lg border border-gray-300
          py-3
          ${Icon ? "pl-10" : "pl-4"}
          ${EndIcon ? "pr-10" : "pr-4"}
          text-sm
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-100
          disabled:cursor-not-allowed
          disabled:bg-gray-100
          ${className}
        `}
      />

      {/* Right Icon */}
      {EndIcon && (
        <button
          type="button"
          onClick={onEndIconClick}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <EndIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Input;