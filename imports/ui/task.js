import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import { Seiten } from '../api/seiten.js';
import './task.html';



 Template.task.helpers({
     // radiobutton checker
 //   hasPicture: function(status) {
   //     return has_picture === this.has_picture ? 'checked' : '';
    //},
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
       // return Seiten.findOne({"_id":seiten_id}).nummer;
    } ,
    formatDate: function(date) {
        return moment(date).format('ddd HH:mm');
    },
     lastStatus: function() {
        return this.status >= 6 ? 'last-status' : ''; 
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
   
    Tasks.update(template.data._id, {
        $set: {
                status:  (template.data.status*1)+1,
                updatedAt: new Date()
        },

    });
  },
  'click .toggle-checked'() {

    // Set the checked property to the opposite of its current value

    Tasks.update(this._id, {

      $set: { checked: ! this.checked },

    });

  },
    'click .toggle-status': function(e, template) {
        
        Tasks.update(template.data._id, {
            $set: { 
            status:  e.target.value*1,
            updatedAt: new Date()
            },

    });

  },
    'change .select-status': function(e, template) {
        Tasks.update(template.data._id, {
        $set: { 
            status:  e.target.value*1,
            updatedAt: new Date()
            },

    });
  },

  'click .toggle-edit'() {
    $(".task_edit_"+this._id).toggle();
    $(".task_title_"+this._id).toggle();
    $(".updated_"+this._id).toggle();
      
      
  },
    
    'change .task_title_edit'(event, template) {  
    event.preventDefault();
         Tasks.update(template.data._id, {
            $set: { 
                text: event.target.value,
                },
        });
        
    $(".task_edit_"+this._id).toggle();
    $(".task_title_"+this._id).toggle();
    $(".updated_"+this._id).toggle();
    },

  'click .task-delete'() {
      if(confirm('Artikel '+this.text+' entfernen?')){
          Tasks.remove(this._id);
      }
  },

});