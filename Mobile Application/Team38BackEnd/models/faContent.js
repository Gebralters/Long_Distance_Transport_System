module.exports = (sequelize, DataTypes) => {
    const FAContent = sequelize.define('FAContent', {
      FAQ_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      FAQ_QUESTION: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      FAQ_ANSWER: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      FAQC_ID: {
        type: DataTypes.INTEGER,
        references: {
          model: 'FAQ_CATEGORY', 
          key: 'FAQC_ID'
        }
      },
    }, {
      timestamps: false,  
      tableName: 'FA_CONTENT'
    });
  
    FAContent.associate = (models) => {
      FAContent.belongsTo(models.FAQCategory, { foreignKey: 'FAQC_ID' });
    };
  
    return FAContent;
  };
  