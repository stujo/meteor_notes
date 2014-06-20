Restaurants = new Meteor.Collection("restaurants");

if (Meteor.isClient) {

  // Helper Function available in template
  Template.restaurants.restaurants = function () {
    return Restaurants.find({}, {sort: {score: -1, name: 1}});
  };

  Template.restaurant.selected = function () {
    return Session.equals("selected_restaurant_id", this._id) ? "selected" : "";
  };

  Template.restaurants.selected_restaurant = function () {
    if (Session.get("selected_restaurant_id")) {
      return Restaurants.findOne(Session.get("selected_restaurant_id"));
    }
  };
  Template.restaurants.user = function () {
    return Meteor.user();
  };

  Template.restaurants.events({
      'click': function () {
        if (this._id != Session.get("selected_restaurant_id")) {
          if (Session.get("selected_restaurant_id")) {
            Restaurants.update(Session.get("selected_restaurant_id"), {$inc: {score: -5}});
          }
          Session.set("selected_restaurant_id", this._id);

          if (Session.get("selected_restaurant_id")) {
            Restaurants.update(Session.get("selected_restaurant_id"), {$inc: {score: 5}});
          }
        }
      }
    }
  );
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (Restaurants.find().count() === 0) {
      var locs = ["Brickhouse", "HRD", "Centro", "Garaje"];
      for (var i = 0; i < locs.length; i++) {
        Restaurants.insert({name: locs[i], score: 0});
      }
    }
  });
}
