import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IuserData {
    isLoggedIn: boolean;
    name: string | null;
    image: string | null;
    email: string | null;
}

const initialState: IuserData = {
    isLoggedIn: false,
    name: null,
    image: null,
    email: null,
};

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        updateCurrentUser: (
            state,
            action: PayloadAction<IuserData>
        ) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.name = action.payload.name;
            state.image = action.payload.image;
            state.email = action.payload.email;
        },
        clearUser: (state) => {
            state.isLoggedIn = false;
            state.name = null;
            state.image = null;
            state.email = null;
        },
    }
});

export default userSlice.reducer;
export const { updateCurrentUser, clearUser } = userSlice.actions;