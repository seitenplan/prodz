import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import { Seiten } from '../api/seiten.js';
import { Config } from '../api/config.js';
import { Ausgaben } from '../api/ausgaben.js';

import './seite.js';
import './task.js';
import './body.html';

var _deps = new Tracker.Dependency;
var status_filter = [];
var picture_filter;
var legend_filter;
current_ausgabe=new ReactiveVar(0);
current_status_filter=new ReactiveVar([]);
current_picture_filter=new ReactiveVar(false);
current_legend_filter=new ReactiveVar(false);


function add_pages(nr,page_breaks){
    for (var i = 1; i <= nr; i++){
        Seiten.insert({
          nummer: i,
          createdAt: new Date(), // current time
          has_app: false,
          has_pdf: false,
          has_picture_edit: false,
          ausgaben_id: current_ausgabe.get(),
        });
    }
    Ausgaben.update(current_ausgabe.get(), {
        $set: { 
          page_breaks: page_breaks,
                },
        }); 
    
}

Template.body.rendered = function() {
    if(!this._rendered) {
        
        // ROUTING VIEWS
        $(load_status).each(function( index ) {
            $(".toggle_status_list[name='"+this+"']").prop( "checked", true );
        });

        current_status_filter.set(load_status);
        
        if(load_picture){
            $(".toggle_picture_filter").prop("checked",true);
            current_picture_filter.set(true);
        }
    
        if(load_picture_legend){
            $(".toggle_legend_filter").prop("checked",true);
            current_legend_filter.set(true);
        }

        //_deps.changed(); // Update Todo-List
        
    }
}

Template.body.helpers({

    seiten() {
        return Seiten.find({ausgaben_id: current_ausgabe.get()}, { sort: { nummer: 1 } });
    },
    ausgaben() {
        // on data loaded: set ausgabe number as active
        if(current_ausgabe.get()==0){
            if(Ausgaben.find().count()>0){
                current_ausgabe.set(Ausgaben.findOne({}, { sort: { sort: 1 } })._id); 
            }       
        }
        return Ausgaben.find({}, { sort: { sort: 1 } });
    },
    tasks() {
        var or_query=[{status: {$in: current_status_filter.get()}}];
        
        if (current_picture_filter.get()){
            var picture_query={$and: [{need_picture:true},{has_picture:false}]};
            or_query.push(picture_query);
        }
        
        if (current_legend_filter.get()){
            var legend_query={$and: [{need_picture:true},{has_picture:true},{has_legend:false}]};
            or_query.push(legend_query);
        }
        
        return Tasks.find( {$and: [{ ausgaben_id: current_ausgabe.get()}, {$or: or_query}]},{ sort: { updatedAt: -1 } });
    },
    
    status_list: function(){
       return status_list;
    },
    status_count: function(status){
       return Tasks.find({"status":status, ausgaben_id: current_ausgabe.get()}).count();  
    },
    ausgabe_count: function(ausgaben_id){
       return Tasks.find({ausgaben_id: ausgaben_id}).count();  
    },
    legend_count: function(status){
       return Tasks.find({$and: [{need_picture:true},{has_picture:true},{has_legend:false}, {ausgaben_id: current_ausgabe.get()}]}).count();  
    },
    picture_count: function(status){
      //  _deps.depend();
       return Tasks.find({$and: [{need_picture:true},{has_picture:false}, {ausgaben_id: current_ausgabe.get()}]}).count();  
    },
    page_breaks: function(){
        var page_breaks=Ausgaben.findOne({_id:current_ausgabe.get()});

       if(page_breaks){
             return page_breaks.page_breaks;
        }
    } ,
    
    ausgabe_is_active: function(){
        
       return (this._id==current_ausgabe.get())? "ausgabe_active":"" ; 
    },
});

