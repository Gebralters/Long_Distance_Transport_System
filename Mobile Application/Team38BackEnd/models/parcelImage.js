// models/parcelImage.js
module.exports = (sequelize, DataTypes) => {
  const ParcelImage = sequelize.define('ParcelImage', {
    PIMG_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    PIMG_URLIMG: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    P_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ParcelBooking',
        key: 'P_ID',
      },
    },
  }, {
    tableName: 'parcel_img',
    timestamps: false,
  });

  ParcelImage.associate = (models) => {
    ParcelImage.belongsTo(models.ParcelBooking, { foreignKey: 'P_ID' });
  };

  return ParcelImage;
};
