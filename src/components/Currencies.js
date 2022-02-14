import React from "react";

const Currencies = ({ value }) => {
//   console.log(value);
  const { name, id, symbol } = value;
  return <option value={id}>{symbol.toUpperCase() + " - " + name}</option>;
};

export default Currencies;