Template.body.events({

    'click .toggle_status_list': function(e){
        $(e.currentTarget).attr("checked", ! $(e.currentTarget).attr("checked"));
        
        status_filter = $('.toggle_status_list:checked:enabled').map(function(index) {
           return $(this).attr("name")*1; 
        });
        current_status_filter.set($.makeArray(status_filter));
    },
    
    'click .toggle_picture_filter': function(e){
        $(e.currentTarget).attr("checked", ! $(e.currentTarget).attr("checked"));
        
        current_picture_filter.set( $(e.currentTarget).prop("checked"));
        _deps.changed();
    },
    
    'click .toggle_legend_filter': function(e){
        $(e.currentTarget).attr("checked", ! $(e.currentTarget).attr("checked"));
        current_legend_filter.set($(e.currentTarget).prop("checked"));
    },
    
    'click .header_toggle_config_seiten'() {
        $(".seiten_config").toggle();
        $(".filtered_task_list_container").toggle();
    },
      
    'click .header_toggle_config_ausgaben'() {
        $(".header_config_ausgabe").toggle();
    },
      
    
    'click .config_delete_all'() {
              if(confirm('Achtung! Alle Daten werden gelöscht!')){
                if(confirm('Wirklich ALLES löschen?')){
                    Meteor.call("deleteAll");
                }
              }
    },
    'click .config_new_20'() {
              if(confirm('20 neue Seiten einfügen?')){
                    add_pages(20,5);
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
    
    
    
    'submit .neu_seite'(event) {      
        event.preventDefault(); 
        const target = event.target;
        const nummer = target.text.value*1;
        Seiten.insert({
          nummer,
          createdAt: new Date(), // current time
          has_app: false,
          has_pdf: false,
          has_picture_edit: false,
          ausgaben_id: current_ausgabe.get(),
        });
        target.text.value = '';
  },

    'submit .edit_page_breaks'(event) {          
        event.preventDefault(); 
       Ausgaben.update( current_ausgabe.get(), {
            $set: { 
          page_breaks: event.target.page_breaks.value*1,
                },
        }); 

  },    
    
  'click .ausgabe'(e,t) {
      if($(".header_config_ausgabe").first().css("display")=="none"){ // do not switch ausgabe if edit_mode is active
                current_ausgabe.set(this._id);
      }
 
  }, 
    
    'submit .neu_ausgabe'(event) {      
        event.preventDefault(); 
        Ausgaben.insert({
            bezeichnung:event.target.bezeichnung.value,
            page_break:0,
        });
        event.target.bezeichnung.value = '';
        $(".header_config_ausgabe").show();
  },
        
  'click .ausgabe_delete'() {
      if(confirm('Ausgabe '+this.bezeichnung+' entfernen? ALLE Seiten und Artikel werden gelöscht!')){
          if(confirm('Ausgabe '+this.bezeichnung+' WIRKLICH entfernen?')){
            Meteor.call("removeAusgabe",this._id);
        }
      }
  }, 
    
    'submit .ausgabe_sort'(event) { 
        event.preventDefault(); 
         Ausgaben.update(this._id, {
            $set: { 
                sort: event.target.sort.value,
                },
        });
    },
    'submit .ausgabe_rename'(event) { 
        event.preventDefault(); 
         Ausgaben.update(this._id, {
            $set: { 
                bezeichnung: event.target.rename.value,
                },
        });
    },
        
  'drop li.ausgabe' : function(e, t) {      
      $(".ausgabe").removeClass("ausgabe_dropable");
      
        e.stopPropagation();
        e.preventDefault();
        task_id=e.originalEvent.dataTransfer.getData("text");
        target_seite=Seiten.findOne({ausgaben_id: this._id}, { sort: { nummer: 1 } });
      
        if(target_seite){
          Tasks.update(task_id, {
                    $set: {
                            ausgaben_id: this._id,
                            seiten_id:  target_seite._id,
                    },
                });
        }else{
            alert("Ausgabe besitzt noch keine Seiten! Artikel kann nicht verschoben werden.");   
        }
  },
        
  'dragover .ausgabe' : function(e, t) {
    e.originalEvent.preventDefault(); 
      e.originalEvent.dataTransfer.dropEffect = "move";
  },
    
});