Resolutions = new Mongo.Collection('resolutions');

if (Meteor.isClient)
{
	Template.body.helpers({
		res: function() {
            return Resolutions.find();
		}
	});
 }

if (Meteor.isServer) {
  Meteor.startup(function () {
	// code to run on server at startup
  });
}
