module.exports = (sequelize, DataTypes) => {
  const RideIncident = sequelize.define('RideIncident', {
    RI_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    R_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    C_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RI_DESCRIPTION: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    RI_DATETIME: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  RideIncident.associate = (models) => {
    RideIncident.belongsTo(models.Ride, { foreignKey: 'R_ID' });
    RideIncident.belongsTo(models.Customer, { foreignKey: 'C_ID' });
  };

  return RideIncident;
};
