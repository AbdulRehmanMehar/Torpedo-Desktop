import { applyMiddleware, combineReducers, compose, configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import Invoice from './pages/InvoiceManagement/Store/Reducers';

declare global {
  interface Window {
    REDUX_DEVTOOLS_EXTENSION_COMPOSE?: typeof compose;
  }
}

const composeEnhancers = window.REDUX_DEVTOOLS_EXTENSION_COMPOSE || compose;

const store = configureStore({
  reducer: combineReducers({
    Invoice,
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;