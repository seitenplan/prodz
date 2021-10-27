import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import { Seiten } from '../api/seiten.js';
import { Config } from '../api/config.js';
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

function task_web_update(id,new_status){
    console.log(new_status);
      Tasks.update(id, {
        $set: {
            web:  new_status,
        },
    });
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

Template.task.rendered = function() {
    if(!this._rendered) {
        var template = Template.instance();
template.$('.task_plan_desc').each(function () {
//              this.setAttribute('style', 'height:1em;overflow-y:hidden;');
             this.setAttribute('style', 'overflow-y:hidden;');

              this.style.height = 'auto';
              this.style.height = (this.scrollHeight) + 'px';
            }).on('input', function () {
              this.style.height = 'auto';
              this.style.height = (this.scrollHeight) + 'px';
        });

    }
}



Template.task.helpers({
    isSelectedStatus: function(thisstatus, parentstatus) {
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
    abschluss_mode: function(){
        if(route=="abschluss"){
            return true;
        }
    },

    show_picture_button: function(){
        return (this.need_picture)? false:true;
    },
    show_rf_button: function(){
        return (this.rf)? false:true;
    },
    showcase_status: function(){
        if(!this.showcase || this.showcase==0 ){
            return "showcase_0";
        }else if(this.showcase==1 ){
            return "showcase_1";
        }else if(this.showcase==2 ){
            return "showcase_2 strikethrough";
        }else{
            return (this.showcase);
        }
    },
    isSelectedDate: function(date) {
        return date == this.date ? 'selected' : '';
    },
    isSelectedWeb: function(web) {
        return web == this.web ? 'selected' : '';
    },

    dont_display_if: function(f){
        return (f.includes(route) && route!="")? "dont_display":"";
    },
    display_if: function(f){
        return (f.includes(route) && route!="")? "":"dont_display";
    },
    select_web_disabled: function(){
        return (route!="web")? "disabled":"";
    },
    select_web_display: function(){
        console.log(route=="web")
        return ((this.web && this.web!="") || route=="web")? "":"dont_display";
    },
    texttype_list: function(){
         return texttype_list;
    },
    texttype_current: function(this_text_id,parent_text_id){
      return this_text_id == parent_text_id ? 'texttype_current' : '';
    },


});

Template.task.events({

  'click .toggle_need_picture': function(e, template){
    Tasks.update(template.data._id, {
          $set: {
              need_picture: ! this.need_picture
          },
    });
    task_toggle_edit(this._id);
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
      task_status_update(template.data._id, (template.data.status*1)+1);
  },

  'change .select-status': function(e, template) {
      task_status_update(template.data._id, e.target.value*1);
  },

  'change .select-web': function(e, template) {
      task_web_update(template.data._id, e.target.value);
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

  'click .toggle_showcase': function(){
        if(!this.showcase || this.showcase==0 ){
            var new_showcase_status=1;
        } else if(this.showcase==1 ){
            var new_showcase_status=2;
        } else if(this.showcase==2 ){
            var new_showcase_status=0;
        }
        Tasks.update(this._id, {
            $set: { showcase: new_showcase_status },
        });
  },

  'click .task_add_button': function(){
    $(".task_add_dropdown").not(".task_add_dropdown"+this._id).hide();
    $(".task_texttype_menu").hide();
    $(".task_add_dropdown"+this._id).toggle();
  },

  'click .task_texttype_button': function(){
    $(".task_add_dropdown").hide();
    $(".task_texttype_menu").not(".task_texttype_menu"+this._id).hide();
    $(".task_texttype_menu"+this._id).toggle();
  },

  'click .task_textsubmit_button': function(){
       window.open(text_submit_baseurl+this._id, '_blank').focus();
    },

  'change .task_plan_onchange': function(e){
        Tasks.update(this._id, {
            $set: {
                text: $("[name='task_plan_title"+this._id+"']").val(),
                length: $("[name='task_plan_length"+this._id+"']").val(),
                author: $("[name='task_plan_author"+this._id+"']").val(),
                desc: $("[name='task_plan_desc"+this._id+"']").val(),
                date: $("[name='task_plan_date"+this._id+"']").val(),
                },
        });
  },

  'click .add_picture': function(){
    Tasks.update(this._id, {
          $set: {
              need_picture: true,
          },
    });
    $(".task_add_dropdown").hide();
  },
'click .add_rf': function(){
    Tasks.update(this._id, {
          $set: {
              rf: true,
          },
    });
    $(".task_add_dropdown").hide();
  },


'click .remove_rf': function(){
    Tasks.update(this._id, {
          $set: {
              rf: false,
          },
    });
  },


'click .remove_picture': function(){
    Tasks.update(this._id, {
          $set: {
              need_picture: false,
          },
    });
  },

  'click .task_collapse': function(){
    Tasks.update(this._id, {
        $set: { collapsed: ! this.collapsed },
    });
},

  'click .task_texttype_select': function(e, template){
    Tasks.update(template.data._id, {
    $set: { texttype: this.type_id, textfields: texttype_textfields[this.type_id]  },
    });
    $(".task_texttype_menu").hide();
},


  'click .task_texttype_close': function(e, template){
        $(".task_texttype_menu").hide();
},





});
