import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes.js';
import { crearTablaUsuarios, crearTablaClientes } from './src/models/userModel.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await crearTablaUsuarios();
    await crearTablaClientes();
    console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});