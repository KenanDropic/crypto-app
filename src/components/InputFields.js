import React, { useState, useEffect, useContext } from "react";
import DatePicker from "@mui/lab/DatePicker";
import { TextField } from "@mui/material";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Currencies from "./Currencies";
import ToCurrencies from "./ToCurrencies";
import { fetchBaseCurrencies } from "../context/CryptoActions";
import { fetchOutputCurrencies } from "../context/CryptoActions";
import { fetchCoinHistory } from "../context/CryptoActions";
import { setCurrentDisplayDate } from "../context/CryptoActions";
import { setCurrentFetchDate } from "../context/CryptoActions";
import CryptoContext from "../context/CryptoContext";
import { toast } from "react-toastify";

const InputFields = () => {
  const { priceOnSelectedDate, baseCurrency, outputCurrency, dispatch } =
    useContext(CryptoContext);
  const [formData, setFormData] = useState({
    id: "",
    secondCurrency: "",
    amountOf: 0,
  });
  const [startDate, setStartDate] = useState(setCurrentDisplayDate()); //value to display
  const [fetchValue, setFetchValue] = useState(setCurrentFetchDate()); //value to fetch

  //function that handles changes in DatePicker
  const handleChange = (e) => {
    let dd = String(e.getDate()).padStart(2, "0");
    let mm = String(e.getMonth() + 1).padStart(2, "0");
    let yyyy = e.getFullYear();
    let choosenDate = `${mm}-${dd}-${yyyy}`;

    if (choosenDate === startDate) {
      //ako je izabran datum jedank današnjem datumu,ne vršimo dodavanje +1 dana
      dd = String(e.getDate()).padStart(2, "0");
      choosenDate = `${mm}-${dd}-${yyyy}`;
      setStartDate(new Date(choosenDate));
      setFetchValue(`${dd}-${mm}-${yyyy}`);
    } else {
      //ako izabran datum nije jedank današnjem datumu,vršimo dodavanje +1 dana. NPR; ako je izabran 11.2. bit će fetchovani podaci za 12.2.
      dd = String(e.getDate() + 1).padStart(2, "0"); //value to fetch
      let dd2 = String(e.getDate()).padStart(2, "0"); //value to display
      choosenDate = `${mm}-${dd2}-${yyyy}`;
      const choosenDate2 = `${dd}-${mm}-${yyyy}`;
      setStartDate(new Date(choosenDate));
      setFetchValue(choosenDate2);
    }
  };

  useEffect(() => {
    //fetching base currencies
    const fetchDataFrom = async () => {
      const baseCurrencies = await fetchBaseCurrencies();
      dispatch({ type: "GET_BASE_CURRENCY", payload: baseCurrencies });
    };

    //fetching output currencies
    const fetchDataTo = async () => {
      const outputCurrencies = await fetchOutputCurrencies();
      dispatch({ type: "GET_OUTPUT_CURRENCY", payload: outputCurrencies });
    };

    fetchDataFrom();
    fetchDataTo();
  }, [dispatch]);

  //updating states on onChange
  const handleStateChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const fetchCoin = async () => {
    if (formData.id === "") {
      return false;
    } else {
      try {
        const coinHistory = await fetchCoinHistory(formData.id, fetchValue);
        dispatch({
          type: "SET_PRICE_ON_SELECTED_DATE",
          payload:
            coinHistory.market_data.current_price[formData.secondCurrency],
        });
      } catch (err) {
        toast.error("Could not fetch data!");
      }
    }
  };

  //on clicking reset button
  const handleReset = () => {
    setFormData({
      id: "",
      secondCurrency: "",
      amountOf: 0,
    });
    setStartDate();
    setFetchValue();
    dispatch({ type: "RESET_PRICE_ON_SELECTED_DATE" });
  };

  //dd-mm-yyyy
  return (
    <div className="container">
      <div className="input-data">
        <div className="data">
          <label htmlFor="datePicker">Date(of conversion) :</label>
          <div className="calendar">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                InputProps={{
                  style: {
                    width: "100%",
                    boxShadow: "0px 0px 3px 1px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#ffffff",
                  },
                }}
                renderInput={(props) => (
                  <TextField {...props} label="DD-MM-YYYY" />
                )}
                onChange={handleChange}
                value={startDate}
                mask="__-__-____"
                inputFormat="dd-MM-yyy"
                maxDate={new Date()}
              ></DatePicker>
            </LocalizationProvider>
          </div>
        </div>
        <div className="data">
          <label htmlFor="select">Base Currency :</label>
          <select id="id" onChange={handleStateChange} value={formData.id}>
            <option value=""></option>
            {baseCurrency.map((currency) => (
              <Currencies key={currency.id} value={currency} />
            ))}
          </select>
        </div>
        <div className="data">
          <label htmlFor="amount">Insert Amount :</label>
          <div className="coin">
            <input
              type="text"
              placeholder="Coin amount"
              id="amountOf"
              className="amount"
              onChange={handleStateChange}
              value={formData.amountOf}
            />
          </div>
        </div>
        <div className="data">
          <label htmlFor="select2">Output fiat Currency :</label>
          <select
            id="secondCurrency"
            onChange={handleStateChange}
            value={formData.secondCurrency}
          >
            <option value=""></option>
            {Object.entries(outputCurrency).map(([key, value]) => (
              <ToCurrencies key={key} id={key} value={value} />
            ))}
          </select>
        </div>
        <div className="buttons">
          <button
            className="btn"
            type="submit"
            id="submit"
            onClick={() => fetchCoin()} //when clicked,call fetchCoin()
          >
            Submit
          </button>
          <button className="btn" id="reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      <div className="output-data">
        <div className="data">
          <label>Price on selected date : </label>
          <input
            type="text"
            id="selectedDate"
            readOnly="readonly"
            value={
              priceOnSelectedDate !== undefined
                ? priceOnSelectedDate.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : 0
            } //formating number as money. Ako je priceOnSelectedDate undefiend vraćamo 0,u suprtonom vraćamo rezultat
          />
        </div>

        <div className="data">
          <label>Total : </label>
          <input
            type="text"
            id="result"
            readOnly="readonly"
            value={
              isNaN(formData.amountOf * priceOnSelectedDate)
                ? 0
                : (formData.amountOf * priceOnSelectedDate).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )
            } //calculating total and formating output numbers as money. Ako je rezultat množenja isNaN(is not a number) onda vraćamo 0,u suprotnom vraćamo proizvod
          />
        </div>
      </div>
    </div>
  );
};

export default InputFields;
