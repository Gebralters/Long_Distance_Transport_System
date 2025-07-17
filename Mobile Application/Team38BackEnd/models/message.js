// models/message.js
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    M_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    M_TIME: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    M_CONTENT: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    M_STATUS: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    M_USERTYPE: {
      type: DataTypes.INTEGER,
      allowNull: false // 1 for Driver, 2 for Customer
    },
    CH_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Chat',
        key: 'CH_ID'
      }
    }
  }, {
    tableName: 'MESSAGE',
    timestamps: false
  });

  Message.associate = (models) => {
    Message.belongsTo(models.Chat, { foreignKey: 'CH_ID' });
  };

  return Message;
};