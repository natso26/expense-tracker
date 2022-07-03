import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import {HomePage} from "./view/home/HomePage";
import {NewExpensePage} from "./view/new-expense/NewExpensePage";
import {EditExpensePage} from "./view/edit-expense/EditExpensePage";
import {ExportPage} from "./view/export/ExportPage";
import {EditTagRulePage} from "./view/edit-tag-rule/EditTagRulePage";

function App() {
    return (
        <Routes>
            <Route path='/' element={<HomePage/>}></Route>
            <Route path='/new-expense' element={<NewExpensePage/>}></Route>
            <Route path='/edit-expense/:id' element={<EditExpensePage/>}></Route>
            <Route path='/edit-tag-rule/:tag' element={<EditTagRulePage/>}></Route>
            <Route path='/export' element={<ExportPage/>}></Route>
        </Routes>
    )
}

export default App;
