// models/LogStatus.js
module.exports = (sequelize, DataTypes) => {
  const LogStatus = sequelize.define('LogStatus', {
    UL_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    UL_DATE: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    U_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'USER',
        key: 'U_ID',
      },
    },
  }, {
    tableName: 'LOGSTATUS',
    timestamps: false,
  });
  
  LogStatus.associate = (models) => {
    LogStatus.belongsTo(models.User, { foreignKey: 'U_ID' });
  };

  return LogStatus;
};
