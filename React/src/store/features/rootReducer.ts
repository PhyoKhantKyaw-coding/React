import { combineReducers } from "@reduxjs/toolkit"
import LoaderSlice from "./loaderSlice"
import  adminSidebarSlice  from "./adminSidebarSlice"
import cart from "./addtoCardSlice"
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ['cart'], 
};

const rootReducer = combineReducers({
	loader: LoaderSlice,
	adminSidebar: adminSidebarSlice,
	cart: cart,
})

export const persistedReducer = persistReducer(persistConfig, rootReducer);