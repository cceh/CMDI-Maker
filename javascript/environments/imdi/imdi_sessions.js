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


imdi_environment.workflow[3] = (function(resources, actor) {
	'use strict';

	var my = {};
	my.parent = imdi_environment;
	var l = my.parent.l;
	
	var session_form = my.parent.session_form;
	
	my.identity = {
		id: "session",
		title: "Sessions",
		icon: "edit.png",
	};
	
	my.sessions = [];
	my.id_counter = 0;
	my.resource_id_counter = 0;

	my.reset = function(){ my.eraseAll(); };
	
	my.init = function(){
	
		my.displayNoSessionText();
		
		my.sessions = [];
		my.id_counter = 0;
		my.resource_id_counter = 0;

	};
	
	
	my.view = function(){
	
		dom.scrollTop();
	
	};
	
	
	my.recall = function(data){
		
		for (var s=0; s<data.length; s++){
		
			my.sessions.push(data[s]);
			my.sessions[s].id = my.getNewSessionID();
		}
		
		my.refreshSessionsDisplay();
	
	};
	
	
	my.getSaveData = function(){
	
		my.refreshSessionsArray();
	
		return my.sessions;
	
	};
	
	
	my.refreshSessionsArray = function(){
	
		var array = [];
	
		for (var s=0; s<my.sessions.length; s++){
		
			var session_object = my.sessions[s];
			
			APP.forms.fillObjectWithFormData(session_object, APP.CONF.session_dom_element_prefix+my.sessions[s].id+"_", session_form());		
			
			array.push(session_object);
		}
		
		my.sessions = array;	
	
	};
	
	
	my.createCopySessionOptions = function (){
		var sf = session_form();

		var div = g("copy_sessions_select");
		
		if (!sf.fields_to_copy){
		
			dom.newElement("span", "", "", div, l("function_currently_unavailable"));
			return;
			
		}

		var options = sf.fields_to_copy;

		for (var c=0; c<options.length; c++){
		
			var input = dom.input(div, APP.CONF.copy_checkbox_element_prefix+options[c].name, "", "", "checkbox");
			input.checked = true;
			
			dom.span(div, "", "", " "+options[c].label);
			dom.br(div);
		
		}


	};
	
	
	my.functions = function(){
		return [
			{
				label: l("session", "new_session"),
				icon: "plus.png",
				id: "link_newSession",
				onclick: function() {my.newSession(); }
			},
			{
				label: l("session", "copy_session_1_metadata"),
				icon: "copy.png",
				id: "link_copy_sessions",
				wrapper_id: "copy_sessions_div",
				type: "function_wrap",
				sub_div: "copy_sessions_select",
				onclick: function() { my.assignSession1Metadata(); },
				after_that: my.createCopySessionOptions
			},
			{
				label: l("session", "reset_form"),
				icon: "reset.png",
				id: "session_link_reset_form",
				onclick: function() {       

					alertify.set({ labels: {
						ok     : l("no"),
						cancel : l("yes_delete_form")
					} });
					
					alertify.confirm(l("really_reset_form"), function (e) {
						if (e) {
							// user clicked "ok"
						}
				
						else {
							// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button=
							APP.environments.resetActive();
							alertify.log(l("form_reset"),"",5000);
							
						}
					});
				}
			},
			{
				label: l("session", "sort_by_name"),
				icon: "az.png",
				id: "session_link_sort_by_name",
				onclick: function() { my.sortAlphabetically(); }
			}
		];
	};
	

	my.refreshResources = function(s){
	//refresh resources for one session

		g(APP.CONF.session_dom_element_prefix+my.sessions[s].id+"_resources_add_mf_div").innerHTML = "";

		var select = document.createElement("select");
		
		for (var i=0; i<resources.available_resources.length; i++){ 
			
			var NewOption = new Option( resources.available_resources[i][0], i, false, true);
			select.options[select.options.length] = NewOption;		
			
		}

		if (resources.available_resources.length > 0){
		
			g(APP.CONF.session_dom_element_prefix+my.sessions[s].id+"_resources_add_mf_div").appendChild(select);
		
			select.selectedIndex = 0;	
		
			var add_button = document.createElement("input");
			add_button.type = "button";
			add_button.value = l("session", "add_to_session");
			
			dom.br(g(APP.CONF.session_dom_element_prefix+my.sessions[s].id+"_resources_add_mf_div"));
			g(APP.CONF.session_dom_element_prefix+my.sessions[s].id+"_resources_add_mf_div").appendChild(add_button);		
			
			add_button.addEventListener('click', function(num) { 
				return function(){ my.addResource(num, select.selectedIndex);  };
			}(my.sessions[s].id) );
			
		}

		if (resources.available_resources.length === 0){
		
			var p = document.createElement("h5");
			g(APP.CONF.session_dom_element_prefix+my.sessions[s].id+"_resources_add_mf_div").appendChild(p);
			p.innerHTML = l("session", "no_files_have_been_added") + "<br>";
		
			dom.a(p,"","","#",l("session", "add_some_files"), function(){APP.view(resources);});
			
		}
		
	};


	my.newSession = function(){

		var session_object = APP.forms.createEmptyObjectFromTemplate(my.parent.session_form());
		session_object.id = my.getNewSessionID();
		
		//new sessions are always expanded
		session_object.expanded = true;
		
		//push new session object into sessions array
		my.sessions.push(session_object);

		my.drawNewSession(session_object);
		
		return session_object.id;
	};
	
	
	my.getNewSessionID = function(){
	
		//this is the id, always unique, even if session created after one is deleted
		var session_id = my.id_counter;
		
		my.id_counter += 1;
		
		return session_id;
	
	};
	
	
	my.createNewSessionWithResources = function(name, expanded, resources){
	
		var session_object = APP.forms.createEmptyObjectFromTemplate(my.parent.session_form());
		session_object.session.name = name;
		session_object.expanded = expanded;
		session_object.id = my.getNewSessionID();
		my.sessions.push(session_object);
		
		my.drawNewSession(session_object);
		
		for (var r=0; r<resources.length; r++){
		
			my.addResource(session_object.id, resources[r]);
			
		}
		
		APP.log(l("session", "new_session_has_been_created") + "<br>" +
		l("session", "name") + ": " + name);
		
		return session_object.id;
		
	};
	
	
	my.refreshSessionsDisplay = function(){
	
		var sessions_view = g(APP.CONF.view_id_prefix + my.identity.id);
		
		sessions_view.innerHTML = "";
		
		if (my.sessions.length === 0){
	
			my.displayNoSessionText();
			return;
	
		}
		
		for (var s=0; s<my.sessions.length; s++){
		
			my.drawNewSession(my.sessions[s]);
		
		}
	
	};
	
	
	my.drawNewSession = function(session_object){
		var r;
		var file;
	
		var session_id = session_object.id;
		var session_expanded = session_object.expanded;
	
		var sessions_view = g(APP.CONF.view_id_prefix + my.identity.id);
	
		//remove no sessions message before drawing new session
		if (g("no_session_text")) {
			sessions_view.innerHTML = "";
		}
		
		var session_div = dom.newElement('div',APP.CONF.session_dom_element_prefix+session_id,'session_div',sessions_view); 
		//sessions_count is right! but it has to be clear which session in sessions has which session_id

		var session_header = dom.newElement('div',APP.CONF.session_dom_element_prefix+session_id+'_header','session_header',session_div);
		session_header.addEventListener('click', function(num) { 
			return function(){
				my.display(num);  
			};
		}(session_id) );

		var session_label = dom.newElement('a',APP.CONF.session_dom_element_prefix+session_id+'_label','session_label',session_header);
		
		if ((!session_object.session) || (!session_object.session.name) || (session_object.session.name === "")){
		
			session_label.innerHTML = "<h1 class=\"session_heading\">" + l("session", "unnamed_session") + "</h1>";
			my.sessions[my.getSessionIndexFromID(session_id)].session.name = "";
			
		}
		
		else {
			session_label.innerHTML = "<h1 class=\"session_heading\">" + l("session", "session") + ": " + session_object.session.name + "</h1>";
			my.sessions[my.getSessionIndexFromID(session_id)].session.name = session_object.session.name;
		
		}

		session_label.href = "#";

		//create icon for deleting the session
		var session_delete_link = dom.newElement('a',APP.CONF.session_dom_element_prefix+session_id+'_delete_link','session_delete_link',session_header);
		session_delete_link.addEventListener('click', function(num) {

			return function(event){	//only event must be a parameter of the return function because event is to be looked up when the event is fired, not when calling the wrapper function
				event.stopPropagation();
				my.userErase(num);  
			};
			
		}(session_id) );
		session_delete_link.innerHTML = "<img id=\""+APP.CONF.session_dom_element_prefix+session_id+"_delete_img\" class=\"delete_img\" src=\""+APP.CONF.path_to_icons+"reset.png\" alt=\"" + l("session", "delete_session") + "\">";
		session_delete_link.href = "#";
		
		//create icon to expand/collapse the session
		var session_display_link = dom.newElement('a',APP.CONF.session_dom_element_prefix+session_id+'_display_link','session_display_link',session_header);
		session_display_link.innerHTML = "<img id=\""+APP.CONF.session_dom_element_prefix+session_id+"_expand_img\" class=\"expand_img\" src=\""+APP.CONF.path_to_icons+"down.png\">";
		session_display_link.href = "#";


		var session_content = dom.newElement('div',APP.CONF.session_dom_element_prefix+session_id+'_content','session_content',session_div);

		//create the form
		APP.forms.make(session_content, session_form(), APP.CONF.session_dom_element_prefix+session_id+"_", APP.CONF.session_dom_element_prefix, session_object);
		
		g(APP.CONF.session_dom_element_prefix+session_id+"_session_name").addEventListener("blur", function(num){
		
			return function(){
			
				my.refreshSessionHeading(num);
			};
		}(session_id) );
		
		
		if (typeof(session_object.actors.actors) != "undefined"){
		
			for (var a=0; a<session_object.actors.actors.length; a++){
		
				my.renderActor(session_id, session_object.actors.actors[a]);
		
			}
		}
		
		
		if (typeof(session_object.resources.resources.writtenResources) != "undefined"){
			
			for (r=0; r<session_object.resources.resources.writtenResources.length; r++){
			
				file = session_object.resources.resources.writtenResources[r];	
				file.id = my.resource_id_counter;
				my.renderResource(my.resource_id_counter, session_id, "wr", file.name, file.size);
				
				my.resource_id_counter += 1;
		
			}
		
		}
		
		
		if (typeof(session_object.resources.resources.mediaFiles) != "undefined"){
			
			for (r=0; r<session_object.resources.resources.mediaFiles.length; r++){
			
				file = session_object.resources.resources.mediaFiles[r];
				file.id = my.resource_id_counter;
				my.renderResource(file.id, session_id, "mf", file.name, file.size);

				my.resource_id_counter += 1;
			}
		
		}
		
		my.refreshResources(my.getSessionIndexFromID(session_id));
		
		var all_available_actor_ids = [];
		
		forEach(actor.actors, function(actor){
			all_available_actor_ids.push(actor.id);
		});   // find a better place for that

		my.refreshActorListInSession(my.getSessionIndexFromID(session_id),all_available_actor_ids);
		
		if (session_expanded === false){
			my.display(session_id);
		}
	
	
	};
	
	
	my.refreshActorName = function(session_id, actor_id){

		var div = g(APP.CONF.session_dom_element_prefix + session_id + "_actor_" + actor_id + "_label");
		div.innerHTML = "<h2 class='actor_name_disp'>" + actor.actors[actor.getActorsIndexFromID(actor_id)].name + "</h2>";  //display name of actor
		div.innerHTML += "<p class='actor_role_disp'>" + actor.actors[actor.getActorsIndexFromID(actor_id)].role + "</p>";   //display role of actor


	};
	
	
	my.getName = function(session_index){

		if (my.sessions[session_index].name === ""){
		
			return l("session", "unnamed_session");
			
		}
		
		else {
			return l("session", "session") + ": " + my.sessions[session_index].name;
		
		}
		
	};
	
	
	my.getSessionIndexFromID = function(session_id){

		for (var i = 0; i < my.sessions.length; i++) {
			if (my.sessions[i].id == session_id) {
				return i;
			}
		}
		
		alert("An error has occured.\nCould not find session index from session_id!\n\nsession_id = " + session_id);
		console.log(sessions);
		

	};
	
	
	my.refreshActorListInSession = function(s,all_available_actor_ids){

		var aad = g(APP.CONF.session_dom_element_prefix+my.sessions[s].id+"_actors_addActors_div");
		
		aad.innerHTML = "";

		var select = document.createElement("select");
		
		for (var a=0;a<actor.actors.length;a++){ 
		
			var value = actor.actors[a].name + " (" + actor.actors[a].role + ")";
			
			var NewOption = new Option( value, a, false, true);
			select.options[select.options.length] = NewOption;		
			
		}

		if (actor.actors.length > 0){
		
			aad.appendChild(select);
		
			select.selectedIndex = 0;	
			
			dom.br(aad);	
			
			var add_button = dom.input(aad,"","","","button", l("session", "add_to_session"));
			add_button.addEventListener('click', function(num) { 
				return function(){ my.addActor(num, actor.actors[select.selectedIndex].id);  };
			}(my.sessions[s].id) );
			
		}
		
		if (actor.actors.length === 0){
		
			var h5 = dom.h5(aad, l("session", "no_actors_in_db_yet") + "<br>");	
			
			dom.a(h5,"","","#",l("session", "create_some_actors"), function() { 
				APP.view(actor);  
			} );
			
		}
		
		
		console.log("Refreshing Actor List of Session "+s);
		
		
		//check if actor in session is part of actors[...].id(s)? if not, remove it immediately!
		for (var k=0;k<my.sessions[s].actors.actors.length;k++){
			
			console.log("Trying to find id " + my.sessions[s].actors.actors[k] + " in actors of session "+s);
			
			// if an actor k is not in all available actors, remove it in the session!
			if (all_available_actor_ids.indexOf(my.sessions[s].actors.actors[k]) == -1){
				
				console.log("There is an actor in session "+s+" that does not exist anymore. Deleting!");
				my.removeActor(my.sessions[s].id,my.sessions[s].actors.actors[k]);
			
			}
		
		
		}


	};


	my.refreshActorLists = function(actors){
		//Offer possibility to add every available actor to all session
		//refresh all sessions with available actors

		var all_available_actor_ids = [];
		
		for (var n=0; n<actors.length; n++){
			all_available_actor_ids.push(actors[n].id);
		}
		
		for (var s=0;s<my.sessions.length;s++){   //for all existing sessions
		
			my.refreshActorListInSession(s,all_available_actor_ids);

		}

	};
	
	
	my.sortAlphabetically = function(){
		
		//Before we sort the sessions, we save the newest user input
		my.refreshSessionsArray();
		
		my.sessions = sortBySubKey(my.sessions,["session","name"]);
		my.refreshSessionsDisplay();
		
		console.log("Sessions sorted by name");
		
	};


	my.userErase = function(session_id){

		alertify.set({ labels: {
			ok     : l("no"),
			cancel : l("session", "yes_delete_session")
		} });

		alertify.confirm(l("session", "really_erase_session"), function (e) {

			if (e) {
				// user clicked "ok"
				
			}
		
			else {
				// user clicked "cancel"
				my.erase(session_id);

				APP.log(l("session", "session_deleted"));
			}
		});


	};


	my.erase = function (session_id){

		dom.remove(APP.CONF.session_dom_element_prefix+session_id);
		
		my.sessions.splice(my.getSessionIndexFromID(session_id),1);
		
		if (my.sessions.length === 0) {
			my.displayNoSessionText();
		} 


	};
	
	
	my.getIndexFromResourceID = function (resource_id){
		var r;

		for (var s=0;s<my.sessions.length;s++){
		
			for (r=0; r<my.sessions[s].resources.writtenResources.length; r++){
		
				if (my.sessions[s].resources.writtenResources[r].id == resource_id){
					return r;
				}
			
			}
			
			for (r=0; r<my.sessions[s].resources.mediaFiles.length; r++){
		
				if (my.sessions[s].resources.mediaFiles[r].id == resource_id){
					return r;
				}
			
			}
		
		
		
		}


	};
	

	my.displayNoSessionText = function(){

		console.log("Showing no session text");

		var sessions_view = g(APP.CONF.view_id_prefix + my.identity.id);
		
		sessions_view.innerHTML = "";

		var no_sessions_message = dom.newElement("h2","no_session_text","no_session_text",sessions_view);
		no_sessions_message.innerHTML = l("session", "this_corpus_contains_no_sessions_yet") + " " + 
		l("session", "why_not_create_one__before_link");

		var new_session_link = dom.newElement("a","new_session_link","new_session_link",no_sessions_message);

		new_session_link.innerHTML = l("session", "why_not_create_one__link");
		new_session_link.href = "#";

		no_sessions_message.innerHTML += l("session", "why_not_create_one__after_link");

		g("new_session_link").addEventListener('click', function() {my.newSession(); });
		//we have to use g here instead of no_sessions_link, because letter isn't there anymore. it has been overwritten by ...innerHTML --> logically!
		
		sessions_view.scrollTop = 0;

	};


	my.eraseAll = function (){

		while (my.sessions.length > 0){
		
			my.eraseLast();
		
		}

	};



	my.eraseLast = function(){

		if (my.sessions.length > 0){
		
			my.erase(my.sessions[my.sessions.length-1].id);

		}
		
		else {
		
			alert("There is no session to be erased!\nTo erase one, you have to create one first.");
		
		}
	};


	my.addActor = function(session_id, actor_id){
	//add existing actor to session
	//new actors are only created in manage actors


		//if session doesn't already contain this actor
		if (my.sessions[my.getSessionIndexFromID(session_id)].actors.actors.indexOf(actor_id) == -1){
		
			if (actor.actors[actor.getActorsIndexFromID(actor_id)]){  //check if actor still exists before adding
		
				my.sessions[my.getSessionIndexFromID(session_id)].actors.actors.push(actor_id);
			
				my.renderActor(session_id, actor_id);
				
			}
			
			else {
			
				console.log("Tried to add actor to session although this actor is not in the actors database. This is odd.");
				return;
			
			}

		}
		
		else {
		
			APP.log(l("session", "this_actor_is_already_in_the_session"),"error");
		
		}
	};


	my.renderActor = function(session_id, actor_id){

		dom.newElement("div", APP.CONF.session_dom_element_prefix + session_id + "_actor_" + actor_id, "actor_in_session_wrap", g(APP.CONF.session_dom_element_prefix+session_id+"_actors_actors"));
		var div = dom.newElement("div", APP.CONF.session_dom_element_prefix+session_id+"_actor_" + actor_id + "_label", "actor_in_session", g(APP.CONF.session_dom_element_prefix+session_id+"_actor_" + actor_id));
		
		my.refreshActorName(session_id, actor_id);
		
		var img = dom.img(g(APP.CONF.session_dom_element_prefix+session_id+"_actor_" + actor_id),
		"delete_actor_"+actor_id+"_icon", "delete_actor_icon", APP.CONF.path_to_icons+"reset.png");
		img.addEventListener('click', function(num, num2) { 
			return function(){ my.removeActor(num, num2);  
			};
		}(session_id, actor_id));

	};


	my.removeActor = function(session_id, actor_id){

		var position_in_array = my.sessions[my.getSessionIndexFromID(session_id)].actors.actors.indexOf(actor_id);
		
		console.log("Removing actor. Position in array: " + position_in_array);

		//remove actor_id in array
		my.sessions[my.getSessionIndexFromID(session_id)].actors.actors.splice(position_in_array,1);
		
		dom.remove(APP.CONF.session_dom_element_prefix+session_id+"_actor_"+actor_id);
		
		APP.save();
		
	};


	my.addResource = function(session_id, resource_file_index, without_questions){
	// resource_file_index is the index of the available media file, that is to be added to the session
	// if resource_file_index is -1, a new empty field with no available media file is created
	//if without_questions == true, no alerts will be thrown (e.g. when resources are added at start up)
	
		var resource_type;

		if (resource_file_index >= resources.available_resources.length){
			return;
		}
		
		var resource_id = my.resource_id_counter;

		if ((resources.getValidityOfFile(resources.available_resources[resource_file_index][0]) === 0)
		|| (resources.getValidityOfFile(resources.available_resources[resource_file_index][0]) == 2)){
			//Media File
		
			resource_type = "mf";
		
			my.sessions[my.getSessionIndexFromID(session_id)].resources.resources.mediaFiles.push({
				name: resources.available_resources[resource_file_index][0],
				size: resources.available_resources[resource_file_index][2],
				id: my.resource_id_counter,
				resource_file_index: resource_file_index
			});

		}
		
		else if ((resources.getValidityOfFile(resources.available_resources[resource_file_index][0]) == 1)
		|| (resources.getValidityOfFile(resources.available_resources[resource_file_index][0]) == 3)){
		
			resource_type = "wr";
		
			my.sessions[my.getSessionIndexFromID(session_id)].resources.resources.writtenResources.push({
				name: resources.available_resources[resource_file_index][0],
				size: resources.available_resources[resource_file_index][2],
				id: my.resource_id_counter,
				resource_file_index: resource_file_index
			});
			
		}
		
		else {
		
			if (!without_questions){
			
				APP.alert(l("session", "unknown_file_problem__before_filename") + "<br>" +
				resources.available_resources[resource_file_index][0] + 
				"<br>" + l("session", "unknown_file_problem__after_filename"));
			
			}
			
			resource_type = "wr";
			
			my.sessions[my.getSessionIndexFromID(session_id)].resources.resources.writtenResources.push({
				name: resources.available_resources[resource_file_index][0],
				size: resources.available_resources[resource_file_index][2],
				id: my.resource_id_counter,
				resource_file_index: resource_file_index
			});
			
		}
		
		var filename;
		var filesize;
		
		if (resource_file_index!=-1){
		// if an existing media file is added, adopt its name and date to the input fields
			filename = resources.available_resources[resource_file_index][0];	//name
			filesize = resources.available_resources[resource_file_index][2];	//size

		}
		
		else {
			filename = "";
			filesize = "";
		}	
		
		
		//Rename the session if an EAF file is added for the first time and session has no name yet
		if ((getFileTypeFromFilename(filename) == "eaf") && (get(APP.CONF.session_dom_element_prefix+session_id+"_session_name") === "")){
		
			var name = removeEndingFromFilename(resources.available_resources[resource_file_index][0]);
			
			g(APP.CONF.session_dom_element_prefix+session_id+"_session_name").value = name;
			
			my.refreshSessionHeading(session_id);
		
			alertify.log(l("session", "session_name_taken_from_eaf"),"",8000);
		
		}
		
		
		//Check, if there is a date string in the form of YYYY-MM-DD in the filename of an eaf file. If so, adopt it for the session date
		//only, if session date is still YYYY
		if ((getFileTypeFromFilename(filename) == "eaf") && (get(APP.CONF.session_dom_element_prefix+session_id+"_session_date_year") == "YYYY")){
			
			var date = parseDate(resources.available_resources[resource_file_index][0]);
			
			if (date !== null){
			
				g(APP.CONF.session_dom_element_prefix+session_id+"_session_date_year").value = date.year;
				g(APP.CONF.session_dom_element_prefix+session_id+"_session_date_month").value = date.month;
				g(APP.CONF.session_dom_element_prefix+session_id+"_session_date_day").value = date.day;
				
				APP.log(l("session", "session_date_extracted_from_eaf_file_name") +
				": " + date.year + "-" + date.month + "-" + date.day);
			
			}
		
		
		}
		
		my.renderResource(resource_id, session_id, resource_type, filename, filesize);

		my.resource_id_counter += 1;
		
		return my.resource_id_counter - 1;
		
	};


	my.renderResource = function(resource_id, session_id, type, name, size){

		var div = dom.newElement('div', APP.CONF.session_dom_element_prefix+session_id+"_mediafile_" + resource_id, type, g(APP.CONF.session_dom_element_prefix+session_id+"_resources_resources"));

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
		
		var img = dom.img(div,"delete_resource_" + resource_id +"_icon","delete_resource_icon",APP.CONF.path_to_icons+"reset.png");
		img.addEventListener('click', function(num, num2) { 
			return function(){ my.removeResource(num, num2);  
			};
		}(session_id,resource_id) );
		
		dom.span(div, "", "resource_file_content_span",
		"File Name<br><input type=\"text\" name=\""+APP.CONF.session_dom_element_prefix+session_id+"_mediafile_" + resource_id + "_name\" value=\"\"><br>"+
		"Size<br><input type=\"text\" name=\""+APP.CONF.session_dom_element_prefix+session_id+"_mediafile_" + resource_id + "_size\" value=\"\">");
		
		div.getElementsByTagName("input")[0].value = name;
		div.getElementsByTagName("input")[1].value = size;


	};


	my.refreshSessionHeading = function(session_id){

		if (get(APP.CONF.session_dom_element_prefix+session_id+"_session_name") === ""){
			g(APP.CONF.session_dom_element_prefix+session_id+"_label").innerHTML = "<h1 class=\"session_heading\">" + l("session", "unnamed_session") + "</h1>";
		}
		
		else {
		
			g(APP.CONF.session_dom_element_prefix+session_id+"_label").innerHTML = "<h1 class=\"session_heading\">" + l("session", "session") + ": "+get(APP.CONF.session_dom_element_prefix+session_id+"_session_name")+"   </h1>";

		}

	};


	my.removeResource = function(session_id, resource_id){
		var m;

		var ids_of_sessions_media_files = [];
		
		for (m=0; m<my.sessions[my.getSessionIndexFromID(session_id)].resources.mediaFiles.length; m++){
		
			ids_of_sessions_media_files.push(my.sessions[my.getSessionIndexFromID(session_id)].resources.mediaFiles[m].id);
		
		}
		
		var ids_of_sessions_written_resources = [];
		
		for (m=0; m<my.sessions[my.getSessionIndexFromID(session_id)].resources.writtenResources.length; m++){
		
			ids_of_sessions_written_resources.push(my.sessions[my.getSessionIndexFromID(session_id)].resources.writtenResources[m].id);
		
		}

		if (ids_of_sessions_written_resources.indexOf(resource_id) != -1){

			my.sessions[my.getSessionIndexFromID(session_id)].resources.writtenResources.splice(my.getIndexFromResourceID(resource_id),1);
		
		}
		
		if (ids_of_sessions_media_files.indexOf(resource_id) != -1){

			my.sessions[my.getSessionIndexFromID(session_id)].resources.mediaFiles.splice(my.getIndexFromResourceID(resource_id),1);
		
		}
		
		var child = document.getElementById(APP.CONF.session_dom_element_prefix+session_id+"_mediafile_"+resource_id);
		
		g(APP.CONF.session_dom_element_prefix+session_id+"_resources_resources").removeChild(child);

	};


	my.assignSession1Metadata = function(){
		var session_form = session_form();

		if (my.sessions.length < 2){
		
			APP.log(l("session", "at_least_2_sessions_to_assign_metadata"), "error");
			return;
			
		}
		
		for (var i=0; i<session_form.fields_to_copy.length; i++){
		
			if (g(APP.CONF.copy_checkbox_element_prefix+session_form.fields_to_copy[i].name).checked){  //if checkbox is checked
			
				if (session_form.fields_to_copy[i].name == "actors"){  //special case: actors!
				
					for (var s=1; s<my.sessions.length; s++){
						my.removeAllActors(my.sessions[s].id);
			
						// copy actors from session 1 to session session
						for (var a=0;a<my.sessions[0].actors.actors.length;a++){
							my.addActor(my.sessions[s].id,my.sessions[0].actors.actors[a]);
						}
					
					}
				
				}
			
				my.copyFieldsToAllSessions(session_form.fields_to_copy[i].fields);
				
			}
		
		}

		APP.log(l("session", "session_1_metadata_assigned_to_all_sessions"));

	};


	my.copyFieldsToAllSessions = function(fields_to_copy){
	//fields_to_copy is an array
	//it is indeed html conform to get textarea.value
		
		for (var s=1;s<my.sessions.length;s++){   //important to not include the first session in this loop
		
			for (var k=0;k<fields_to_copy.length;k++){
				dom.copyField(APP.CONF.session_dom_element_prefix+my.sessions[s].id+"_"+fields_to_copy[k],APP.CONF.session_dom_element_prefix+my.sessions[0].id+"_"+fields_to_copy[k]);
			}
		
		}
		
	};

	my.removeAllActors = function(session_id){
	//Remove all actors from respective session
		
		while (my.sessions[my.getSessionIndexFromID(session_id)].actors.actors.length > 0){
			my.removeActor(session_id,my.sessions[my.getSessionIndexFromID(session_id)].actors.actors[0]);
			//Remove always the first actor of this session because every actor is at some point the first	
		}
	};


	my.refreshResourcesOfAllSessions = function(){
	//Offer possibility to add every available media file to all session
	//refresh all sessions with available media files

		for (var s=0;s<my.sessions.length;s++){
		
			my.refreshResources(s);
			
		}

	};


	my.areAllSessionsProperlyNamed = function(){

		for (var i=0;i<my.sessions.length;i++){
		
			if (get(APP.CONF.session_dom_element_prefix+my.sessions[i].id+"_session_name") === ""){
			
				return false;
			
			}
			
			for (var c=0; c<APP.CONF.not_allowed_chars.length; c++){
		
				if (get(APP.CONF.session_dom_element_prefix+my.sessions[i].id+"_session_name").indexOf(APP.CONF.not_allowed_chars[c]) != -1){
			
					return false;
				
				}
		
			}
			
		}
		
		return true;
		
	};


	my.doesEverySessionHaveAProjectName = function(){

		for (var i=0;i<my.sessions.length;i++){
		
			if (get(APP.CONF.session_dom_element_prefix+my.sessions[i].id+"_project_name") === ""){
			
				return false;
			
			}
			
		}
		
		return true;

	};
	
	
	my.display = function(session_id){
	
		if (document.getElementById(APP.CONF.session_dom_element_prefix+session_id+"_content").style.display != "none"){
			document.getElementById(APP.CONF.session_dom_element_prefix+session_id+"_content").style.display = "none";
			document.getElementById(APP.CONF.session_dom_element_prefix+session_id+"_expand_img").src=APP.CONF.path_to_icons+"up.png";
			my.sessions[my.getSessionIndexFromID(session_id)].expanded = false;
		}
		
		else {
			document.getElementById(APP.CONF.session_dom_element_prefix+session_id+"_content").style.display = "block";
			document.getElementById(APP.CONF.session_dom_element_prefix+session_id+"_expand_img").src=APP.CONF.path_to_icons+"down.png";
			my.sessions[my.getSessionIndexFromID(session_id)].expanded = true;
		}
	};


	return my;

})(imdi_environment.workflow[1],imdi_environment.workflow[2]);