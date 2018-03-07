import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import { Seiten } from '../api/seiten.js';
import './task.html';


function task_status_update(id,new_status){
    if(new_status!=9 || route=="abschluss"){ // only "abschluss"-role may change status 9
    Tasks.update(id, {
        $set: {
            status:  new_status,
            updatedAt: new Date(),
        },       
        $addToSet: {
            log: { status: new_status, date: new Date()}, 
        },
    });
    }else{
     alert("Nur Abschluss darf Gut zum Druck geben");   
    }
}
function task_toggle_edit(id){
    $(".task_edit_"+id).toggle();
    $(".task_title_"+id).toggle();
    $(".updated_"+id).toggle();
    if($(".task_edit_"+id).css("display")=="none" || $(".task_edit_"+id).css("display")==undefined){ // prevent dragging in edit-mode (else text is not selectable)
            $("#"+id).attr("draggable", true);
    }else{
            $("#"+id).attr("draggable", false);
    }
}

Template.task.helpers({
    isSelected: function(thisstatus, parentstatus) {
        return thisstatus == parentstatus ? 'selected' : '';
    },
    status_list: function(){
       return status_list;
    },
    nextStatusName: function(){
       return status_list[((1*this.status)+1)];
    } ,
    nextStatusId: function(){
       return (this.status+1);
    } ,
    seitenNummer: function(seiten_id){
        var get_number=Seiten.findOne({"_id":seiten_id});
        return (get_number) ? get_number.nummer : ''
    } ,
    formatDate: function(date) {
        return moment(date).format('ddd HH:mm');
    },
    getStatus: function(i) {
        return status_list[i];
    },
    lastStatus: function() {
        return this.status > (status_list.length-2) ? 'last-status' : ''; 
    }, 
});
    
        


Template.task.events({
   
  'click .toggle_need_picture': function(e, template){
    Tasks.update(template.data._id, {
          $set: { 
              need_picture: ! this.need_picture 
          },
    });
  },
    
  'click .toggle_has_picture': function(e, template){
    Tasks.update(template.data._id, {
          $set: { has_picture: ! this.has_picture },
    });
  },
    
  'click .toggle_has_legend': function(e, template){
    Tasks.update(template.data._id, {
          $set: { has_legend: ! this.has_legend },
    });
  }, 
    
  'click .next_status': function(e, template){
      console.log("---"+route);
      task_status_update(template.data._id, (template.data.status*1)+1);
  },
     
  'change .select-status': function(e, template) {   
      task_status_update(template.data._id, e.target.value*1);
  },
    
  'click .toggle-edit'() {
    task_toggle_edit(this._id);
  },
        
  'click .toggle_log'() {
    $(".task_log_"+this._id).toggle();
  },

  'change .task_title_edit'(event, template) {  
    event.preventDefault();
    Tasks.update(template.data._id, {
            $set: { 
                text: event.target.value,
                },
        });
    task_toggle_edit(this._id);
  },

  'click .task-delete'() {
      if(confirm('Artikel '+this.text+' entfernen?')){
          Tasks.remove(this._id);
      }
  },

  'dragstart .task' : function(e, t) {
        e.originalEvent.dataTransfer.setData('text', this._id);
        e.originalEvent.dataTransfer.effectAllowed = 'move';
  },

});