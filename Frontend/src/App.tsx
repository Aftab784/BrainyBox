import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ContentPage from './pages/ContentPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/content"
          element={
            <ProtectedRoute>
              <ContentPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster richColors />
    </BrowserRouter>
  );
}

export default App;