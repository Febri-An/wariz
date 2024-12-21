import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Form from './pages/Form';

export default function App() {
  return (
      <Router basename="/">
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/form" element={<Form />} />
              {/* <Route path="/form/dept" element={<Form />} />
              <Route path="/form/result" element={<Form />} />
              <Route path="/form/service" element={<Form />} /> */}
          </Routes>
      </Router>
  );
}