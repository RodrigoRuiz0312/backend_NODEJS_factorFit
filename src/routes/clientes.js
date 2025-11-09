import express from 'express';
import { registrarCliente } from '../controllers/clientesController.js';
const router = express.Router();

router.post('/', registrarCliente);

export default router;