const db = require('../models');
const FAQCategory = db.FAQCategory;
const FAContent = db.FAContent;

// Fetch all FAQs
exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAContent.findAll({
      include: [{
        model: FAQCategory,
        attributes: ['FAQC_CONTENT']
      }]
    });
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FAQs', error: error.message });
  }
};

// Fetch FAQs by category
exports.getFAQsByCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const faqs = await FAContent.findAll({
      where: { FAQC_ID: categoryId },
      include: [{
        model: FAQCategory,
        attributes: ['FAQC_CONTENT']
      }]
    });
    if (faqs.length === 0) {
      return res.status(404).json({ message: 'No FAQs found for this category' });
    }
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FAQs by category', error: error.message });
  }
};

// Fetch all FAQ categories
exports.getFAQCategories = async (req, res) => {
  try {
    const categories = await FAQCategory.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FAQ categories', error: error.message });
  }
};
