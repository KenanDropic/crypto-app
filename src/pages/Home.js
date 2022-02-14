import React from "react";
import cryptoImg from "../assets/cryptoexchange.jpg";
import InputFields from "../components/InputFields";

const Home = () => {
  return (
    <div className="pageContainer">
      <img src={cryptoImg} alt="crypto" className="crypto-img" />
      <h1>Crypto Conversion Calculator</h1>
      <InputFields />
    </div>
  );
};

export default Home;
