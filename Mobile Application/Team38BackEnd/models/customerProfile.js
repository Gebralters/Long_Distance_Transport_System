module.exports = (sequelize, DataTypes) => {
  const CustomerProfile = sequelize.define('CustomerProfile', {
    CP_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    CP_PICURL: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    CP_NEXTOFKINEMAIL: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    CP_NEXTOFKINNAME: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    CP_NEXTOFKINCONTACT: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    C_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'CUSTOMER',
        key: 'C_ID'
      }
    }
  }, {
    tableName: 'C_PROFILE',
    timestamps: false
  });

  CustomerProfile.associate = (models) => {
    CustomerProfile.belongsTo(models.Customer, { foreignKey: 'C_ID' });
  };

  return CustomerProfile;
};
