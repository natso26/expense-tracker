import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import {HomePage} from "./pages/HomePage";
import {NewExpensePage} from "./pages/NewExpensePage";
import {EditExpensePage} from "./pages/EditExpensePage";

function App() {
    return (
        <Routes>
            <Route path='/' element={<HomePage/>}></Route>
            <Route path='/new-expense' element={<NewExpensePage/>}></Route>
            <Route path='/edit-expense/:id' element={<EditExpensePage/>}></Route>
        </Routes>
    )
}

export default App;
