const { Customer, CustomerProfile } = require('../models');

async function backfillCustomerProfiles() {
  try {
    const customers = await Customer.findAll();

    for (const customer of customers) {
      const profile = await CustomerProfile.findOne({ where: { C_ID: customer.C_ID } });

      if (!profile) {
        await CustomerProfile.create({
          C_ID: customer.C_ID,
          CP_PICURL: '', // Default to empty or a placeholder URL
          CP_NEXTOFKINNAME: '',
          CP_NEXTOFKINEMAIL: '',
          CP_NEXTOFKINCONTACT: '',
        });

        console.log(`Created profile for customer ID: ${customer.C_ID}`);
      }
    }

    console.log('Backfilling customer profiles completed successfully');
  } catch (error) {
    console.error('Error backfilling customer profiles:', error);
  }
}

// Call the function
backfillCustomerProfiles();
