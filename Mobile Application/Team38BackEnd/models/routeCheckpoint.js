module.exports = (sequelize, DataTypes) => {
  const RouteCheckpoint = sequelize.define('RouteCheckpoint', {
    RC_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    RC_LOCATION: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    RO_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Route',
        key: 'RO_ID'
      }
    }
  }, {
    tableName: 'route_checkpoint',
    timestamps: false,
  });

  RouteCheckpoint.associate = (models) => {
    RouteCheckpoint.belongsTo(models.Route, { foreignKey: 'RO_ID' });
  };

  return RouteCheckpoint;
};
