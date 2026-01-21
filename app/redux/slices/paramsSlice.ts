import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SelectedPlugin {
  _id: string;
  name?: string;
  price: number;
  description?: string;
  icon?: string;
  category?: string;
  duration?: number;
  type?: string;
  membershipName?: string;
  plan?: string
}

interface ParamsState {
  userId: string | null;
  username: string | null;
  email: string | null;
  isAuthenticated: boolean;
  theme: "light" | "dark";
  language: string;
  step: number;
  pluginframe: boolean;
  openPluginwindow: string;
  searchQuery: string;
  selectedPlugins: SelectedPlugin[];
  selectedPlugin: SelectedPlugin | null;
  serverName: string;
  selectedServerPlan: any;
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
  openPluginwindow: "",
  searchQuery: "",
  selectedPlugins: [],
  selectedPlugin: null,
  serverName: "",
  selectedServerPlan: null,
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
    setOpenPluginwindow: (state, action: PayloadAction<string>) => {
      state.openPluginwindow = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedPlugins: (state, action: PayloadAction<SelectedPlugin>) => {
      const exists = state.selectedPlugins.some(
        (plugin) => plugin._id === action.payload._id
      );
      if (!exists) {
        state.selectedPlugins.push(action.payload);
      }
    },
    setSelectedPlugin: (state, action: PayloadAction<SelectedPlugin | null>) => {
      state.selectedPlugin = action.payload;
    },
    removeSelectedPlugin: (state, action: PayloadAction<string>) => {
      state.selectedPlugins = state.selectedPlugins.filter(
        (plugin) => plugin._id !== action.payload
      );
    },
    clearSelectedPlugins: (state) => {
      state.selectedPlugins = [];
      state.serverName = "";
      state.selectedServerPlan = null;
      state.step = 1;
    },
    updateSelectedPlugin: (state, action: PayloadAction<SelectedPlugin>) => {
      const index = state.selectedPlugins.findIndex(
        (plugin) => plugin._id === action.payload._id
      );
      if (index !== -1) {
        state.selectedPlugins[index] = action.payload;
      }
    },
    setServerName: (state, action: PayloadAction<string>) => {
      state.serverName = action.payload;
    },
    setSelectedServerPlan: (state, action: PayloadAction<any>) => {
      state.selectedServerPlan = action.payload;
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
  setOpenPluginwindow,
  setSearchQuery,
  setSelectedPlugins,
  removeSelectedPlugin,
  clearSelectedPlugins,
  setSelectedPlugin,
  updateSelectedPlugin,
  setServerName,
  setSelectedServerPlan,
} = paramsSlice.actions;

export default paramsSlice.reducer;
