module.exports = (sequelize, DataTypes) => {
  const Incident = sequelize.define('Incident', {
    UINC_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UINC_DESCRIP: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    UINC_DATE: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    UINC_INTENSITY: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    U_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'U_ID'
      }
    },
  }, {
    tableName: 'u_incident',
    timestamps: false,
  });

  return Incident;
};
