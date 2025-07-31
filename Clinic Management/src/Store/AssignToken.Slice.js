import { createSlice } from "@reduxjs/toolkit";

// Helper: Get existing tokens from localStorage
const getInitialToken = () => {
  const saved = localStorage.getItem("Token");
  try {
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error parsing Token from localStorage:", error);
    return [];
  }
};

const initialState = {
  token: getInitialToken(),
};

const AssignTokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    assigntokens: (state, action) => {
      const { Assigntokendetails, TokenNumber } = action.payload;

      const Data = {
        ...Assigntokendetails,
        TokenNumber,
        date: new Date().toLocaleDateString(),
        time: new Date(Date.now() + 90 * 60 * 1000).toLocaleTimeString(), // ✅ Corrected
      };

      state.token.push(Data);
      localStorage.setItem("Token", JSON.stringify(state.token));
    },
    removetoken: (state) => {
      state.token = [];
      localStorage.setItem("Token", JSON.stringify([]));
    },
  },
});

export const { assigntokens, removetoken } = AssignTokenSlice.actions;
export default AssignTokenSlice.reducer;
