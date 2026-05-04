import { 
    createReport as insertReportToDB, 
    fetchAllReports, 
    fetchReportsByUser as getReportsFromDB 
} from '../models/reportModel.js';

export const createReport = async (req, res) => {
    try {
        const { deskripsi, kategori, latitude, longitude } = req.body;
        const id_pelapor = req.user.id; // Diambil dari middleware verifyToken[cite: 4]

        // Ambil nama file dari middleware GCS[cite: 4]
        let foto = req.file ? req.file.gcsObjectName : null; 

        if (!deskripsi || !latitude || !longitude) {
            return res.status(400).json({ message: "Deskripsi dan koordinat lokasi wajib diisi!" });
        }

        const newReport = await insertReportToDB(
            id_pelapor, 
            kategori, 
            deskripsi, 
            longitude, 
            latitude, 
            foto
        );

        res.status(201).json({ message: 'Laporan berhasil dikirim ke Cloud!', data: newReport });
    } catch (error) {
        console.error("Error GCS/DB:", error);
        res.status(500).json({ message: 'Gagal memproses laporan', error: error.message });
    }
};

export const getAllReports = async (req, res) => {
    try {
        const reports = await fetchAllReports();
        res.status(200).json({ message: 'Data semua laporan berhasil dimuat', data: reports });
    } catch (error) {
        res.status(500).json({ message: 'Error server', error: error.message });
    }
};

export const fetchReportsByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const reports = await getReportsFromDB(userId);
        res.status(200).json({ message: 'Riwayat laporan berhasil dimuat', data: reports });
    } catch (error) {
        res.status(500).json({ message: 'Error server', error: error.message });
    }
};