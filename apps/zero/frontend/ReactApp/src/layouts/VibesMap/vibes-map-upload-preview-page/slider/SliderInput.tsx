import React from "react";

import "./styles.scss";

const SliderInput = ({ MAX, value, handleChange }) => {
  const min = 0;
  const max = 10;
  const width = `${((value - min) * 100) / (max - min)}% 100%`;
  return (
    <div className="slider-container">
      <input
        className="slider"
        style={{
          backgroundSize: width,
        }}
        type="range"
        min="0"
        max={MAX}
        step={1}
        onChange={handleChange}
        value={value}
      />
      <div>{value}</div>
    </div>
  );
};

export default SliderInput;
