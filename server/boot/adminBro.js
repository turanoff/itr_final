const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroSequelize = require('@admin-bro/sequelize')
const db = require('../sequelize-models')

// uploads
const uploadFeature = require('@admin-bro/upload')

const { BaseProvider } = require('@admin-bro/upload')

function uploadPathFunction (record, name) {
	return '/' + name
};


const photoShowAction = {
  name: 'show',
  isVisible: true,
  actionType: 'record',
  icon: 'Screen',
  showInDrawer: false,

  handler: async (request, response, data) => {
	var picsrc = '/public' + data.record.params.picture;
	data.record.params.show_file = '<a href="' + picsrc + '"><img height=240 src="' + picsrc + '"></a>'

    if (!data.record) {
      throw new _notFoundError.default([`Record of given id ("${request.params.recordId}") could not be found`].join('\n'), 'Action#handler');
    }
    return {
      record: data.record.toJSON(data.currentAdmin)
    };
  }
};


const itemShowPhoto = {
  name: 'show',
  isVisible: true,
  actionType: 'record',
  icon: 'Screen',
  showInDrawer: false,

  handler: async (request, response, data) => {
	const photo = await db.models.photo.findOne({where: {id: data.record.params.photoId}});
	var picsrc = '/public' + photo.picture;
	data.record.params.show_photo = '<a href="' + picsrc + '"><img height=240 src="' + picsrc + '"></a>'

    if (!data.record) {
      throw new _notFoundError.default([`Record of given id ("${request.params.recordId}") could not be found`].join('\n'), 'Action#handler');
    }
    return {
      record: data.record.toJSON(data.currentAdmin)
    };
  }
};



const options = {
  databases: [db],
  rootPath: '/admin',
  resources: [{
    resource: db.models.photo,
    features: [uploadFeature({
      provider: { local: { bucket: 'public' } },
	  properties: {key: 'picture'},
	  uploadPath: uploadPathFunction 
    })],
	options: {
     properties: {
	   'show_file': {type: 'richtext'}
	 },
	 actions: {
         show: photoShowAction,
     },
	 showProperties: ['id', 'show_file', 'picture'],
	 listProperties: ['id', 'picture'],
	 editProperties: ['file', 'picture'],
	}
  },
  {
    resource: db.models.item,
	options: {
     properties: {
	   'show_photo': {type: 'richtext'}
	 },
	 actions: {
         show: itemShowPhoto,
     },
	 showProperties: ['id', 'name', 'show_photo', 'collectionId', 'breed'],
	 listProperties: ['id', 'name', 'show_photo', 'collectionId', 'breed'],
	 editProperties: ['name', 'photoId', 'collectionId', 'breed'],
	}
  }
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
  db.models.item.belongsTo(db.models.photo);
  db.models.collection.belongsTo(db.models.user, {as: 'author'});
};