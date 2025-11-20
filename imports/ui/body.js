import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import { Seiten } from '../api/seiten.js';
import { Ausgaben } from '../api/ausgaben.js';
import { Tickets } from '../api/tickets.js';
import flatpickr from "flatpickr";
import 'flatpickr/dist/flatpickr.css';

import './seite.js';
import './task.js';
import './ticket.js';
import './body.html';

var _deps = new Tracker.Dependency;
var status_filter = [];
var picture_filter;
var legend_filter;
var planning_mode=false;
current_ausgabe=new ReactiveVar(0);
current_status_filter=new ReactiveVar([]);
current_web_status_filter=new ReactiveVar([]);
current_picture_filter=new ReactiveVar(false);
current_legend_filter=new ReactiveVar(false);

// var favicon=new Favico({
// 	animation:'slide'
// });


function toggle_planning_mode(){
	planning_mode=!planning_mode;

	if(planning_mode){
		url_planning_param="planung";
	}else{
		url_planning_param="";
	}
	if(route){
		FlowRouter.go('url_with_role', { route: route , planung: url_planning_param });
	}else{

		FlowRouter.go('url_without_role', { planung: url_planning_param });
	}

	if(planning_mode){
		$(document.body).addClass('planning_mode');
		$('textarea').each(function () {
			//              this.setAttribute('style', 'height:1em;overflow-y:hidden;');
			this.setAttribute('style', 'overflow-y:hidden;');

			this.style.height = 'auto';
			this.style.height = (this.scrollHeight) + 'px';
		}).on('input', function () {
			this.style.height = 'auto';
			this.style.height = (this.scrollHeight) + 'px';
		});


	}else{
		$(document.body).removeClass('planning_mode');

	}

}
function add_pages(nr,page_breaks){
	for (var i = 1; i <= nr; i++){

		Seiten.insert({
			nummer: i,
			createdAt: new Date(), // current time
			has_app: false,
			has_pdf: false,
			has_picture_edit: false,
			ausgaben_id: current_ausgabe.get(),
			has_inserat: false,
			inserat_desc:"",
			desc:"",
			linked_after: false,
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

		$(web_load_status).each(function( index ) {
			$(".toggle_web_status_list[name='"+this+"']").prop( "checked", true );
		});
		if(planning_url==true){
			toggle_planning_mode();
		}
		current_status_filter.set(load_status);
		current_web_status_filter.set(web_load_status);

		if(load_picture){
			$(".toggle_picture_filter").prop("checked",true);
			current_picture_filter.set(true);
		}

		if(load_picture_legend){
			$(".toggle_legend_filter").prop("checked",true);
			current_legend_filter.set(true);
		}
	}
}

Template.body.helpers({
	body_classes: function() {
		return (planning_mode==true)? "planning_mode":"no";
	},

	formatDate: function(date) {
		return moment(date).format('ddd HH:mm');
	},

	formatDayDate: function(date) {
		return moment(date).format('D.M.YYYY');
	},

	show: function(show_role) {
		return (show_role.split(",").indexOf(route)!=-1)? "show":"dont_show";
	},

	seiten() {
		return Seiten.find({ausgaben_id: current_ausgabe.get()}, { sort: { nummer: 1 } });
	},

	ausgaben() {
		// on data loaded: set ausgabe number as active
		if(current_ausgabe.get()==0){
			if(Ausgaben.find().count()>0){
				current_ausgabe.set(Ausgaben.findOne({vorlage: {$ne:true}}, { sort: { erscheinungsdatum: 1 } })._id);
			}
		}
		return Ausgaben.find({vorlage: {$ne:true}}, { sort: { erscheinungsdatum: 1 } });
	},

	ausgaben_vorlagen() {
		// on data loaded: set ausgabe number as active

		return Ausgaben.find({vorlage:true}, { sort: { erscheinungsdatum: 1 } });
	},

	tasks() {
		var or_query=[{$and: [{status: {$in: current_status_filter.get()}},{webtext:{$ne:true}}]}];
			or_query.push({$and: [{status: {$in: current_web_status_filter.get()}},{webtext:true}]});
		//	var or_query=[{status: {$in: current_status_filter.get()}}];
		//or_query.push({status: {$in: current_web_status_filter.get()}});

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

	tickets_inbox() {
		var inbox_tickets=Tickets.find({to:route, ausgaben_id: current_ausgabe.get()},{sort: { status:1, updatedAt: -1 } });
		var inbox_tickets_undone=Tickets.find({to:route, ausgaben_id: current_ausgabe.get(),status:0},{}).count();
		// favicon.badge(inbox_tickets_undone);
		document.title = "("+inbox_tickets_undone+") Seitenplan";
		return inbox_tickets;
	},

	tickets_outbox() {
		return Tickets.find({from:route, ausgaben_id: current_ausgabe.get()},{sort: { status:1,updatedAt: -1 } });
	},

	status_list: function(){
		return status_list;
	},

	web_status_list: function(){
		return web_status_list;
	},

		status_count: function(status){
			return Tasks.find({"status":status, ausgaben_id: current_ausgabe.get(), webtext:{$ne:true}}).count();
		},

			web_status_count: function(status){
				return Tasks.find({"status":status, ausgaben_id: current_ausgabe.get(), webtext:true}).count();
			},

	ausgabe_count: function(ausgaben_id){
		return Tasks.find({ausgaben_id: ausgaben_id}).count();
	},

	legend_count: function(status){
		return Tasks.find({$and: [{need_picture:true},{has_picture:true},{has_legend:false}, {ausgaben_id: current_ausgabe.get()}]}).count();
	},

	picture_count: function(status){
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

	layout_task_list: function(){
		var ausgabe=Ausgaben.findOne({_id:current_ausgabe.get()});
		if(ausgabe){
			return ausgabe.layout_tasks;
		}

	},

	layout_task_status: function(index){
		return (this[1])? "layout_task_done":"" ;
	},

	ticket_role_list: function(){ // returns a list with other roles, and marks the prefered default target
		var is_selected;
		var other_roles=[];
		var own_route_index;
		for(var i = ticket_roles.length - 1; i >= 0; i--) {
			if(ticket_roles[i][0] === route) {
				own_route_index=i;
			}
		}
		for(var i = ticket_roles.length - 1; i >= 0; i--) {
			if(own_route_index >-1) {
				if(ticket_roles[i][0] == ticket_roles[own_route_index][1]){ // default target
					is_selected="selected";
				}else{
					is_selected="";
				}
				other_roles.push([ticket_roles[i][0],is_selected]);
			}
		}
		return other_roles;
	},

	ticket_status: function(){
		var done_open= (this.status)? "ticket_done":"ticket_open" ;
		var alert= (this.alert && this.status!=1)? " pulse_infinite":"" ;
		return done_open+alert;
	},

	current_datetime: function(){
		date=new Date();
		return moment(date).format('ddd DD.MM.YYYY -  HH:mm');
	},

	user_role: function(){
		return (route)? "role_"+route:"";
	},

	current_ausgabe_name: function(){
		if(ausgaben_name=Ausgaben.findOne( { _id:current_ausgabe.get()})){
			return  ausgaben_name.bezeichnung;
		}
	},
	dont_display_if: function(f){
		return (f.includes(route) && route!="")? "dont_display":"";
	},
	display_if: function(f){
		return (f.includes(route) && route!="")? "":"dont_display";
	},


	web_tasks: function() {
		return Tasks.find({"ausgaben_id":current_ausgabe.get(),"webtext":true}, { sort: { order: 1 } });
	},

	connection_failed: function() {
		return !Meteor.status().status.startsWith("connect");
	}
});

Template.body.events({

	'click .toggle_status_list': function(e){
		$(e.currentTarget).attr("checked", ! $(e.currentTarget).attr("checked"));

		status_filter = $('.toggle_status_list:checked:enabled').map(function(index) {
			return $(this).attr("name")*1;
		});
		current_status_filter.set($.makeArray(status_filter));
	},

	'click .toggle_web_status_list': function(e){
		$(e.currentTarget).attr("checked", ! $(e.currentTarget).attr("checked"));

		web_status_filter = $('.toggle_web_status_list:checked:enabled').map(function(index) {
			return $(this).attr("name")*1;
		});
		current_web_status_filter.set($.makeArray(web_status_filter));
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


	'click .header_toggle_config_ausgaben'() {
		$(document.body).toggleClass("header_ausgaben_config");
		flatpickr($(".ausgabe_erscheinungsdatum"),{
			onChange: function(selectedDates, dateStr, instance) {
				Ausgaben.update(this._input.parentElement.parentElement.parentElement.id, {
					$set: {
						erscheinungsdatum: dateStr,
					},
				});
			}
		});
	},

	'click .ausgabe_vorlage_checkbox'() {
		Ausgaben.update(this._id, {
			$set: {
				vorlage: !this.vorlage,
			},
		});
	},

	'click .header_toggle_planning_mode'() {
		toggle_planning_mode();
	},

	'click .config_delete_all'() {
		if(confirm('Achtung! Alle Augaben, Seiten, Artikel in der Datenbank werden gelöscht!')){
			if(confirm('Wirklich ALLE DATEN löschen?')){
				Meteor.callAsync("deleteAll");
			}
		}
	},

	'click .config_delete_seiten'() {
		if(confirm('Achtung! Alle Seiten dieser Ausgabe werden gelöscht!')){
			if(confirm('Wirklich ALLE SEITEN dieser Ausgabe löschen?')){
				Meteor.callAsync("deleteSeiten",current_ausgabe.get());
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
		current_ausgabe.set(this._id);
	},

	'submit .neu_ausgabe'(event) {
		var layout_tasks_array=[];
		layout_list.forEach(function(element) {
			layout_tasks_array.push([element,false]);
		});
		event.preventDefault();
		Ausgaben.insert({
			bezeichnung:event.target.bezeichnung.value,
			layout_tasks:layout_tasks_array,
			page_break:0,
		});
		event.target.bezeichnung.value = '';
	},

	'click .ausgabe_delete'() {
		if(confirm('Ausgabe '+this.bezeichnung+' entfernen? ALLE Seiten und Artikel werden gelöscht!')){
			if(confirm('Ausgabe '+this.bezeichnung+' WIRKLICH entfernen?')){
				Meteor.callAsync("removeAusgabe",this._id);
				location.reload();
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
	'change .ausgabe_rename'(event) {
		event.preventDefault();
		Ausgaben.update(this._id, {
			$set: {
				bezeichnung: event.target.value,
			},
		});
	},
	'submit .ausgabe_datum'(event) {
		event.preventDefault();
		Ausgaben.update(this._id, {
			$set: {
				erscheinungsdatum: event.target.rename.value,
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
			        webtext:false,
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



	'click .layout_task'(e,t) {
		var ausgabe=Ausgaben.findOne({_id:current_ausgabe.get()});
		var layout_tasks_new=ausgabe.layout_tasks;
		var update_index=$(e.currentTarget).attr("name");
		layout_tasks_new[update_index]=[layout_tasks_new[update_index][0],!layout_tasks_new[update_index][1]];

		Ausgaben.update(current_ausgabe.get(), {
			$set: { layout_tasks: layout_tasks_new },
		});
	},

	'submit .new-ticket'(event, template) {

		event.preventDefault();
		const target = event.target;
		const text = target.text.value;
		const to = target.to.value;
		Tickets.insert({
			status:0,
			ausgaben_id: current_ausgabe.get(),
			text,
			to,
			from: route,
			alert: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		target.text.value = '';
	},
	'click .ticket_inbox'(e,t) {
		Tickets.update(this._id, {
			$set: { status: 1,
				updatedAt: new Date(), },
			});
		},
		'click .ticket_delete'(e,t) {
			Tickets.remove(this._id);
		},
		'click .ticket_outbox.ticket_done'(e,t) {
			Tickets.remove(this._id);
		},
		'click .ticket_alert'(e,t) {
			Tickets.update(this._id, {
				$set: { alert: !this.alert },
			});
		},
		'click .ticket_edit'(e,t) {
			$("#"+this._id+" .ticket_text_edit").toggle();
			$("#"+this._id+" .ticket_text").toggle();

		},

		'change .ticket_text_edit'(e, t) {
			e.preventDefault();
			Tickets.update(this._id, {
				$set: {
					text: e.target.value,
				},
			});

			$("#"+this._id+" .ticket_text_edit").toggle();
			$("#"+this._id+" .ticket_text").toggle();
		},
		'click .ausgabe_edit'(e,t) {
			$("#"+this._id+" .header_config_ausgabe").toggle();
			flatpickr($(".ausgabe_erscheinungsdatum"),{
				onChange: function(selectedDates, dateStr, instance) {
					Ausgaben.update(this._input.parentElement.parentElement.parentElement.id, {
						$set: {
							erscheinungsdatum: dateStr,
						},
					});
				}
			});

		},
		'submit .config_clone'(e,t) {
			event.preventDefault();
			var layout_tasks_array=[];
			layout_list.forEach(function(element) {
				layout_tasks_array.push([element,false]);
			});

			ausgaben_clone=Ausgaben.findOne({_id: $("#config_copy_from").val()});
			console.log(ausgaben_clone);
			clone_id=Ausgaben.insert({
				bezeichnung:$("#config_clone_name").val(),
				layout_tasks:layout_tasks_array,
				page_breaks:ausgaben_clone.page_breaks,
			});

			seiten_clone=Seiten.find({ausgaben_id: $("#config_copy_from").val()}).fetch();
			$(seiten_clone).each(function( index ) {
				seiten_id=Seiten.insert({
					nummer: seiten_clone[index].nummer,
					createdAt: new Date(),
					has_app: false,
					has_pdf: false,
					has_picture_edit: false,
					ausgaben_id: clone_id,
					has_inserat: seiten_clone[index].has_inserat,
					inserat_desc:seiten_clone[index].inserat_desc,
					desc:seiten_clone[index].desc,
					linked_after: seiten_clone[index].linked_after,
				});
				tasks_clone=Tasks.find({seiten_id: seiten_clone[index]._id}).fetch();
				$(tasks_clone).each(function( index ) {
					var log;
					Tasks.insert({
						status:0,
						seiten_id,
						ausgaben_id:clone_id,
						text:tasks_clone[index].text,
						need_picture: tasks_clone[index].need_picture,
						rf: tasks_clone[index].rf,
						has_picture: tasks_clone[index].has_picture,
						has_legend: tasks_clone[index].has_legend,
						createdAt: new Date(),
						updatedAt: new Date(),
						order: tasks_clone[index].order,
						length:tasks_clone[index].length,
						author:tasks_clone[index].author,
						date: tasks_clone[index].date,
						desc:tasks_clone[index].desc,
						collapsed: tasks_clone[index].collapsed,
						texttype: tasks_clone[index].texttype,
						textfields: tasks_clone[index].textfields,
						web_release: tasks_clone[index].web_release,
						webtext: false,
				        icml_downloaded:false,
						log,
					});
				}); // end tasks
			}); // end seiten

			tasks_web_clone=Tasks.find({webtext:true,ausgaben_id: $("#config_copy_from").val()}).fetch();
			$(tasks_web_clone).each(function( index ) {
				var log;
				Tasks.insert({
					status:0,
					seiten_id:"",
					ausgaben_id:clone_id,
					text:tasks_web_clone[index].text,
					need_picture: tasks_web_clone[index].need_picture,
					rf: tasks_web_clone[index].rf,
					has_picture: tasks_web_clone[index].has_picture,
					has_legend: tasks_web_clone[index].has_legend,
					createdAt: new Date(),
					updatedAt: new Date(),
					order: tasks_web_clone[index].order,
					length:tasks_web_clone[index].length,
					author:tasks_web_clone[index].author,
					date: tasks_web_clone[index].date,
					desc:tasks_web_clone[index].desc,
					collapsed: tasks_web_clone[index].collapsed,
					texttype: tasks_web_clone[index].texttype,
					textfields: tasks_web_clone[index].textfields,
					web_release: tasks_web_clone[index].web_release,
			        icml_downloaded:false,
					webtext: true,
					log,
				});
			});

			$("#config_clone_name").val("");
		},


		'submit .new-web-task'(event, template) {

			event.preventDefault();

			const target = event.target;
			const text = target.text.value;
			const seiten_id = "";
			const ausgaben_id = current_ausgabe.get();
			if(order= Tasks.findOne({"ausgaben_id":current_ausgabe.get(),},{sort:{order:-1}})){
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
				updatedAt: new Date(),
				order: order,
				length:"",
				author:"",
				date: "?",
				desc:"",
				texttype:"nor",
				textfields:texttype_textfields["nor"],
				log,
				webtext:true,
		        icml_downloaded:false,
			});

			target.text.value = '';
		},


		// leider hier die sektion aus seite.js nochmals kopiert... könnte irgendwie wohl auch zusammengefasst werden
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
		'dragenter li.task_drag_body' : function(e, t) {
			$(".task").removeClass("task_dropable");
			$(".task_drag_body").addClass("task_dropable");

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

			Tasks.update(original_id, {
				$set: {
					seiten_id: "",
					order:  new_order,
					webtext: true,
				},
			});
		},

		'click .flash-action--reload' : function() {
			window.location.reload();
		}
		// ende "leider hier..."
	});
