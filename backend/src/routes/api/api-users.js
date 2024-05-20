import express from "express";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  //check if user already exists
  db.get("SELECT * FROM users WHERE username = ?", [email], async (err, row) => {
    if (err) {
      return res.status(500).json({ msg: "Database error" });
    }
    if (row) {
      return res.status(400).json({ msg: "User already exists" });
    }
  });

  //encrypt password

  // Insert new user into the database
  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    function (err) {
      if (err) {
        return res.status(500).json({ msg: "Database error" });
      }

      // Create a payload for JWT
      const payload = {
        user: {
          id: this.lastID
        }
      };

      // Sign the token and send it to the client
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    }
  );
});
