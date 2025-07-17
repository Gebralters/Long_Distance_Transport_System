module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    PAY_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    PAY_AMOUNT: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    PAY_DATE: {
      type: DataTypes.DATE,
      allowNull: false
    },
    C_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Customer',
        key: 'C_ID'
      }
    },
    B_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Booking',
        key: 'B_ID'
      }
    }
  }, {
    tableName: 'PAYMENT',
    timestamps: false
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Customer, { foreignKey: 'C_ID' });
    Payment.belongsTo(models.Booking, { foreignKey: 'B_ID' });
  };

  return Payment;
};
