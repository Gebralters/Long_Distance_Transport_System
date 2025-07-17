module.exports = (sequelize, DataTypes) => {
  const PaymentDetails = sequelize.define('PaymentDetails', {
    PD_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    PD_CARDNUMBER: {
      type: DataTypes.STRING,
      allowNull: false
    },
    PD_EXPIRYDATE: {
      type: DataTypes.STRING,
      allowNull: false
    },
    PD_CVV: {
      type: DataTypes.STRING,
      allowNull: false
    },
    PD_CARDHOLDERNAME: {
      type: DataTypes.STRING,
      allowNull: false
    },
    PD_LAST4: {
      type: DataTypes.STRING,
      allowNull: false
    },
    C_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Customer',
        key: 'C_ID'
      },
      allowNull: false
    }
  }, {
    tableName: 'PAYMENT_DETAILS',
    timestamps: false
  });

  PaymentDetails.associate = (models) => {
    PaymentDetails.belongsTo(models.Customer, { foreignKey: 'C_ID' });
  };

  return PaymentDetails;
};
