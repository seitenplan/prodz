// used router: flow router
// routing is used to set filters at page load

load_status=[];             // array with status_id's to be checked at startup
load_picture=false;         // checkbox picture
load_picture_legend=false;  // checkbox legend


FlowRouter.route('/', {
    action: function(params, queryParams) {
    }
});

FlowRouter.route('/korrektorat', {
    action: function(params, queryParams) {
        load_status=[3,4,6];
    }
});


FlowRouter.route('/layout', {
    action: function(params, queryParams) {
        load_status=[2,5];
    }
});


FlowRouter.route('/bild', {
    action: function(params, queryParams) {
        load_picture=true;
    }
});


FlowRouter.route('/abschluss', {
    action: function(params, queryParams) {
        load_status=[1,7];
        load_picture_legend=true;
    }
});