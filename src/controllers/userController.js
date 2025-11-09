import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const generarToken = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Registro
export const registrarCliente = async (req, res) => {
  const { nombre, apellidos, fechaNacimiento, telefono, email, password } = req.body;

  try {
    // Verificar si el correo ya existe
    const existe = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    // 1️⃣ Registrar en usuarios
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await pool.query(
      'INSERT INTO usuarios (email, password, rol) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, 'cliente']
    );

    const usuarioId = nuevoUsuario.rows[0].id;

    // 2️⃣ Registrar en clientes
    await pool.query(
      `INSERT INTO clientes (usuario_id, nombre, apellidos, fecha_nacimiento, telefono, sede)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [usuarioId, nombre, apellidos, fechaNacimiento, telefono, 'principal']
    );

    res.status(201).json({
      mensaje: 'Cliente registrado correctamente',
      usuario: nuevoUsuario.rows[0]
    });
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    res.status(500).json({ error: 'Error al registrar cliente', detalle: error.message });
  }
};

// Login
export const loginCliente = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const usuario = result.rows[0];
    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = generarToken(usuario.id, usuario.rol);
    res.json({ mensaje: 'Login exitoso', token, usuario });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión', detalle: error.message });
  }
};