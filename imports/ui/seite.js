import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import { Seiten } from '../api/seiten.js';
import { Ausgaben } from '../api/ausgaben.js';


import './task.js';
import './seite.html';




Template.seite.helpers({

  tasks() {
       return Tasks.find({"seiten_id":this._id}, { sort: { order: 1 } });
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
    page_break : function(){
        var breaks=Ausgaben.findOne({_id:current_ausgabe.get()}).page_breaks;
       return (((this.nummer-1)/breaks)==Math.round((this.nummer-1)/breaks)) ? "page_break": "";
    },
    page_odd_even: function(){
        return (this.nummer%2 == 0) ? "seite_gerade":"seite_ungerade";
    },
    linked: function(){
              return (this.linked_after)? "seite_doppelseite":"";
    },
    page_pdf: function(){
              return (this.has_pdf)? "seite_pdf":"";
    },
    has_inserat: function(){
        return (this.has_inserat)? "has_inserat":"";
    },
    has_no_inserat: function(){
        return (this.has_inserat)? "has_no_inserat":"";
    },
    dont_display_if: function(f){
        return (f.hash.route==route)? "dont_display":""
    },
 });

Template.seite.events({

  'click .toggle-edit'() {
    $("#seite_edit_"+this._id).toggle();
  },

  'click .delete'() {
      if(confirm('Seite '+this.nummer+' entfernen?')){
        Meteor.callAsync("removeSeite",this._id);
    }
  },

    'change .seite_edit_nummer'(event, template) {
         Seiten.update(template.data._id, {
            $set: {
                nummer: event.target.value*1,
                },
        });
        $("#seite_edit_"+this._id).toggle();
    },

    'change .seite_edit_desc'(event, template) {
         Seiten.update(template.data._id, {
            $set: {
                desc: event.target.value,
                },
        });
        $("#seite_edit_"+this._id).toggle();
    },

     'change .seite_edit_desc_top'(event, template) {
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
    const ausgaben_id = template.data.ausgaben_id;
    if(order= Tasks.findOne({"seiten_id":template.data._id},{sort:{order:-1}})){
       order= order.order+1;
    }else{
        order=1;
    }
    var log;
    Tasks.insert({
        status:0,
        seiten_id,
        ausgaben_id,
        text,
        need_picture: false,
        rf: false,
        has_picture: false,
        has_legend: false,
        createdAt: new Date(),
        webtext:false,
        updatedAt: new Date(),
        order: order,
        length:"",
        author:"",
        date: "?",
        desc:"",
        texttype:"nor",
        textfields:texttype_textfields["nor"],
        icml_downloaded:false,
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

  'dragstart' : function(e, t) {
    $(".task_insert_end").show();
      console.log(e);
      console.log(t);
  },

  'dragenter li.task_drag' : function(e, t) {
       $(".task").removeClass("task_dropable");
      if(this.seiten_id==undefined){ // =  objekt ist Seite, ansonsten task
       $("#task_insert_"+this._id).addClass("task_dropable");
      }else{
       $("#"+this._id).addClass("task_dropable");
      }
  },
  'dragover li.task_drag' : function(e, t) {
        e.originalEvent.preventDefault();
        e.originalEvent.dataTransfer.dropEffect = "grabbing";
  },
  'dragleave li.task_drag' : function(e, t) {
      $(e.originalEvent.target).removeClass("task_dropable");
  },
  'dragend li.task_drag' : function(e, t) {
        $(".task").removeClass("task_dropable");
        $(".task_insert_end").hide();
    },
  'drop li.task_drag' : function(e, t) {
      $(".task").removeClass("task_dropable");
      $(".task_insert_end").hide();

      original_id=e.originalEvent.dataTransfer.getData("text");
      var previous_task_order=0;

      if(this.seiten_id==undefined){ // =  objekt ist Seite, ansonsten Task
        if($("#task_insert_"+this._id).prev("li")[0]){ // gibt es ein vorheriges element?
            previous_task_order=$("#task_insert_"+this._id).prev("li")[0].attributes.order.nodeValue;
        }
        new_seiten_id=this._id;
        new_order=(1000+previous_task_order*1)/2;

      }else{ //= objekt ist task
        if($("#"+this._id).prev("li")[0]){ // gibt es ein vorheriges element?
            previous_task_order=$("#"+this._id).prev("li")[0].attributes.order.nodeValue;
        }
        new_seiten_id=this.seiten_id;
        new_order=(this.order*1+previous_task_order*1)/2;
      }
      e.stopPropagation();
      e.preventDefault();
	  dragged_task=Tasks.findOne(original_id);

	  console.log(">>> "+dragged_task.webtext);
	  if (dragged_task.webtext==true){
		  newstatus=7;
		  was_webtext=true;
	  }else{
		  newstatus=dragged_task.status;
		  was_webtext=false;
	  }
      Tasks.update(original_id, {
          $set: {
            seiten_id: new_seiten_id,
            order:  new_order,
            webtext: false,
            status: newstatus,
			was_webtext: was_webtext,
            },
      });
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
    'click .seite_after'() {
        if(route=="layout" || route=="abschluss"){
            Seiten.update(this._id, {
                $set: { linked_after: ! this.linked_after },
            });
        }
  },
    'click .add_inserat'() {
            Seiten.update(this._id, {
                $set: { has_inserat: true ,
                        inserat_desc: "Reklame",
                      },
            });
  },
        'click .remove_inserat'() {
            Seiten.update(this._id, {
                $set: { has_inserat: false },
            });
  },
'change .inserat_desc': function(e){
    console.log($("[name='inserat_desc"+this._id+"']").val());
        Seiten.update(this._id, {
            $set: {
                inserat_desc: $("[name='inserat_desc"+this._id+"']").val(),
                },
        });
  },





});
