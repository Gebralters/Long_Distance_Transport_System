module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define('Vehicle', {
    V_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    V_CAPACITY: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    V_TYPE: {
      type: DataTypes.STRING,
      allowNull: false
    },
    V_LICNUMBER: {
      type: DataTypes.STRING,
      allowNull: false
    },
    V_MODEL: {
      type: DataTypes.STRING,
      allowNull: false
    },
    V_COLOR: {
      type: DataTypes.STRING,
      allowNull: false
    },
    V_STATUS: {
      type: DataTypes.STRING,
      allowNull: false
    },
    D_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Driver',
        key: 'D_ID'
      }
    }
  }, {
    tableName: 'VEHICLE',
    timestamps: false
  });

  Vehicle.associate = (models) => {
    Vehicle.belongsTo(models.Driver, { foreignKey: 'D_ID' });
  };

  return Vehicle;
};
