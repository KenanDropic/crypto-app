const cryptoReducer = (state, action) => {
  switch (action.type) {
    case "GET_BASE_CURRENCY":
      return {
        ...state,
        baseCurrency: action.payload,
      };
    case "GET_OUTPUT_CURRENCY":
      return {
        ...state,
        outputCurrency: action.payload,
      };
    case "SET_PRICE_ON_SELECTED_DATE":
      return {
        ...state,
        priceOnSelectedDate: action.payload,
      };
    case "RESET_PRICE_ON_SELECTED_DATE":
      return {
        ...state,
        priceOnSelectedDate: 0,
      };
    default:
      break;
  }
};

export default cryptoReducer;
