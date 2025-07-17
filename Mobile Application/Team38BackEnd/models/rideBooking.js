module.exports = (sequelize, DataTypes) => {
  const RideBooking = sequelize.define('RideBooking', {
    RB_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    RB_NUMBOOKINGS: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'RIDE_BOOKING', 
    timestamps: false
  });

  RideBooking.associate = (models) => {
    RideBooking.hasMany(models.Booking, { foreignKey: 'RB_ID' });
    RideBooking.hasOne(models.Ride, { foreignKey: 'RB_ID' });
  };

  return RideBooking;
};
