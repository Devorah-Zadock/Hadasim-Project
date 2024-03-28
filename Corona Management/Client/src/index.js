import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter, Routes, Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './Home';
import MemberDetails from './MemberDetails';
import CoronaDetails from './CoronaDetails';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/MemberDetails/:memberId",
    element: <MemberDetails />,
  },
  {
    path: "/CoronaDetails/:memberId",
    element: <CoronaDetails />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
