import { pool } from '../config/db.js';

export const crearTablaUsuarios = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      rol VARCHAR(50) DEFAULT 'cliente'
    )
  `);
};

export const crearTablaClientes = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS clientes (
      id SERIAL PRIMARY KEY,
      usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
      nombre VARCHAR(100) NOT NULL,
      apellidos VARCHAR(100) NOT NULL,
      fecha_nacimiento DATE,
      telefono VARCHAR(20),
      sede VARCHAR(100),
      fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};