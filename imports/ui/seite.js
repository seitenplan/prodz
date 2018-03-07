import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import { Seiten } from '../api/seiten.js';

 
import './task.js';
import './seite.html';


  
Template.seite.helpers({
     
  tasks() {
       return Tasks.find({"seiten_id":this._id}, { sort: { createdAt: -1 } });
    },
  status_list: function(){
       return status_list;
    },
  tasks_same_status: function(){ // returns true if more than one task and all same status
        var tasks=Tasks.find({"seiten_id":this._id}).fetch();
        var same=1;
        var last=0;
        $(tasks).each(function( index ) {   
            if (this.status!=last && index>0){
                same=0;
            }
            last=this.status;
        });
        return (same==1 && tasks.length>1);      
    },
  lastStatus: function() {
        var tasks=Tasks.find({"seiten_id":this._id}).fetch();
        return tasks[0].status > (status_list.length-2) ? 'last-status' : ''; 
    },
  layout_mode: function(){
        if(route=="layout"){
            return true;   
        }
    },
  has_app: function(){
        return (this.has_app)? "active":"inactive";
    },  
  has_pdf: function(){
        return (this.has_pdf)? "active":"inactive";
    },  
  has_picture_edit: function(){
        return (this.has_picture_edit)? "active":"inactive";
    },  
      
    
    
 });

Template.seite.events({

  'click .toggle-edit'() {
    $("#seite_edit_"+this._id).toggle();
  },
    
  'click .delete'() {
      if(confirm('Seite '+this.nummer+' entfernen?')){
        Meteor.call("removeSeite",this._id);
    }
  },
    
    'change .seite_edit_nummer'(event, template) {  
         Seiten.update(template.data._id, {
            $set: { 
                nummer: event.target.value*1,
                },
        });
    },
    
    'change .seite_edit_desc'(event, template) {  
         Seiten.update(template.data._id, {
            $set: { 
                desc: event.target.value,
                },
        });
    },
    'submit .new-task'(event, template) {

    event.preventDefault();
 
    const target = event.target;
    const text = target.text.value;
    const seiten_id = template.data._id;
    var log;
    Tasks.insert({
        status:0,
        seiten_id,
        text,
        need_picture: false,
        has_picture: false,
        has_legend: false,
        createdAt: new Date(),
        updatedAt: new Date(), 
        log, 
    });

    target.text.value = '';
  },
    
  'click .all_next_status': function(e, template){    
            
        var tasks=Tasks.find({"seiten_id":template.data._id}).fetch();
      
        if((($(tasks).get( 0 ).status*1)+1)!=9 || route=="abschluss"){ // only "abschluss"-role may change status 9   
            
            $(tasks).each(function( index ) {  

                   Tasks.update(this._id, {
                        $set: {
                                status:  (this.status*1)+1,
                                updatedAt: new Date()
                        },
                        $addToSet: {
                            log: { status: ((this.status*1)+1), date: new Date()}, 
                        },
                    });
            });
        }else{   
             alert("Nur Abschluss darf Gut zum Druck geben");   
        }
  },
    
  'drop li.seite' : function(e, t) {      
      $(".seite").removeClass("dropable");

        
        e.stopPropagation();
        e.preventDefault();
        task_id=e.originalEvent.dataTransfer.getData("text");
        Tasks.update(task_id, {
                    $set: {
                            seiten_id:  this._id,
                    },
                });
  },
    
  'dragenter .seite' : function(e, t) {
      $(".seite").removeClass("dropable");
    $(t.firstNode).addClass("dropable");
  },    
  'dragover .seite' : function(e, t) {
    e.originalEvent.preventDefault(); 
      e.originalEvent.dataTransfer.dropEffect = "move";
  },
  'dragleave .seite' : function(e, t) {
      $(e.originalEvent.target).removeClass("dropable");
  },
  'dragend .seite' : function(e, t) {
      $(".seite").removeClass("dropable");
  },
                     
  'click .toggle_has_app': function(){
        Seiten.update(this._id, {
            $set: { has_app: ! this.has_app },
        });
  },               
  'click .toggle_has_pdf': function(){
        Seiten.update(this._id, {
            $set: { has_pdf: ! this.has_pdf },
        });
  },           
  'click .toggle_has_picture_edit': function(){
        Seiten.update(this._id, {
            $set: { has_picture_edit: ! this.has_picture_edit },
        });
  },

});

  $(".seite").onDrop=function(e){
        e.stopPropagation();
        task_id=e.originalEvent.dataTransfer.getData("text");
        Tasks.update(task_id, {
                    $set: {
                            seiten_id:  this._id,
                    },
                });   
}