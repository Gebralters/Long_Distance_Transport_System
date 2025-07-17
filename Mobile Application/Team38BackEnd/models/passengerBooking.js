module.exports = (sequelize, DataTypes) => {
  const PassengerBooking = sequelize.define('PassengerBooking', {
    PAS_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    B_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Booking',
        key: 'B_ID',
      },
      allowNull: false,
    },
  }, {
    tableName: 'passenger_booking',
    timestamps: false,
  });

  PassengerBooking.associate = (models) => {
    PassengerBooking.belongsTo(models.Booking, { foreignKey: 'B_ID' });
  };

  return PassengerBooking;
};
