import express from 'express';
import { pool } from './db.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/sign-up', async (req, res) => {
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
  } catch {
    return res.json({ isSuccess: false });
  }
});

app.post('/sign-in', async (req, res) => {
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

    const findUser = rows2[0];
    const isPasswordSame = await bcrypt.compare(password, rows2[0].password);

    if (!isPasswordSame) {
      return res.json({ isSuccess: false });
    }

    const token = await jwt.sign({data: findUser.email}, 'secret', {expiresIn: '3m'});

    return res.json({ isSuccess: true, token });
  } catch {
    return res.json({ isSuccess: false });
  }
});

app.post("/increase-number", async (req, res) => {
  const {count, token} = req.body;
  jwt.verify(token, "secret", async (err, user) => {
    if (err) {
      return res.json({isSuccess: false});
    } else {
      const userEmail = user.email;
      const [rows] = await pool.execute(
          "SELECT COUNT(*) as userCount FROM users WHERE EMAIL = ?",
          [userEmail]
      );
      if (rows[0]['userCount'] === 0) {
        return res.json({isSuccess: false});
      } else {
        return res.json({isSuccess: true, count: count + 1});
      }
    }
  })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
