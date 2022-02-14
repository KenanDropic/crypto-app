const coingecko_url = process.env.REACT_APP_COINGECKO_URL;

//fetch base currencies
export const fetchBaseCurrencies = async () => {
  const res = await fetch(process.env.REACT_APP_COINGECKO_URL);
  const data = await res.json();

  return data;
};
//fetch output fiat currencies
export const fetchOutputCurrencies = async () => {
  const res = await fetch("https://openexchangerates.org/api/currencies.json");
  const data = await res.json();

  return data;
};

//fetching coin history
export const fetchCoinHistory = async (id, fetchDate) => {
  const res = await fetch(coingecko_url + `/${id}/history?date=${fetchDate}`);
  const data = await res.json();
  return data;
};

//setting current date that is going to be displayed at first(default state).
export const setCurrentDisplayDate = () => {
  let dates = new Date();
  let dd = String(dates.getDate()).padStart(2, "0");
  let mm = String(dates.getMonth() + 1).padStart(2, "0");
  let yyyy = dates.getFullYear();
  return mm + "-" + dd + "-" + yyyy;
};

//setting current date,formated in a way that coingecko url requires
export const setCurrentFetchDate = () => {
  let dates = new Date();
  let dd = String(dates.getDate()).padStart(2, "0");
  let mm = String(dates.getMonth() + 1).padStart(2, "0");
  let yyyy = dates.getFullYear();
  return dd + "-" + mm + "-" + yyyy;
};
