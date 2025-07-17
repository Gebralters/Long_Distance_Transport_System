module.exports = (sequelize, DataTypes) => {
    const DriverLocation = sequelize.define('DriverLocation', {
      DL_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      D_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Driver',
          key: 'D_ID'
        }
      },
      DL_LATITUDE: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
      },
      DL_LONGITUDE: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
      },
      DL_TIMESTAMP: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    }, {
      tableName: 'driver_location',
      timestamps: false,
    });
  
    DriverLocation.associate = (models) => {
      DriverLocation.belongsTo(models.Driver, { foreignKey: 'D_ID' });
    };
  
    return DriverLocation;
  };
  