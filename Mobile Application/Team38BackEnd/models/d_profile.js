// models/d_profile.js
module.exports = (sequelize, DataTypes) => {
    const DProfile = sequelize.define('DProfile', {
        DP_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        DP_PICURL: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        DP_URLID: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        DP_LICURL: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        D_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'd_profile',
        timestamps: false,
    });

    // Associations
    DProfile.associate = (models) => {
        DProfile.belongsTo(models.Driver, {
            foreignKey: 'D_ID',
            as: 'Driver',
        });
    };

    return DProfile;
};
