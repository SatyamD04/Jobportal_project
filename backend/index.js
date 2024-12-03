import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config({});
import connectDB from './utils/db.js';
import userRoute from './routers/user.router.js';
import companyRoute from './routers/company.router.js';
import jobRoute from './routers/job.router.js';
import applicationRoute from './routers/application.router.js';

import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;
const _dirname = path.resolve();//----to get path----

//widdleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
}
app.use(cors(corsOptions));



//api's
app.use('/api/v1/users', userRoute);
app.use('/api/v1/company', companyRoute);
app.use('/api/v1/job', jobRoute);
app.use('/api/v1/application', applicationRoute);

//--- connect frontend files---
app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get('*', (_, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
})

app.listen(PORT, () => {
    connectDB();
    //console.log(`server is running on port ${PORT}`);
})