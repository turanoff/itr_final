const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroSequelize = require('@admin-bro/sequelize')
const db = require('../sequelize-models')


AdminBro.registerAdapter(AdminBroSequelize);

const adminBro = new AdminBro({
  databases: [db],
  rootPath: '/admin',
  resources: [
	{resource: db.models.collection,
	 options: {
	  properties: {
	    'Items': {
	      reference: 'item',
          isArray: true,
          type: 'mixed',
	    },
	  },
     }
  }],
});

module.exports = function(app) {
  const router = AdminBroExpress.buildRouter(adminBro);
  app.use(adminBro.options.rootPath, router);
};