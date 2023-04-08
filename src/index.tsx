import { createRoot } from 'react-dom/client';
import { App } from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { DirtSimpleHomePage } from "./routes/DirtSimpleHome/DirtSimpleHome";

const container = document.getElementById('root');
// eslint-disable-next-line
const root = createRoot(container!);
root.render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DirtSimpleHomePage />} />
        <Route path="/app/expensetracker/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </>
);
