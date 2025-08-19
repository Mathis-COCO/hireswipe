import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './pages/App';
import reportWebVitals from './reportWebVitals';
import './styles/global.scss';
import AuthForm from './pages/Auth/AuthPage';
import Onboarding from './pages/Onboarding/Onboarding';
import EditOffer from './pages/EditOffer/EditOffer';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/messages" element={<App />} />
        <Route path="/likes" element={<App />} />
        <Route path="/profile" element={<App />} />
        <Route path="/mes-offres" element={<App />} />
        <Route path="/ajouter-offre" element={<App />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/mes-offres/:id/edit" element={<EditOffer />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<div>Page non trouvée</div>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
