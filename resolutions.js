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
    Meteor.subscribe("resolutions");

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

            Meteor.call("addResolution", title);
            event.target.title.value = "";

            return false;
        },

        'change .hide-finished': function(event) {
            Session.set('hideFinished', event.target.checked);
        }
    });

    Template.resolution.events({
        'click .toggle-checked': function() {
            Meteor.call("updateResolution", this._id, this.checked);
        },
        'click .delete': function() {
            Meteor.call("removeResolution", this._id);
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

    Meteor.publish("resolutions", function() {
        return Resolutions.find();
    });
}

Meteor.methods({
    addResolution: function(title) {
       Resolutions.insert({
           title: title,
           createdAt: new Date()
       });
    },
    updateResolution: function(id, checked) {
        Resolutions.update(id, {$set: {checked: !checked}});
    },

    removeResolution: function(id) {
        Resolutions.remove(id);
    }

});