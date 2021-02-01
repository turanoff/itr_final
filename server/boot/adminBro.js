const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroSequelize = require('@admin-bro/sequelize')
const db = require('../sequelize-models')

// uploads
const uploadFeature = require('@admin-bro/upload')

const { BaseProvider } = require('@admin-bro/upload')

function uploadPathFunction (record, name) {
	return name
};

const options = {
  resources: [{
    resource: db.models.photo,
    options: {
	  databases: [db],
      rootPath: '/admin',
    },
    features: [uploadFeature({
      provider: { local: { bucket: 'public' } },
	  properties: {key: 'picture'},
	  uploadPath: uploadPathFunction 
    })]
  },
  ],
  assets: {
	  styles: ['/public/style.css'],
      scripts: [
	    'http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit',
		'/public/script.js',
	  ]
  },
}



// end 

AdminBro.registerAdapter(AdminBroSequelize);

const adminBro = new AdminBro(options);

module.exports = function(app) {
  const router = AdminBroExpress.buildRouter(adminBro);
  app.use(adminBro.options.rootPath, router);

  db.models.item.belongsTo(db.models.collection);
  db.models.collection.belongsTo(db.models.user, {as: 'author'});
};