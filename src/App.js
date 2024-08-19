import React from 'react';
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom';
import './css/app.scss';

import Dashboard from './component/Base/Dashboard';
import NavigationBar from './component/Base/Navbar';
import Login from './component/Login/Login';
import TeamForm from './component/Team/TeamForm';
import AkunForm from './component/Akun/AkunForm';
import JadwalForm from './component/Jadwal/JadwalForm';
import SaranaForm from './component/Sarana/SaranaForm';
import PresensiForm from './component/Presensi/PresensiForm';
import DanaForm from './component/Dana/DanaForm';
import NotFound from './component/Base/NotFound';
import ProtectedRoute from './protectedRoute';
import PerformaDivisi from './component/Performa/Divisi';
import PerformaTeam from './component/Performa/Team';

function App()
{
  const token = localStorage.getItem("token")

  return (
    <BrowserRouter>
      <div id="app">
        <header>
          <NavigationBar />
        </header>
        <main id="main" className="container-fluid">
          <Routes>
            <Route
              path="/"
              element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={token ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/database/team/*" element={<ProtectedRoute element={<TeamForm />} />} />
            <Route path="/database/akun/*" element={<ProtectedRoute element={<AkunForm />} />} />
            <Route path="/database/jadwal/*" element={<ProtectedRoute element={<JadwalForm />} />} />
            <Route path="/database/sarana/*" element={<ProtectedRoute element={<SaranaForm />} />} />
            <Route path="/database/presensi/*" element={<ProtectedRoute element={<PresensiForm />} />} />
            <Route path="/keuangan/*" element={<ProtectedRoute element={<DanaForm />} />} />
            <Route path="/performa/divisi/*" element={<ProtectedRoute element={<PerformaDivisi />} />} />
            <Route path="/performa/team/*" element={<ProtectedRoute element={<PerformaTeam />} />} />
            <Route path="/NotFound" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/NotFound" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
