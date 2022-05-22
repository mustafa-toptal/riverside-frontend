import React from "react";

const Slider = (props) => {
  return (
    <>
      <label className="switch">
        <input
          type="checkbox"
          onChange={props.onChange}
          checked={props.checked}
        />
        <span className="slider round"></span>
      </label>
    </>
  );
};

export default Slider;
