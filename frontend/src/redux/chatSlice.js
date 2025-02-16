import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    onlineUsers: [],
    messages: [],
    selectedMessage: null,
  },
  reducers: {
    // Set online users
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    // Set messages
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    // Set selected message for popout
    setSelectedMessages: (state, action) => {
      state.selectedMessage = action.payload;
    },
    // Delete a message by filtering it out
    deleteMessage: (state, action) => {
        // Update the message's isDeleted flag to true instead of removing it
        const messageIndex = state.messages.findIndex(
            (msg) => msg._id === action.payload
        );

        if (messageIndex !== -1) {
            state.messages[messageIndex].isDeleted = true; // Set isDeleted to true
        }
    },
}
});

export const {
  setOnlineUsers,
  setMessages,
  setSelectedMessages,
  deleteMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
