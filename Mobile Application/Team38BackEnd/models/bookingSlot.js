module.exports = (sequelize, DataTypes) => {
  const BookingSlot = sequelize.define('BookingSlot', {
    BS_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    BS_DATETIME: {
      type: DataTypes.DATE,
      allowNull: false
    },
    BS_PICKUPRADIUS: {
      type: DataTypes.STRING,
      allowNull: false
    },
    BS_DESTRADIUS: {
      type: DataTypes.STRING,
      allowNull: false
    },
    BS_AVAILSEATS: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    BS_STATUS: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Available', 'Unavailable', 'Accepted']]
      }
    },
    BS_PICKUPTIME: {
      type: DataTypes.TIME,
      allowNull: false
    },
    BS_ARRIVALTIME: {
      type: DataTypes.TIME,
      allowNull: false
    },
    BS_PARCELPRICE: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    BS_PASSPRICE: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    D_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Driver',
        key: 'D_ID'
      }
    }
  }, {
    tableName: 'BOOKINGSLOT',
    timestamps: false,
  });

  BookingSlot.associate = (models) => {
    BookingSlot.hasMany(models.Booking, { foreignKey: 'BS_ID' });
    BookingSlot.belongsTo(models.Driver, { foreignKey: 'D_ID' });
  };

  return BookingSlot;
};
