import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import PerformaDivisi from './component/Performa/Divisi';
import PerformaTeam from './component/Performa/Team';
import NotFound from './component/Base/NotFound';


function App() {
  // const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <div id="app">
        <header>
          <NavigationBar />
        </header>
        <main id="main" className="container-fluid">
          <Routes>
            {/* <Route
              path="/"
              element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
            /> */}
            <Route path="/login" element={ <Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/database/team/*" element={<TeamForm />} />
            <Route path="/database/akun/*" element={<AkunForm />} />
            <Route path="/database/jadwal/*" element={<JadwalForm />}/>
            <Route path="/database/sarana/*"  element={<SaranaForm />}  />
            <Route path="/database/presensi/*" element={<PresensiForm />} />
            <Route path="/performa/divisi/*" element={<PerformaDivisi />} />
            <Route path="/performa/team/*" element={<PerformaTeam />} />
            <Route path="/keuangan/*" element={<DanaForm />}/>
            {/* <Route path="/NotFound" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/NotFound" />} /> */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
