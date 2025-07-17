// models/parcelDimensions.js
module.exports = (sequelize, DataTypes) => {
  const ParcelDimensions = sequelize.define('ParcelDimensions', {
    PDI_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    PDI_LENGTH: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    PDI_WIDTH: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    PDI_HEIGHT: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    P_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'parcel_booking',
        key: 'P_ID',
      },
    },
  }, {
    tableName: 'P_DIMENSIONS',
    timestamps: false,
  });

  ParcelDimensions.associate = (models) => {
    ParcelDimensions.belongsTo(models.ParcelBooking, { foreignKey: 'P_ID' });
  };

  return ParcelDimensions;
};
