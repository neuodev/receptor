import { Sequelize, DataTypes } from "sequelize";

export const sequelize = new Sequelize(
  process.env.PSQL_URI || "postgres://postgres:changeme@localhost:5432/receptor"
);

export const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

// Check database connection
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });

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
