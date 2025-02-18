import {createSlice} from "@reduxjs/toolkit"

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedUsers:[],
        userProfile:null,
        selectedUser:null,
        allUsers: [],
        userFriend:[],
        userSavedPost:[],
        mutualFriends:[],
    },
    reducers:{
        setAuthUser:(state,action) => {
            state.user = action.payload;
        },
        setSuggestedUsers:(state,action) => {
            state.suggestedUsers = action.payload;
        },
        setUserProfile:(state,action) => {
            state.userProfile = action.payload;
        },
        setSelectedUser:(state,action) => {
            state.selectedUser = action.payload;
        },
        setAllUser:(state,action) => {
            state.allUsers = action.payload;
        },
        setUserFriend:(state,action)=>{
            state.userFriend = action.payload
        },
        setUserSavedPost:(state,action)=>{
            state.userSavedPost = action.payload
        },
        setMutualFriends:(state,action)=>{
            state.mutualFriends = action.payload
        },
    }
});
export const {
    setAuthUser, 
    setSuggestedUsers, 
    setUserProfile,
    setSelectedUser,
    setAllUser,
    setUserFriend,
    setUserSavedPost,
    setMutualFriends,
} = authSlice.actions;
export default authSlice.reducer;