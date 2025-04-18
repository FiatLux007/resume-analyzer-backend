import express from 'express';
import multer from 'multer';
import { analyzeResume, uploadResume } from '../controllers/resumeController';


const router = express.Router();

// Setup Multer (stores file in memory for now)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// New route for PDF upload
router.post('/upload', upload.single('file'), uploadResume);

export default router;
