import { createContext, useReducer } from "react";
import cryptoReducer from "./CryptoReducer";

const CryptoContext = createContext();

export const CryptoProvider = ({ children }) => {
  const initialState = {
    baseCurrency: [],
    outputCurrency: [],
    priceOnSelectedDate: 0,
  };

  const [state, dispatch] = useReducer(cryptoReducer, initialState);

  return (
    <CryptoContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

export default CryptoContext;
