import { Sequelize } from "sequelize";

const DB_NAME = process.env.DB_NAME || "receptor";
const sequelize = new Sequelize(
  process.env.PSQL_URI ||
    `postgres://postgres:changeme@localhost:5432/${DB_NAME}`
);

export default sequelize;
