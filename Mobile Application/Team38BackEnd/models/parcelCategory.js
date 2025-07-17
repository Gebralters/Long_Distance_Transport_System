module.exports = (sequelize, DataTypes) => {
  const ParcelCategory = sequelize.define('ParcelCategory', {
    P_CATID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    P_DISCRIP: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'parcel_category',
    timestamps: false,
  });

  return ParcelCategory;
};
