import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import {HomePage} from "./view/home-page/HomePage";
import {NewExpensePage} from "./view/new-expense-page/NewExpensePage";
import {EditExpensePage} from "./view/edit-expense-page/EditExpensePage";
import {SummaryPage} from "./view/summary-page/SummaryPage";
import {EditTagRulePage} from "./view/edit-tag-rule-page/EditTagRulePage";

function App() {
    return (
        <Routes>
            <Route path='/' element={<HomePage/>}></Route>
            <Route path='/new-expense' element={<NewExpensePage/>}></Route>
            <Route path='/edit-expense/:id' element={<EditExpensePage/>}></Route>
            <Route path='/edit-tag-rule/:tag' element={<EditTagRulePage/>}></Route>
            <Route path='/summary' element={<SummaryPage/>}></Route>
        </Routes>
    )
}

export default App;
