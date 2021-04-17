import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", (req, res) => {
  const { credentials } = req.body;

  if (
    credentials.username == process.env.CRED_USERNAME &&
    credentials.password == process.env.CRED_PASSWORD
  ) {
    res.json({ user: toAuthJSON(credentials.username) });
  } else {
    res.status(400).json({ errors: { global: "Hibás bejelentkezési adatok" } });
  }
});

function toAuthJSON(username) {
  return { username: username, token: generateJWT(username) };
}

function generateJWT(username) {
  return jwt.sign(
    {
      username: username,
    },
    process.env.JWT_SECRET
  );
}

export default router;
