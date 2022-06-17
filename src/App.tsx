import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import {HomePage} from "./pages/HomePage";
import {NewExpensePage} from "./pages/NewExpensePage";
import {EditExpensePage} from "./pages/EditExpensePage";
import {ManageTagsPage} from "./pages/ManageTagsPage";

function App() {
    return (
        <Routes>
            <Route path='/' element={<HomePage/>}></Route>
            <Route path='/new-expense' element={<NewExpensePage/>}></Route>
            <Route path='/edit-expense/:id' element={<EditExpensePage/>}></Route>
            <Route path='/manage-tags' element={<ManageTagsPage/>}></Route>
        </Routes>
    )
}

export default App;
