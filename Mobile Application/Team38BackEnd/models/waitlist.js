module.exports = (sequelize, DataTypes) => {
    const Waitlist = sequelize.define('Waitlist', {
      WL_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      U_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      WL_DEPARTURE: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      WL_DESTINATION: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      WL_TRAVELDATE: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }, {
      tableName: 'Waitlist',
      timestamps: false,
    });
  
    Waitlist.associate = (models) => {
      Waitlist.belongsTo(models.Customer, { foreignKey: 'U_ID' });
    };
  
    return Waitlist;
  };
  