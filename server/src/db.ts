import { Sequelize } from "sequelize";
import { flush, seedDB } from "./seed";

const DB_NAME = process.env.DB_NAME || "receptor";

const sequelize = new Sequelize(
  process.env.PSQL_URI ||
    `postgres://postgres:changeme@localhost:5432/${DB_NAME}`
);
// Check database connection
(async () => {
  try {
    await Promise.all([
      sequelize.authenticate(),
      sequelize.sync({ force: false }),
    ]);
    console.log("Connected to PostgreSQL".green.underline.bold);
  } catch (error) {
    if (error instanceof Error)
      console.log(
        `Unable to connection to the database: ${error.message}`.red.underline
          .bold
      );

    process.exit(1);
  }
})();

export default sequelize;
