import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ParamsState {
  userId: string | null;
  username: string | null;
  email: string | null;
  isAuthenticated: boolean;
  theme: "light" | "dark";
  language: string;
  step: number;
  pluginframe: boolean;
  openPluginwindow:boolean;
}

const initialState: ParamsState = {
  userId: null,
  username: null,
  email: null,
  isAuthenticated: false,
  theme: "light",
  language: "en",
  step: 1,
  pluginframe: false,
  openPluginwindow:false
};

const paramsSlice = createSlice({
  name: "params",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
    },
    setUsername: (state, action: PayloadAction<string | null>) => {
      state.username = action.payload;
    },
    setEmail: (state, action: PayloadAction<string | null>) => {
      state.email = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    resetParams: (state) => {
      state.userId = null;
      state.username = null;
      state.email = null;
      state.isAuthenticated = false;
      state.theme = "light";
      state.language = "en";
    },
    setPluginframe: (state, action: PayloadAction<boolean>) => {
      state.pluginframe = action.payload;
    },
    setOpenPluginwindow: (state, action: PayloadAction<boolean>) => {
      state.openPluginwindow = action.payload;
    },
  },
});

export const {
  setUserId,
  setUsername,
  setEmail,
  setIsAuthenticated,
  setTheme,
  setLanguage,
  resetParams,
  setStep,
  setPluginframe,
  setOpenPluginwindow
} = paramsSlice.actions;

export default paramsSlice.reducer;
