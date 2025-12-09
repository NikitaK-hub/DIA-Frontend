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

const saveStateToStorage = (access_token: string) => {
  try {
    const serializedState = JSON.stringify(access_token);
    localStorage.setItem("access_token", serializedState);
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

export const registerUserAsync = createAsyncThunk(
  "user/registerUserAsync",
  async (
    credentials: { username: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.users.registerCreate(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(`Registration error: ${error}`);
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

export const updateProfileAsync = createAsyncThunk(
  "user/updateProfileAsync",
  async (
    profileData: {
      username?: string;
      currentPassword?: string;
      newPassword?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const updateData: { username?: string; password?: string } = {};

      if (profileData.username) {
        updateData.username = profileData.username;
      }

      if (profileData.newPassword) {
        updateData.password = profileData.newPassword;
      }

      const response = await api.users.profileUpdate(updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(`Profile update error: ${error}`);
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
      })
      .addCase(registerUserAsync.pending, (state) => {
        state.error = null;
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
        saveStateToStorage(access_token || "");
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
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
        saveStateToStorage(access_token || "");
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthorized = false;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthorized = false;
      })
      .addCase(updateProfileAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        // Обновляем имя пользователя, если оно было изменено
        if (action.payload?.user?.username) {
          state.username = action.payload.user.username;
        }
        state.error = null;
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.error = action.payload as string;
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
        localStorage.removeItem("access_token");
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// export const {} = userSlice.actions;
export default userSlice.reducer;