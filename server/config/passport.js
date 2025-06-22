const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const name = profile.displayName;

      try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        let user = rows[0];

        if (!user) {
          await db.query("INSERT INTO users (name, email, role) VALUES (?, ?, ?)", [name, email, "user"]);
          const [newUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
          user = newUser[0];
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  done(null, rows[0]);
});
