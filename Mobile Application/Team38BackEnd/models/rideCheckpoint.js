module.exports = (sequelize, DataTypes) => {
  const RideCheckpoint = sequelize.define('RideCheckpoint', {
    RIC_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    RIC_TIMESTAP: {
      type: DataTypes.DATE,
      allowNull: true,
      
    },
    RIC_CUSTOMERSTATUS: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    RIC_DRIVERSTATUS: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    R_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Ride',
        key: 'R_ID'
      }
    },
    RC_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'RouteCheckpoint',
        key: 'RC_ID'
      }
    }
  }, {
    tableName: 'ride_checkpoints',
    timestamps: false,
  });

  RideCheckpoint.associate = (models) => {
    RideCheckpoint.belongsTo(models.Ride, { foreignKey: 'R_ID' });
    RideCheckpoint.belongsTo(models.RouteCheckpoint, { foreignKey: 'RC_ID' });
  };

  return RideCheckpoint;
};
