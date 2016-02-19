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

    Template.resolution.helpers({
        isOwner: function() {
            return this.owner === Meteor.userId();
        }
    });

    Template.resolution.events({
        'click .toggle-checked': function() {
            Meteor.call("updateResolution", this._id, this.checked);
        },
        'click .delete': function() {
            Meteor.call("removeResolution", this._id);
        },
        'click .toggle-private': function() {
            Meteor.call("setPrivate", this._id, this.private);
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
        return Resolutions.find({
            $or: [
                {private: {$ne: true}},
                {owner: this.userId}
            ]
        });
    });
}

Meteor.methods({
    addResolution: function(title) {
       Resolutions.insert({
           title: title,
           createdAt: new Date(),
           owner: Meteor.userId()
       });
    },
    updateResolution: function(id, checked) {
        var res = Resolutions.findOne(id);

        if(res.owner !== Meteor.userId()) {
            throw new Meteor.error('Not Authorized!');
        }

        Resolutions.update(id, {$set: {checked: !checked}});
    },
    removeResolution: function(id) {
        var res = Resolutions.findOne(id);

        if(res.owner !== Meteor.userId()) {
            throw new Meteor.error('Not Authorized!');
        }

        Resolutions.remove(id);
    },
    setPrivate: function(id, private) {
        var res = Resolutions.findOne(id);

        if(res.owner !==  Meteor.userId()) {
            throw new Meteor.error('Not Authorized!');
        }
        else {
            Resolutions.update(id, {$set: {private: !private}});
        }
    }
});