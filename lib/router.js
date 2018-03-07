// used router: flow router
// routing is used to set filters at page load

load_status=[];             // array with status_id's to be checked at startup
load_picture=false;         // checkbox picture
load_picture_legend=false;  // checkbox legend
route="";                   // route variable


FlowRouter.route('/', {
    action: function(params, queryParams) {
    }
});

FlowRouter.route('/korrektorat', {
    action: function(params, queryParams) {
        load_status=[4,5,7];
        route="korrektorat";
    }
});


FlowRouter.route('/layout', {
    action: function(params, queryParams) {
        load_status=[2,6];
        route="layout";
    }
});


FlowRouter.route('/bild', {
    action: function(params, queryParams) {
        load_picture=true;
        route="bild";
    }
});


FlowRouter.route('/abschluss', {
    action: function(params, queryParams) {
        load_status=[1,3,8];
        load_picture_legend=true;
        route="abschluss";
    }
});