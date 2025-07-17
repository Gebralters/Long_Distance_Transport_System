module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('Driver', {
    D_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    D_STATUS: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Active', 'Inactive']],
      },
    },
    D_VSTATUS: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isIn: [['Verified', 'Unverified']],
      },
    },
    U_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    D_LATITUDE: {
      type: DataTypes.DECIMAL(9, 6), 
      allowNull: true,
    },
    D_LONGITUDE: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
    },
  }, {
    tableName: 'driver',
    timestamps: false,
  });

  Driver.associate = (models) => {
    Driver.belongsTo(models.User, { foreignKey: 'U_ID' });
    Driver.hasOne(models.Vehicle, { foreignKey: 'D_ID' });
    Driver.hasMany(models.BookingSlot, { foreignKey: 'D_ID' });
    Driver.hasOne(models.DProfile, { foreignKey: 'D_ID' });
    Driver.hasMany(models.DriverRating, { foreignKey: 'D_ID' });
  };

  return Driver;
};
