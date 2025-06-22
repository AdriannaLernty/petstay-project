const bcrypt = require('bcryptjs');

const plainPassword = 'Admin123!'; // change if you want
bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) throw err;
  console.log("Hashed password:", hash);
});
