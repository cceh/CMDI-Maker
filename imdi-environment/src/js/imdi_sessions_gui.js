/*
Copyright 2014 Sebastian Zimmer

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


imdi_environment.workflow[3].GUI = (function() {
	'use strict';

	var my = {};
	my.parent = imdi_environment;
	var l = my.parent.l;
	
	var resources = imdi_environment.workflow[1];
	var actor = imdi_environment.workflow[2];
	var session = imdi_environment.workflow[3];
	
	
	my.dom_element_prefix = "session_";

	var session_form;	
	var sessions_view;
	var actions;
	
	my.init = function(view, GUI_actions){
	
		session_form = my.parent.session_form();
		sessions_view = view;
		actions = GUI_actions;
		
		var pager_config = {
			render: my.renderSession,
			on_page_change: my.refresh,
			items_list: session.sessions.getAll(),
			view: view,
			items_per_page: 10,
			before_page_change: session.refreshVisibleBundlesInArray
		};
		
		my.pager = new APP.GUI.pager(pager_config);
		
	
	}

	my.view = function(){
	
		APP.GUI.scrollTop();
		
		my.pager.refresh(session.sessions.getAll());
	
	};
	
	
	my.createCopySessionOptions = function (fields_to_copy){
	
		var div = g("copy_sessions_select");
		
		if (!fields_to_copy){
		
			dom.span(div, "", "", l("function_currently_unavailable"));
			return;
			
		}

		var options = fields_to_copy;

		forEach(options, function(option){
		
			var input = dom.input(div, APP.CONF.copy_checkbox_element_prefix+option.name, "", "", "checkbox");
			input.checked = true;
			
			dom.spanBR(div, "", "", " "+option.label);
		
		});


	};
	
	
	my.refreshResources = function(session_id){
	//refresh resources for one session
	
		var add_resource_div = g(my.dom_element_prefix + session_id + "_resources_add_mf_div");

		add_resource_div.innerHTML = "";

		var select = document.createElement("select");
		
		dom.setSelectOptions(select, resources.resources.getAll(), "name", "take_index");

		if (resources.resources.length > 0){
		
			add_resource_div.appendChild(select);
			dom.br(add_resource_div);
			dom.button(add_resource_div, l("session", "add_to_session"), function(num) { 
				return function(){ actions.addResource(num, select.selectedIndex);  };
			}(session_id) );
			
		}

		if (resources.resources.length === 0){
		
			var h5 = dom.h5(add_resource_div, l("session", "no_files_have_been_added") + "<br>");
			dom.link(h5,"","",l("session", "add_some_files"), function(){APP.view(resources);});
			
		}
		
	};


	my.refresh = function(sessions){
	
		var sessions_view = g(APP.CONF.view_id_prefix + "session");
		
		sessions_view.innerHTML = "";
		
		my.pager.refresh(sessions);
		
		forEach(my.pager.visible_items, my.renderSession);
		
		if (sessions.length === 0){
	
			my.displayNoSessionText();
	
		}
	
	};
	

	my.refreshActorLists = function(sessions, persons){
		//Offer possibility to add every available actor to all session
		//refresh all sessions with available actors

		var all_available_actor_ids = getArrayWithIDs(persons);
		
		// for all visible bundles
		for (var i = 0; i < my.pager.visible_items.length; i++){
		
			my.refreshActorListInSession(my.pager.visible_items[i], all_available_actor_ids);

		}
		
	};
	
	
	my.renderSession = function(session_object){
		var session_id = session_object.id;
		var expanded = session_object.expanded;
		var dom_prefix = my.dom_element_prefix + session_id;
	
		//remove no sessions message before drawing new session
		if (g("no_session_text")) {
			sessions_view.innerHTML = "";
		}
		
		var form = APP.GUI.FORMS.expandableForm(
			sessions_view,
			dom_prefix,
			expanded,
			function(event){
				session_object.expanded = event.expanded;
			},
			actions.deleteSession,
			session_id
		);
		
		form.delete_icon.alt = l("session", "delete_session");
		form.delete_icon.title = l("session", "delete_session");
		
		form.display_icon.alt = l("session", "expand_collapse_session");
		form.display_icon.title = l("session", "expand_collapse_session");
		
		//create the form
		APP.forms.make(form.content, session_form, dom_prefix + "_", my.dom_element_prefix, session_object, my.makeSpecialFormInput);
		
		g(dom_prefix + "_session_name").addEventListener("blur", function(){
			my.refreshSessionHeading(session_object);
		});
		
		forEach(session_object.actors.actors, function(actor_id){
			my.renderActor(session_id, actor_id);
		});
		
		if (typeof (session_object.resources.resources.writtenResources) != "undefined"){
			
			forEach(session_object.resources.resources.writtenResources, function(file){
			
				file.id = my.resource_id_counter;
				my.renderResource(my.resource_id_counter, session_id, "wr", file.name, file.size);
				my.resource_id_counter += 1;
		
			});
		
		}
		
		if (typeof (session_object.resources.resources.mediaFiles) != "undefined"){
			
			forEach(session_object.resources.resources.mediaFiles, function(file){
			
				file.id = my.resource_id_counter;
				my.renderResource(file.id, session_id, "mf", file.name, file.size);
				my.resource_id_counter += 1;
				
			});
		
		}
		
		my.refreshActorListInSession(session_object);
		my.refreshSessionHeading(session_object);
		my.refreshResources(session_id);
	
	};
	
	
	my.makeSpecialFormInput = function(field, parent, element_id_prefix, element_class_prefix){
		
		if (field.name == "actors"){
			
			dom.br(parent);
			
			dom.make("div",element_id_prefix+"actors", "actors", parent);
			dom.make("div",element_id_prefix+"addActors_div", "actors", parent);
		
		}
		
		if (field.name == "resources"){
		
			dom.make("div",element_id_prefix+"resources", "mfs", parent);
			dom.make("div",element_id_prefix+"add_mf_div", "", parent);
		
		}
		
	};


	my.refreshActorName = function(session_id, actor_id){
		
		var actor_name = (actor.actors.getByID(actor_id).name != "") ? actor.actors.getByID(actor_id).name : l("actors", "unnamed_actor");

		
		var div_id = my.dom_element_prefix + session_id + "_actor_" + actor_id + "_label"
		var div = g(div_id);
		console.log(div_id);
		div.innerHTML = "<h2 class='actor_name_disp'>" + actor_name + "</h2>";  //display name of actor
		div.innerHTML += "<p class='actor_role_disp'>" + actor.actors.getByID(actor_id).role + "</p>";   //display role of actor

	};
	
	
	my.refreshActorListInSession = function(session){

		var actors = actor.actors;
		var aad = g(my.dom_element_prefix + session.id + "_actors_addActors_div");
		
		aad.innerHTML = "";

		var select = document.createElement("select");
		
		actors.forEach(function(actor, index){
		
			var actor_name = (actor.name != "") ? actor.name : l("actors", "unnamed_actor");
		
			var text = actor_name + " (" + actor.role + ")";
			dom.appendOption(select, text, index);
			
		});

		if (actors.length > 0){
		
			aad.appendChild(select);
		
			select.selectedIndex = 0;	
			
			dom.br(aad);	
			
			dom.button(aad, l("session", "add_to_session"), function(num) { 
				return function(){
					var actor_id = actors.IDof(select.selectedIndex);
					actions.addActor(num, actor_id);
				};
			}(session.id) );
			
		}
		
		if (actors.length === 0){
		
			var h5 = dom.h5(aad, l("session", "no_actors_in_db_yet") + "<br>");	
			
			dom.link(h5,"","",l("session", "create_some_actors"), function() { 
				APP.view(actor);  
			} );
			
		}
	
		
		//check if actor in session is part of actors[...].id(s)? if not, remove it immediately!
		forEach(session.actors.actors, function(ac){
		
			// if an actor k is not in all available actors, remove it in the session!
			if (actors.getArrayWithIDs().indexOf(ac) == -1){
				
				console.log("There is an actor in a session that does not exist anymore. Deleting!");
				actions.removeActor(session.id, ac);
			
			}
		
		
		});


	};


	my.displayNoSessionText = function(){

		console.log("Showing no session text");

		sessions_view.innerHTML = "";

		var no_sessions_message = dom.make("h2","no_session_text","no_session_text",sessions_view);
		no_sessions_message.innerHTML = l("session", "this_corpus_contains_no_sessions_yet") + " " + 
		l("session", "why_not_create_one__before_link");

		var new_session_link = dom.make("a","new_session_link","new_session_link",no_sessions_message);

		new_session_link.innerHTML = l("session", "why_not_create_one__link");

		no_sessions_message.innerHTML += l("session", "why_not_create_one__after_link");

		g("new_session_link").addEventListener('click', function() {actions.newSession(); });
		//we have to use g here instead of no_sessions_link, because letter isn't there anymore. it has been overwritten by ...innerHTML --> logically!
		
		sessions_view.scrollTop = 0;

	};


	my.renderActor = function(session_id, actor_id){
	
		if (actor.actors.getIndexByID(actor_id) == undefined){
			return;
		}
		
		dom.make("div", my.dom_element_prefix + session_id + "_actor_" + actor_id, "actor_in_session_wrap", g(my.dom_element_prefix+session_id+"_actors_actors"));
		var div = dom.make("div", my.dom_element_prefix+session_id+"_actor_" + actor_id + "_label", "actor_in_session", g(my.dom_element_prefix+session_id+"_actor_" + actor_id));
		
		my.refreshActorName(session_id, actor_id);
		
		APP.GUI.icon(g(my.dom_element_prefix+session_id+"_actor_" + actor_id),
		"delete_actor_" + actor_id + "_icon", "delete_actor_icon", "reset", function(num, num2) { 
			return function(){
				actions.removeActor(num, num2);  
			};
		}(session_id, actor_id));

	};


	my.renderResource = function(resource_id, session_id, type, name, size){

		var div = dom.make('div', my.dom_element_prefix+session_id+"_mediafile_" + resource_id, type, g(my.dom_element_prefix+session_id+"_resources_resources"));

		var h3 = dom.h3(div);
		
		if (type == "wr"){
			h3.innerHTML = "Written Resource";
		}
		
		else if (type == "mf"){
			h3.innerHTML = "Media File";	
		}
		
		else {
			console.log("ERROR: Strange File type!");
			return;
		}
		
		APP.GUI.icon(div,"delete_resource_" + resource_id +"_icon","delete_resource_icon","reset", function(num, num2) { 
			return function(){ actions.removeResource(num, num2);  
			};
		}(session_id,resource_id));
		
		dom.span(div, "", "resource_file_content_span",
		"File Name<br><input type=\"text\" name=\""+my.dom_element_prefix+session_id+"_mediafile_" + resource_id + "_name\" value=\"\"><br>"+
		"Size<br><input type=\"text\" name=\""+my.dom_element_prefix+session_id+"_mediafile_" + resource_id + "_size\" value=\"\">");
		
		div.getElementsByTagName("input")[0].value = name;
		div.getElementsByTagName("input")[1].value = size;


	};


	my.refreshSessionHeading = function(session_object){
	
		var session_id = session_object.id;	
		var session_label = g(my.dom_element_prefix + session_id + "_label");
	
		if ((!session_object.session) || (!session_object.session.name) || (session_object.session.name === "")){
		
			session_label.innerHTML = l("session", "unnamed_session");
			
		}
		
		else {
		
			session_label.innerHTML = l("session", "session") + ": " + session_object.session.name;
			
		}

	};
	
	
	my.updateActorNameInAllSessions = function(actor_id){
	
		my.pager.visible_items.forEach(function(sess){
	
			//search for actor_id in this session's actors
			if (sess.actors.actors.indexOf(actor_id) != -1){
				
				my.refreshActorName(sess.id, actor_id);
		
			}
	
			
		});
		
	};

	
	return my;

})();