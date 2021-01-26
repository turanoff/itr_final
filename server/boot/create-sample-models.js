module.exports = function(app) {
  app.dataSources.catsiteDs.automigrate('Collection', function(err) {
    if (err) throw err;

    app.models.Collection.create([{
      name: 'BlackCats'
    }, {
      name: 'WhiteCats'
    }, {
      name: 'ColorCats'
    }], function(err, collections) {
      if (err) throw err;

      console.log('Models created: \n', collections);
    });
  });
  
  app.dataSources.catsiteDs.automigrate('item', function(err) {
    if (err) throw err;
  });
	
  app.dataSources.catsiteDs.automigrate('Photo', function(err) {
    if (err) throw err;
  });
	
  app.dataSources.catsiteDs.automigrate('Tag', function(err) {
    if (err) throw err;
  });
  
  app.dataSources.catsiteDs.automigrate('User', function(err) {
    if (err) throw err;

    // not for production!
	app.models.User.create([{
      name: 'Admin',
	  password: '1',
	  email: 'example@example.ex'
    }], function(err) {
      if (err) throw err;
	})
  });
};
  