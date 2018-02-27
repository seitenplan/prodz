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
        
    Tasks.insert({
        status:0,
        seiten_id,
        text,
        need_picture: false,
        has_picture: false,
        has_legend: false,
        createdAt: new Date(),
        updatedAt: new Date(), 
    });

    target.text.value = '';
  },
    
  'click .all_next_status': function(e, template){
        var tasks=Tasks.find({"seiten_id":template.data._id}).fetch();
      
        $(tasks).each(function( index ) {  
            
               Tasks.update(this._id, {
                    $set: {
                            status:  (this.status*1)+1,
                            updatedAt: new Date()
                    },
                });
 
        });

  },

});