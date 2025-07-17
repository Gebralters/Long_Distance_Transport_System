module.exports = (sequelize, DataTypes) => {
  const ParcelBooking = sequelize.define('ParcelBooking', {
    P_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    P_STATUS: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Approved', 'Pending', 'Rejected']]
      }
    },
    P_OTP: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    P_CATID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ParcelCategory',
        key: 'P_CATID'
      }
    },
    B_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Booking',
        key: 'B_ID'
      }
    },
    P_RECIPIENTNAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    P_RECIPIENTCONTACT: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'parcel_booking',
    timestamps: false,
  });

  ParcelBooking.associate = (models) => {
    ParcelBooking.belongsTo(models.ParcelCategory, { foreignKey: 'P_CATID' });
    ParcelBooking.belongsTo(models.Booking, { foreignKey: 'B_ID' });
    ParcelBooking.hasMany(models.ParcelImage, { foreignKey: 'P_ID' });
    ParcelBooking.hasOne(models.ParcelDimensions, { foreignKey: 'P_ID' });
  };

  return ParcelBooking;
};
