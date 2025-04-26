import './assets/main.scss';

import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import React from "react";
import ReactDOM from "react-dom/client";
import App from './App.tsx';
import { fetchMe, setToken } from './features/user/userSlice.ts';


const token = localStorage.getItem('token')
if(token) {
    store.dispatch(setToken(token))
    store.dispatch(fetchMe())
}
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);



//providor conntect the redux store to entire app