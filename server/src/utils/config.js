require('dotenv').config()

const PORT = process.env.PORT

module.exports = {
  pgUser: process.env.PGUSER,
  pgDatabase: process.env.PGDATABASE,
  pgPassword: process.env.PGPASSWORD,
  pgPort: process.env.PGPORT,
  pgHost: process.env.PGHOST,
  PORT
}