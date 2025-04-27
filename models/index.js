import Contact from './contact.js';
import User from './user.js';

// Setup relation between User and Contact
User.hasMany(Contact, { foreignKey: 'owner' });
Contact.belongsTo(User, { foreignKey: 'owner' });

export { Contact, User };
