import express from 'express';
import { createStatus, getStatusList, updateStatus } from '../controllers/status.js';

const routerStatus = express.Router();

routerStatus.post('/status', createStatus);
routerStatus.get('/status', getStatusList);
routerStatus.patch("/status/:id", updateStatus);

export default routerStatus;
