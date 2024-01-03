import express from 'express';
import { createMaterial, getMaterial, getMaterialList, removeMaterial, updateMaterial } from '../controllers/materials.js';

const routerMaterial = express.Router();

routerMaterial.post('/materials', createMaterial);
routerMaterial.get('/materials', getMaterialList);
routerMaterial.patch("/materials/:id", updateMaterial);
routerMaterial.get("/materials/:id", getMaterial);
routerMaterial.delete("/materials/:id", removeMaterial);
export default routerMaterial;
