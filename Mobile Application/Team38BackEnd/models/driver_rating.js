// models/driver_rating.js
module.exports = (sequelize, DataTypes) => {
    const DriverRating = sequelize.define('DriverRating', {
        DR_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        DR_DATE: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        DR_RATING: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        DR_COMMENTS: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        D_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        C_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'driver_rating',
        timestamps: false,
    });

    // Associations
    DriverRating.associate = (models) => {
        DriverRating.belongsTo(models.Driver, {
            foreignKey: 'D_ID',
            as: 'Driver',
        });
        DriverRating.belongsTo(models.Customer, {
            foreignKey: 'C_ID',
            as: 'Customer',
        });
    };

    return DriverRating;
};
