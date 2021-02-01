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
	if (photo) {
		var picsrc = '/public' + photo.picture;
		data.record.params.show_photo = '<a href="' + picsrc + '"><img height=240 src="' + picsrc + '"></a>'
	} else {
		data.record.params.show_photo = '<a href="http://localhost:3000/admin/resources/photo/actions/new">Add new photo</a>';
	}
    if (!data.record) {
      throw new _notFoundError.default([`Record of given id ("${request.params.recordId}") could not be found`].join('\n'), 'Action#handler');
    }
    return {
      record: data.record.toJSON(data.currentAdmin)
    };
  }
};


const collectionShowAction = {
  name: 'show',
  isVisible: true,
  actionType: 'record',
  icon: 'Screen',
  showInDrawer: false,
  
  handler: async (request, response, data) => {
    const items = await db.models.item.findAll({where: {collectionId: data.record.id()}});

	if (items.length) {
		// format found items
		var i;
		var formatted_items = [];
		for (i = 0; i < items.length; i++) {
		  var href = '<a href="/admin/resources/item/records/' + items[i].id + '/show">' + items[i].breed + ' ' + items[i].name + '</a>';
		  formatted_items.push(href);
		}
		data.record.params.Items = formatted_items.join(', <br>');
	} else {
		data.record.params.Items = 'No items'
	}
    // copied from AdminBro source
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
  },
  { 
    resource: db.models.collection,
    options: {
	  properties: {
	   'Items': {
	       type: 'richtext',
	   },
	   'description': {
	       type: 'textarea',
 	    },
	  },
	  actions: {
        show: collectionShowAction,
      },
	 listProperties: ['id', 'name', 'authorId'],
	 editProperties: ['name', 'authorId', 'description'],
	},
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
  db.models.item.belongsTo(db.models.photo);
  db.models.collection.belongsTo(db.models.user, {as: 'author', foreignKey: 'authorId'});
};