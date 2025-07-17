module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    C_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    U_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'USER',
        key: 'U_ID'
      }
    }
  }, {
    tableName: 'CUSTOMER',
    timestamps: false
  });

  Customer.associate = (models) => {
    Customer.belongsTo(models.User, { foreignKey: 'U_ID' });
    Customer.hasMany(models.Booking, { foreignKey: 'C_ID' });
    Customer.hasMany(models.Payment, { foreignKey: 'C_ID' });
    Customer.hasMany(models.ParcelBooking, { foreignKey: 'C_ID' });
  };

  return Customer;
};
