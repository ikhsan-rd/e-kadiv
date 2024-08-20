export const allowedRoles = {
    keuangan: {
        '/keuangan/*': ['Admin','Kadiv']
    },
    team: {
        '/database/team/table': ['Puspendiv','Pelatih','Admin','Kadiv'],
        '/database/team/*': ['Admin','Kadiv']
    },
    jadwal: {
        '/database/jadwal/table': [,'Puspendiv','Pelatih','Admin','Kadiv'],
        '/database/jadwal/*': ['Admin','Kadiv']
    },
    sarana: {
        '/database/sarana/table': ['Puspendiv','Pelatih','Admin','Kadiv'],
        '/database/sarana/*': ['Admin','Kadiv']
    },
    presensi: {
        '/database/presensi/table': ['Puspendiv','Pelatih','Admin','Kadiv'],
        '/database/presensi/*': ['Admin','Kadiv']
    },
    akun: {
        '/database/akun/table': ['Kadiv','Admin','Puspendiv'],
        '/database/akun/*': ['Admin','Puspendiv']
    },
    performaDivisi: {
        '/performa/divisi': ['Kadiv','Admin','Puspendiv'],
    },
    performaTeam: {
        '/performa/team': ['Kadiv','Admin','Puspendiv','Pelatih'],
    },
    performaAtlet: {
        '/performa/atlet': ['Kadiv','Admin','Puspendiv','Pelatih'],
    }
};
