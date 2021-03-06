/**
 * A module for the router of the mobile application.
 *
 */
define("router",[
    'jquery',
    'jquerymobile',
    'underscore',
    'utilities',
    'app/models/event',
    'app/models/venue',
    'app/collections/events',
    'app/collections/venues',
    'app/views/mobile/events',
    'app/views/mobile/venues',
    'app/views/mobile/create-booking',
    'app/views/mobile/event-detail',
    'app/views/mobile/venue-detail',
    'text!../templates/mobile/home-view.html'
],function ($,
            jqm,
            _,
            utilities,
            Event,
            Venue,
            Events,
            Venues,
            EventsView,
            VenuesView,
            CreateBookingView,
            EventDetailView,
            VenueDetailView,
            HomeViewTemplate) {

    /**
     * The Router class contains all the routes within the application - i.e. URLs and the actions
     * that will be taken as a result.
     *
     * @type {Router}
     */
    var Router = Backbone.Router.extend({
    	initialize: function() {
            //Begin dispatching routes
    		Backbone.history.start();
    	},
        routes:{
            "":"home",
            "events":"events",
            "events/:id":"eventDetail",
            "venues":"venues",
            "venues/:id":"venueDetail",
            "book/:showId/:performanceId":"bookTickets",
        },
        home:function () {
            utilities.applyTemplate($("#container"), HomeViewTemplate);
            $("#container").enhanceWithin();
        },
        events:function () {
            var events = new Events;
            var eventsView = new EventsView({model:events, el:$("#container")});
            events.on("reset", function() {
                utilities.viewManager.showView(eventsView);
            }).fetch({
                reset : true,
                error : function() {
                    utilities.displayAlert("Failed to retrieve events from the TicketMonster server.");
                }
            });
        },
        venues:function () {
            var venues = new Venues;
            var venuesView = new VenuesView({model:venues, el:$("#container")});
            venues.on("reset",
                function () {
                    utilities.viewManager.showView(venuesView);
                }).fetch({
                    reset : true,
                    error : function() {
                        utilities.displayAlert("Failed to retrieve venues from the TicketMonster server.");
                    }
                });
        },
        bookTickets:function (showId, performanceId) {
            var createBookingView = new CreateBookingView({model:{showId:showId, performanceId:performanceId, bookingRequest:{tickets:[]}}, el:$("#container")});
            utilities.viewManager.showView(createBookingView);
        },
        eventDetail:function (id) {
            var model = new Event({id:id});
            var eventDetailView = new EventDetailView({model:model, el:$("#container")});
            model.on("change",
                function () {
                    utilities.viewManager.showView(eventDetailView);
                    $("body").pagecontainer("change", "#container", {transition:'slide', changeHash:false});
                }).fetch({
                    error : function() {
                        utilities.displayAlert("Failed to retrieve the event from the TicketMonster server.");
                    }
                });
        },
        venueDetail:function (id) {
            var model = new Venue({id:id});
            var venueDetailView = new VenueDetailView({model:model, el:$("#container")});
            model.on("change",
                function () {
                    utilities.viewManager.showView(venueDetailView);
                    $("body").pagecontainer("change", "#container", {transition: 'slide', changeHash: false});
                }).fetch({
                    error : function() {
                        utilities.displayAlert("Failed to retrieve the venue from the TicketMonster server.");
                    }
                });
        },
        execute : function(callback, args) {
            $.mobile.loading("show");
            window.setTimeout(function() {
                if (callback) {
                    callback.apply(this, args);
                }
                $.mobile.loading("hide");
            }, 300);
        }
    });
    
    // Create a router instance
    var router = new Router();
    
    return router;
});