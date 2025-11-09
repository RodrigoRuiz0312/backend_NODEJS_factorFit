import express from 'express';
import { registrarCliente, loginCliente } from '../controllers/userController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/registro', registrarCliente);
router.post('/login', loginCliente);

router.get('/perfil', verificarToken, (req, res) => {
  res.json({ mensaje: `Bienvenido, usuario ID ${req.usuario.id}` });
});

export default router;