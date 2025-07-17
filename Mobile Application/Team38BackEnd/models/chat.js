// models/chat.js
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    CH_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    CH_NUMCHATS: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    CH_STATUS: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    D_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Driver',
        key: 'D_ID'
      }
    },
    C_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Customer',
        key: 'C_ID'
      }
    },
    R_ID: { // Adding the Ride ID reference
      type: DataTypes.INTEGER,
      references: {
        model: 'Ride',
        key: 'R_ID'
      },
      allowNull: false // Ensuring that each chat is associated with a specific ride
    }
  }, {
    tableName: 'CHAT',
    timestamps: false
  });

  Chat.associate = (models) => {
    Chat.belongsTo(models.Driver, { foreignKey: 'D_ID' });
    Chat.belongsTo(models.Customer, { foreignKey: 'C_ID' });
    Chat.belongsTo(models.Ride, { foreignKey: 'R_ID' });
    Chat.hasMany(models.Message, { foreignKey: 'CH_ID' });
  };

  return Chat;
};
