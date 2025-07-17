const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    NOT_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    NOT_CONTENT: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    NOT_TYPE: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    NOT_STATUS: {
      type: DataTypes.STRING,
      allowNull: false
    },
    NOT_TIMESTAMP: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    U_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'U_ID'
      }
    }
  }, {
    tableName: 'NOTIFICATION',
    timestamps: false // Disable timestamps
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'U_ID' });
  };

  return Notification;
};
