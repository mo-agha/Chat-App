const initState = {
  messages: [],
};

const rootReducer = (state = initState, action) => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return {
        messages: [...state.messages, action.payload],
      };
    default:
      return { ...state };
  }
};

export default rootReducer;
