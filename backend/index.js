import express from 'express';
import cors from 'cors';
import config from './config.js';
import parameterRoutes from './routes/parameter-routes.js';
import authRoutes from './routes/auth-routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', parameterRoutes.routes);
app.use('/api', authRoutes.routes);

app.listen(config.port, () => {
    console.log(`App is listening on url http://localhost:${config.port}`);
});