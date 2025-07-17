module.exports = (sequelize, DataTypes) => {
    const Standby = sequelize.define('Standby', {
      SB_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      U_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      BS_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      SB_TIMESTAMP: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'Standby',
      timestamps: false,
    });
  
    Standby.associate = (models) => {
      Standby.belongsTo(models.Customer, { foreignKey: 'U_ID' });
      Standby.belongsTo(models.BookingSlot, { foreignKey: 'BS_ID' });
    };
  
    return Standby;
  };
  