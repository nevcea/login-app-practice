import express from 'express';
import { pool } from './db.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.execute(
      "SELECT COUNT(*) as userCount FROM users WHERE email = ?",
      [email]
    );

    if (rows[0]['userCount'] === 1) {
      return res.json({ isSuccess: false });
    }

    const cryptedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, cryptedPassword]
    );

    return res.json({ isSuccess: true });
  } catch (e) {
    return res.json({ isSuccess: false });
  }
});

app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.execute(
      "SELECT COUNT(*) as userCount FROM users WHERE email = ?",
      [email]
    );

    if (rows[0]['userCount'] === 0) {
      return res.json({ isSuccess: false });
    }

    const [rows2] = await pool.execute(
      "SELECT email, password FROM users WHERE email = ?",
      [email]
    );

    const findUser = row2[0];
    const isPasswordSame = await bcrypt.compare(password, rows2[0].password);

    if (!isPasswordSame) {
      return res.json({ isSuccess: false });
    }

    const token = await jwt.sign({data: findUser.email}, 'secret', {expiresIn: '3m'});

    return res.json({ isSuccess: true, token });
  } catch (e) {
    return res.json({ isSuccess: false });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
