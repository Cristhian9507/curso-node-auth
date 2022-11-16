const bcrypt = require('bcrypt');

async function verifyPassword() {

  const myPassword = 'admin 123.';
  const hash = '$2b$10$ISJuD0s.BfywFL334y/u5egCQ6Fc5SFdQT0vwkqzvmp.ZjJlFKf0e';
  const isMatch = await bcrypt.compare(myPassword, hash);
  console.log(isMatch);
}

verifyPassword();
