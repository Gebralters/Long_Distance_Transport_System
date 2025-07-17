module.exports = (sequelize, DataTypes) => {
    const FAQCategory = sequelize.define('FAQCategory', {
      FAQC_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      FAQC_CONTENT: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      timestamps: false,  // Disable Sequelize's auto-created timestamps
      tableName: 'FAQ_CATEGORY'
    });
  
    FAQCategory.associate = (models) => {
      FAQCategory.hasMany(models.FAContent, { foreignKey: 'FAQC_ID' });
    };
  
    return FAQCategory;
  };
  