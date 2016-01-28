Resolutions = new Mongo.Collection('resolutions');

if (Meteor.isClient) {
  Meteor.subscribe("resolutions");
  
  Template.body.helpers({
    resolutions: function(){
      if(Session.get('hideFinished')) {
        return Resolutions.find({checked: {$ne: true}});
      } else {
        return Resolutions.find();
      }
    },

    hideFinished: function(){
      return Session.get('hideFinished');
    }
  });

  Template.body.events({
    'submit .new-resolution': function(event) {
      var title = event.target.title.value;

      Meteor.call("addResolution", title)

      event.target.title.value ="";
      return false;
    },

    'change .hide-finished': function(event){
      Session.set('hideFinished', event.target.checked);

    }
  });

Template.resolution.events({
  'click .toggle-checked': function(){
    Meteor.call("updateResolution", this._id, !this.checked);
  },

  'click .delete': function() {
    Meteor.call("deleteResolution", this._id);
  }
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
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
  addResolution: function(title){
    Resolutions.insert({
        title: title,
        createdAt: new Date()
      });
  },

  updateResolution: function (id, checked){
    Resolutions.update(id, {$set: {checked: checked}})
  },

  deleteResolution: function(id){
    Resolutions.remove(id);
  },

});

