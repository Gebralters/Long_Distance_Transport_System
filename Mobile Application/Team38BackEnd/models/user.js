module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    U_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    U_FIRSTNAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    U_SURNAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    U_EMAIL: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    U_TITLE: {
      type: DataTypes.STRING,
    },
    U_CONTACT: {
      type: DataTypes.STRING,
    },
    U_PASSWORD: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    U_USERTYPE: {
      type: DataTypes.INTEGER,
      defaultValue: 2, // Default to customer
    },
    U_REGDATE: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    U_LOGSTATUS: {
      type: DataTypes.STRING,
      defaultValue: 'Inactive',
    },
  }, {
    timestamps: false, 
    tableName: 'USER'
  });

  User.associate = (models) => {
    User.hasOne(models.Customer, { foreignKey: 'U_ID' });
    User.hasMany(models.Notification, { foreignKey: 'U_ID' });
    User.hasMany(models.PaymentDetails, { foreignKey: 'U_ID' });
  };

  return User;
};
