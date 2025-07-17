import React from "react";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import CodeReset from "./pages/CodeReset";
import ForgotPage from "./pages/ForgotPage";
import Driver from "./pages/Driver";

import Sidebar from './Javascript/Sidebar';
import Dashboard from './Javascript/Dashboard';
import Bookings from './Javascript/Bookings';
import Reports from './Javascript/Reports';
import Messages from './Javascript/Messages';
import MyAccount from './Javascript/MyAccount';
import Header from "./Javascript/Header";


import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/HomePage' element={<HomePage/>}/>
      <Route path='/Driver' element={<Driver/>}/>
      <Route path='/CodeReset' element={<CodeReset/>}/>
      <Route path='/ForgotPage' element={<ForgotPage/>}/>
      <Route path='/' element={<AuthPage/>}/>

      <Route path='/Bookings' element={<Bookings/>}/>
      <Route path='/Messages' element={<Messages/>}/>


    </Routes>
    </BrowserRouter>
  );
}

export default App;
