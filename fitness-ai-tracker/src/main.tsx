import './assets/main.scss';

import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import React from "react";
import ReactDOM from "react-dom/client";
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);



//providor conntect the redux store to entire app