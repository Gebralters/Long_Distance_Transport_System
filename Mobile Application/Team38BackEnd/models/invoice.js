module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    INV_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    INV_PAYDATE: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    INV_TOTALAMOUNT: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    PAY_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Payment',
        key: 'PAY_ID'
      }
    }
  }, {
    tableName: 'INVOICE',
    timestamps: false
  });

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.Payment, { foreignKey: 'PAY_ID' });
  };

  return Invoice;
};
