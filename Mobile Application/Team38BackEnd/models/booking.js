module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    B_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    B_DATETIME: {
      type: DataTypes.DATE,
      allowNull: false
    },
    B_PICKUPLOCATION: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    B_DESTLOCATION: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    B_NUMBOOKING: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    B_STATUS: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    B_TYPE: {
      type: DataTypes.INTEGER,
      allowNull: false // 1 for Passenger Booking, 2 for Parcel Booking
    },
    C_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Customer',
        key: 'C_ID'
      }
    },
    BS_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'BookingSlot',
        key: 'BS_ID'
      }
    },
    RB_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'RideBooking',
        key: 'RB_ID'
      }
    },
    totalPrice: {  // Add the totalPrice attribute
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: 'BOOKING',
    timestamps: false
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.Customer, { foreignKey: 'C_ID' });
    Booking.belongsTo(models.BookingSlot, { foreignKey: 'BS_ID' });
    Booking.belongsTo(models.RideBooking, { foreignKey: 'RB_ID' });
    Booking.hasMany(models.Payment, { foreignKey: 'B_ID' });
    Booking.belongsTo(models.Ride, { foreignKey: 'RB_ID' });
    Booking.hasOne(models.ParcelBooking, { foreignKey: 'B_ID' });
  };

  return Booking;
};
