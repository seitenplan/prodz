import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import { Seiten } from '../api/seiten.js';
import { Config } from '../api/config.js';

import './seite.js';
import './task.js';
import './body.html';

var _deps = new Tracker.Dependency;
var status_filter = [];
var picture_filter;
var legend_filter;

function add_pages(nr,layout_breaks){
    for (var i = 1; i <= nr; i++){
        Seiten.insert({
          nummer: i,
          createdAt: new Date(), // current time
        });
    }
    var id=Config.findOne({"name":"layout_breaks"})._id;  
    Config.update(id, {
        $set: { 
          value: layout_breaks,
                },
        }); 
    
}

Template.body.rendered = function() {
    if(!this._rendered) {
        
        // ROUTING VIEWS
        $(load_status).each(function( index ) {
            $(".toggle_status_list[name='"+this+"']").prop( "checked", true );
        });
                
        status_filter = $('.toggle_status_list:checked:enabled').map(function(index) {
           return $(this).attr("name")*1; 
        });
        status_filter=$.makeArray(status_filter);
    
        if(load_picture){
            $(".toggle_picture_filter").prop("checked",true);
            picture_filter=true;
        }
    
        if(load_picture_legend){
            $(".toggle_legend_filter").prop("checked",true);
            legend_filter=true;
        }
    
        _deps.changed();
    }
}


Template.body.helpers({

    seiten() {
        return Seiten.find({}, { sort: { nummer: 1 } });
    },
    tasks() {
        _deps.depend();
        var or_query=[{status: {$in: status_filter}}];
        
        if (picture_filter){
            var picture_query={$and: [{need_picture:true},{has_picture:false}]};
            or_query.push(picture_query);
        }
        
        if (legend_filter){
            var legend_query={$and: [{need_picture:true},{has_legend:false}]};
            or_query.push(legend_query);
        }
        
        return Tasks.find( {$or: or_query});
    },
    
    status_list: function(){
       return status_list;
    },
    status_count: function(status){
       return Tasks.find({"status":status}).count();  
    },
    legend_count: function(status){
       return Tasks.find({$and: [{need_picture:true},{has_legend:false}]}).count();  
    },
    picture_count: function(status){
       return Tasks.find({$and: [{need_picture:true},{has_picture:false}]}).count();  
    },
    layout_breaks: function(){
        var layout_breaks=Config.findOne({"name":"layout_breaks"});
        if(layout_breaks){
            $(".seite_break").removeAttr( 'style' );
            $(".seite_break:nth-child("+layout_breaks.value+"n+1)").css("clear", "both");
        }
        return (layout_breaks) ? layout_breaks.value : ''
    } ,

});

Template.body.events({

    'click .toggle_status_list': function(e){
        $(e.currentTarget).attr("checked", ! $(e.currentTarget).attr("checked"));
        
        status_filter = $('.toggle_status_list:checked:enabled').map(function(index) {
           return $(this).attr("name")*1; 
        });
        status_filter=$.makeArray(status_filter);
        _deps.changed();
    },
    
    'click .toggle_picture_filter': function(e){
        $(e.currentTarget).attr("checked", ! $(e.currentTarget).attr("checked"));
        
        picture_filter= $(e.currentTarget).prop("checked");
        _deps.changed();
    },
    
    'click .toggle_legend_filter': function(e){
        $(e.currentTarget).attr("checked", ! $(e.currentTarget).attr("checked"));
        
        legend_filter= $(e.currentTarget).prop("checked");
        _deps.changed();
    },
    
    'click .header_toggle_config'() {
        $(".config").toggle();
    },
      
    'click .config_delete_all'() {
              if(confirm('Achtung! Alle Daten werden gelöscht!')){
                if(confirm('Wirklich ALLES löschen?')){
                    Meteor.call("deleteAll");
                }
              }
    },
    'click .config_new_24'() {
              if(confirm('24 neue Seiten einfügen?')){
                    add_pages(24,6);
              }
    },
    'click .config_new_28'() {
              if(confirm('28 neue Seiten einfügen?')){
                    add_pages(28,7);
              }
    },
    'click .config_new_32'() {
              if(confirm('32 neue Seiten einfügen?')){
                    add_pages(32,8);
              }
    },
    
    
    
    'submit .new-seite'(event) {      
        event.preventDefault(); 
        const target = event.target;
        const nummer = target.text.value*1;
        Seiten.insert({
          nummer,
          createdAt: new Date(), // current time
        });
        target.text.value = '';
  },

    'submit .edit_layout_breaks'(event) {          
        event.preventDefault(); 
        const target = event.target;
        const nummer = target.layout_breaks.value*1;
        var id=Config.findOne({"name":"layout_breaks"})._id;  
         Config.update(id, {
            $set: { 
          value: nummer,
                },
        }); 
        target.layout_breaks.value = '';

  },

});