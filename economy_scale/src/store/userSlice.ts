import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../modules/ratioAPI";

interface UserState {
  username: string;
  isAuthorized: boolean;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  error?: string | null;
}

const initialState: UserState = {
  username: "",
  isAuthorized: false,
  error: null,
};

const saveStateToStorage = (state: UserState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("userState", serializedState);
  } catch (err) {
    console.error("Error saving state to localStorage:", err);
  }
};

export const loginUserAsync = createAsyncThunk(
  "user/loginUserAsync",
  async (
    credentials: { username: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.users.loginCreate(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(`Authorization error: ${error}`);
    }
  },
);

export const logoutUserAsync = createAsyncThunk(
  "user/logoutUserAsync",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.users.logoutCreate();
      return response.data;
    } catch (error) {
      return rejectWithValue(`Logout error: ${error}`);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.error = null;
        saveStateToStorage(state);
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        const { user, access_token, refresh_token, token_type, expires_in } =
          action.payload;
        state.username = user?.username || "";
        state.isAuthorized = true;
        state.accessToken = access_token;
        state.refreshToken = refresh_token;
        state.tokenType = token_type;
        state.expiresIn = expires_in;
        state.error = null;
        api.setSecurityData({ accessToken: access_token || "" });
        saveStateToStorage(state);
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthorized = false;
        saveStateToStorage(state);
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.username = "";
        state.isAuthorized = false;
        state.accessToken = undefined;
        state.refreshToken = undefined;
        state.tokenType = undefined;
        state.expiresIn = undefined;
        state.error = null;
        api.setSecurityData(null);
        localStorage.removeItem("userState");
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        saveStateToStorage(state);
      });
  },
});

// export const {} = userSlice.actions;
export default userSlice.reducer;
