// used router: flow router
// routing is used to set filters at page load

load_status=[];             // array with status_id's to be checked at startup
load_picture=false;         // checkbox picture
load_picture_legend=false;  // checkbox legend
route="";                   // route variable
planung="";
planning_url=false;

function seitenplan_params(){
    route=FlowRouter.getParam("route");
    planung=FlowRouter.getParam("planung");

    if (route=="layout"){
        load_status=[2,6];
    } 
    if (route=="korrektorat"){
        load_status=[4,5,7];
    }
    if (route=="abschluss"){
        load_status=[1,3,8];
        load_picture_legend=true;
    }
    if (route=="foto"){
        load_picture=true;
    }
    if(planung=="planung"){
        planning_url=true;
    }
}


FlowRouter.route('/:route/:planung', {
    name: "url_with_role",
    action: function(params, queryParams) {
        seitenplan_params();
    }
});

FlowRouter.route('/:planung', {
    name: "url_without_role",
    action: function(params, queryParams) {
        if(params.planung=="planung"){
            planning_url=true;
        }else{
            route=params.planung;
        }
    }
});

FlowRouter.route('/', {
 
});


