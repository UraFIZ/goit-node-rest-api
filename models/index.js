import Contact from './contact.js';
import User from './user.js';

User.hasMany(Contact, { foreignKey: 'owner' });
Contact.belongsTo(User, { foreignKey: 'owner' });

export { Contact, User };
