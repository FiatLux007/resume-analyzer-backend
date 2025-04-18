import express from 'express';
import resumeRoutes from './routes/resumeRoutes';
import cors from 'cors';

const app = express();
app.use(express.json());

app.use('/api/resume', resumeRoutes);

// ✅ 添加 CORS 支持
app.use(cors({
    origin: '*', // 或者改成具体 origin，比如 'https://www.linkedin.com'
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
  }));

// 其他中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


