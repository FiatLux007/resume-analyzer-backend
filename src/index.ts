// src/index.ts
import express from 'express';
import resumeRoutes from './routes/resumeRoutes';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/resume', resumeRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));