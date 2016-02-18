/*
    * stylus (CSS preprocessor, changed resolutions.css to resolutions.styl)
    * accounts-password (for login form)
    * account-ui (for login form ui)
    * accounts-facebook
    * accounts-twitter
    * accounts-github
*/
Resolutions = new Mongo.Collection('resolutions'); //Collection for mongo-db

if (Meteor.isClient)
{
	Template.body.helpers({
		res: function() {
            if (Session.get('hideFinished')) {
                return Resolutions.find({ checked: {$ne: true} });
            }
            return Resolutions.find();
		},
        hideFinished: function() {
            return Session.get('hideFinished');
        }
	});

    Template.body.events({
        'submit .new-resolution': function(event) {
            var title = event.target.title.value;

            Resolutions.insert({
                title: title,
                createdAt: new Date()
            });

            event.target.title.value = "";

            return false;
        },

        'change .hide-finished': function(event) {
            Session.set('hideFinished', event.target.checked);
        }
    });

    Template.resolution.events({
        'click .toggle-checked': function() {
            Resolutions.update(this._id, {$set: {checked: !this.checked}});
        },
        'click .delete': function(event) {
            Resolutions.remove(this._id);
        }
    });

    //accounts-password config
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY" //To use username instead of email to login
    });
 }

if (Meteor.isServer) {
  Meteor.startup(function () {
	// code to run on server at startup
  });
}
