import React from "react";

const ToCurrencies = ({ id, value }) => {
  return <option value={id.toLowerCase()}>{`${id} - ${value}`}</option>;
};

export default ToCurrencies;
