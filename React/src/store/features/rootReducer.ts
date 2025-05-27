import { combineReducers } from "@reduxjs/toolkit"
import LoaderSlice from "./loaderSlice"
import  adminSidebarSlice  from "./adminSidebarSlice"
import cart from "./addtoCardSlice"

export const rootReducer = combineReducers({
	loader: LoaderSlice,
	adminSidebar: adminSidebarSlice,
	cart: cart,
})
