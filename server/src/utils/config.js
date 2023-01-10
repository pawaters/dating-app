require('dotenv').config()

const PORT = process.env.PORT

const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

module.exports = {
  pgUser: process.env.PGUSER,
  pgDatabase: process.env.PGDATABASE,
  pgPassword: process.env.PGPASSWORD,
  pgPort: process.env.PGPORT,
  pgHost: process.env.PGHOST,
  PORT,
  EMAIL_ADDRESS,
  EMAIL_PASSWORD
}