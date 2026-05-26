import express from 'express';
import { createReport, getAllReports, fetchReportsByUser } from '../controllers/reportController.js';
import { upload, processCloudUpload } from '../middlewares/uploadMiddleware.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllReports);
router.get('/me', verifyToken, fetchReportsByUser);

// Pipeline upload file wajib menyertakan processCloudUpload[cite: 3, 4]
router.post('/', verifyToken, upload.single('foto'), processCloudUpload, createReport);

export default router;