import React,{ useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { SansWelcome } from '../ComponentCustom/SansComps';

function Dashboard()
{
    const [showWelcome,setShowWelcome] = useState(false);

    useEffect(() =>
    {
        const itemStr = sessionStorage.getItem('loginBerhasil');
        if (!itemStr)
        {
            return;
        }

        const item = JSON.parse(itemStr);
        const now = new Date();

        if (now.getTime() > item.expiry)
        {
            sessionStorage.removeItem('loginBerhasil');
        } else
        {
            setShowWelcome(true);
        }
    },[]);

    const handleCloseWelcome = () =>
    {
        setShowWelcome(false);
        sessionStorage.removeItem('loginBerhasil');
    }

    return (
        <>
            <Container className="mt-4" style={{ textAlign: 'center',color: 'white' }}>
                <h1>SELAMAT DATANG DI E-KADIV</h1>
                <h5>Website pengelolaan divisi olahraga UKM SPORT UNISKA</h5>
                <hr />
                <p style={{ textAlign: 'justify' }}>
                    E-KADIV adalah platform website inovatif yang bertujuan untuk
                    menyediakan solusi terpadu bagi koordinator divisi (kadiv)
                    dan pusat pengembangan divisi (puspendiv) olahraga UKM SPORT
                    UNISKA dalam mengelola secara komprehensif divisi-divisi olahraga
                    mereka. Dengan fokus pada efisiensi dan efektivitas, website ini
                    memungkinkan para pengguna untuk melakukan manajemen dan koordinasi
                    yang lebih baik terhadap sumber daya manusia, kegiatan, dan
                    berbagai aspek administratif lainnya yang terkait dengan pengelolaan
                    divisi olahraga di universitas. Melalui fitur-fiturnya,
                    E-KADIV memfasilitasi pengelolaan data, pelaporan, serta
                    interaksi antaranggota tim dengan cara yang intuitif
                    dan terintegrasi, membantu meningkatkan produktivitas
                    dan kualitas pengelolaan divisi olahraga secara keseluruhan.
                </p>
            </Container>

            <SansWelcome
                show={showWelcome}
                onHide={handleCloseWelcome}
            />
        </>
    );
}

export default Dashboard;
