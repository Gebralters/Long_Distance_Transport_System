module.exports = (sequelize, DataTypes) => {
  const Route = sequelize.define('Route', {
    RO_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    RO_NAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RO_DISTANCE: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RO_NUMSTOPS: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RO_STARTLOC: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RO_ENDLOC: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'route',
    timestamps: false,
  });

  Route.associate = (models) => {
    Route.hasMany(models.Ride, { foreignKey: 'RO_ID' });
  };

  return Route;
};
