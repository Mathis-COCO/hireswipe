import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './pages/App';
import reportWebVitals from './reportWebVitals';
import './styles/global.scss';
import AuthForm from './pages/Auth/AuthPage';
import Onboarding from './pages/Onboarding/Onboarding';
import EditOffer from './pages/EditOffer/EditOffer';
import OfferDetail from './pages/MyOffers/OfferDetail';
import SeeCandidates from './pages/SeeCandidates/SeeCandidates';
import SeeOfferCandidate from './pages/SeeOfferCandidate/SeeOfferCandidate';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ViewProfile from './pages/Profile/ViewProfile/ViewProfile';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route
          path="/likes"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mes-offres"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ajouter-offre"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mes-offres/:offerId/edit"
          element={
            <ProtectedRoute>
              <EditOffer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mes-offres/:offerId"
          element={
            <ProtectedRoute>
              <OfferDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mes-offres/:offerId/candidats"
          element={
            <ProtectedRoute>
              <SeeCandidates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mes-offres/:offerId/candidats/:candidateId"
          element={
            <ProtectedRoute>
              <SeeOfferCandidate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:id"
          element={
            <ProtectedRoute>
              <ViewProfile />
            </ProtectedRoute>
          }
        />
  <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);




reportWebVitals();
