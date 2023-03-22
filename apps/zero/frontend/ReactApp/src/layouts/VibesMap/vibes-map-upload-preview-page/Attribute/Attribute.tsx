import React from "react";
import CloseIcon from "@mui/icons-material/Close";

import "./styles.scss";

const Attribute = ({
  attribute,
  removeAttribute,
  id,
  changeAttribute,
  index,
}) => (
  <div className="attributeWrapper">
    <div className="attribute">
      <input
        name="trait_type"
        type="text"
        value={attribute.trait_type}
        onChange={(event) => changeAttribute({ event, id })}
        placeholder="eg. Location"
      />
      <input
        name="value"
        type="text"
        value={attribute.value}
        onChange={(event) => changeAttribute({ event, id })}
        placeholder="eg. United States"
      />
      <button
        className={"_0"}
        type="button"
        onClick={() => removeAttribute(id)}
      >
        <CloseIcon />
      </button>
    </div>
  </div>
);

export default Attribute;
