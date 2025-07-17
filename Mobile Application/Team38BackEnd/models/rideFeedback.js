module.exports = (sequelize, DataTypes) => {
  const RideFeedback = sequelize.define('RideFeedback', {
    RF_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    RF_COMMENTS: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    RF_DATE: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    RF_RATING: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    R_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Ride',
        key: 'R_ID'
      }
    },
    C_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Customer',
        key: 'C_ID'
      }
    }
  }, {
    tableName: 'RIDE_FEEDBACK',
    timestamps: false
  });

  RideFeedback.associate = (models) => {
    RideFeedback.belongsTo(models.Ride, { foreignKey: 'R_ID' });
    RideFeedback.belongsTo(models.Customer, { foreignKey: 'C_ID' });
  };

  return RideFeedback;
};
