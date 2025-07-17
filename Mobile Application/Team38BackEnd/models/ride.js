module.exports = (sequelize, DataTypes) => {
  const Ride = sequelize.define('Ride', {
    R_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    R_STATUS: {
      type: DataTypes.STRING,
      allowNull: false
    },
    D_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'DRIVER',
        key: 'D_ID'
      }
    },
    RB_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'RIDE_BOOKING',
        key: 'RB_ID'
      }
    },
    RO_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'ROUTE',
        key: 'RO_ID'
      }
    },
    }, {
    tableName: 'RIDE',
    timestamps: false
  });

  Ride.associate = (models) => {
    Ride.belongsTo(models.Driver, { foreignKey: 'D_ID' });
    Ride.belongsTo(models.RideBooking, { foreignKey: 'RB_ID' });
    Ride.belongsTo(models.Route, { foreignKey: 'RO_ID' });
    Ride.hasMany(models.RideFeedback, { foreignKey: 'R_ID' });
    Ride.hasMany(models.Booking, { foreignKey: 'RB_ID' });
    Ride.hasMany(models.Chat, { foreignKey: 'R_ID' }); 
  };

  return Ride;
};
