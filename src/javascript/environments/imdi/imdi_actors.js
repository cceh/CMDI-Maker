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


imdi_environment.workflow[2] = (function(){
	'use strict';
	
	
	//PRIVATE
	
	var showLanguagesOfActiveActor = function(){

		forEach(my.actors[my.active_actor_index].languages, my.languages.set);

	};
	
	
	var highlightActiveActorInList = function(actor_index){
		
		if (typeof actor_index == "undefined"){
			console.warn("I shall highlight an actor with index = undefined!");
			return;
		}
		
		for (var i=0;i<my.actors.length;i++){
			g(my.element_id_prefix + "list_entry_" + i).style.background = my.unhighlightColor;
		}
		
		g(my.element_id_prefix + "list_entry_" + actor_index).style.background = my.highlightColor;

	};
	
	
	var getLanguagesOfActiveActorFromForm = function(){
	
		var array = map(my.languages.languages_of_active_actor, function(AL){
		
			var ActorLanguageObject = {
				
				LanguageObject: AL.LanguageObject,
				MotherTongue: g("mothertongue_" + AL.id).checked,
				PrimaryLanguage: g("primarylanguage_" + AL.id).checked
				
			};
			
			return ActorLanguageObject;
			
		});
		
		return array;
	
	};
	
	
	var makeActorObjectFromFormInput = function(){

		var object = APP.forms.createEmptyObjectFromTemplate(actor_form);

		APP.forms.fillObjectWithFormData(object, my.element_id_prefix, actor_form);
		
		object.languages = getLanguagesOfActiveActorFromForm();  //PRELIMINARY OVERWRITE!

		object.id = my.actors[my.active_actor_index].id;
		console.log("Saving actor with id "+object.id);
		
		return object;
	 
	};
	
	
	var blankForm = function(){

		g(my.element_id_prefix + "form_title").innerHTML = l("new_actor");  //better unnamed actor?

		APP.forms.fill(actor_form, my.element_id_prefix);

		my.languages.clearActiveActorLanguages();
		
	};
	
	
	var parseIMDIForActors = function(xml){

		var actors_in_xml = xml.getElementsByTagName("Actor");
		
		var actors_in_json = map(actors_in_xml, function(xml_actor){
		
			console.log("Actor in IMDI found. Name: " + xml_actor.querySelector("Name").textContent.trim());
			
			var actor_object = {
				name: xml_actor.querySelector("Name").textContent.trim(),
				role: xml_actor.querySelector("Role").textContent.trim(),
				full_name: xml_actor.querySelector("FullName").textContent.trim(),
				code: xml_actor.querySelector("Code").textContent.trim(),		
				age: xml_actor.querySelector("Age").textContent.trim(),
				sex: xml_actor.querySelector("Sex").textContent.trim(),		
				education: xml_actor.querySelector("Education").textContent.trim(),
				birth_date: parse_birth_date(xml_actor.querySelector("BirthDate").textContent.trim()),
				ethnic_group: xml_actor.querySelector("EthnicGroup").textContent.trim(),
				family_social_role: xml_actor.querySelector("FamilySocialRole").textContent.trim(),
				
				description: xml_actor.querySelector("Description").textContent.trim(),
				
				contact: {
				
					name: xml_actor.querySelector("Contact").querySelector("Name").textContent.trim(),
					address: xml_actor.querySelector("Contact").querySelector("Address").textContent.trim(),
					email: xml_actor.querySelector("Contact").querySelector("Email").textContent.trim(),
					organisation: xml_actor.querySelector("Contact").querySelector("Organisation").textContent.trim(),
				
				
				},
				
				anonymized: (xml_actor.querySelector("Anonymized").textContent.trim() == "true") ? true : false,
				
				languages: []
			
			};
			
			var actor_languages = xml_actor.querySelector("Languages");
			
			forEach(actor_languages.children, function(xml_AL){
			
				if (xml_AL.nodeName != "Language"){
					return;
				}
			
				var Actor_Language = {
				
					LanguageObject: [
						xml_AL.querySelector("Id").textContent.trim().slice(9),
						"?",
						"?",
						xml_AL.querySelector("Name").textContent.trim()
					],
					
					MotherTongue: (xml_AL.querySelector("MotherTongue").textContent.trim() == "true") ? true : false,
					PrimaryLanguage: (xml_AL.querySelector("PrimaryLanguage").textContent.trim() == "true") ? true : false
				
				
				};
				
				
				actor_object.languages.push(Actor_Language);
			
			});
			
			return actor_object;

		});
		
		console.log(actors_in_xml);
		
		return actors_in_json;

	};
	
	
	var handleClickOnActorList = function(index){
	
		my.saveActiveActor();
		
		my.show(my.actors[index].id);
	
	};
	
	var session;
	
	var l = function(arg1, arg2){
		return my.parent.l("actors", arg1, arg2);
	}
	

	var isEveryActorNamed = function(){
	
		for (var i=0; i<my.actors.length; i++){
			if (my.actors[i].name == ""){
				return false;
			}
		}
		
		return true;
	
	};

	
	//PUBLIC

	var my = {};
	my.parent = imdi_environment;
	
	var actor_form = my.parent.actor_form;
	
	my.actors = [];
	
	my.element_id_prefix = "actor_";
	
	my.highlightColor = "#FF8BC7";
	my.unhighlightColor = "lightskyblue";
	
	my.identity = {
		id: "actor",
		title: "Actors",
		icon: "user"
	};
	
	my.id_counter = 0;
	my.active_actor_index;
	
	my.module_view;
	
	my.init = function(view){
	
		my.actors = [];
		my.id_counter = 0;
		
		my.module_view = view;
		
		session = my.parent.workflow[3];
		
		my.createListDIV(view);
		var ac_view = dom.make("div", my.element_id_prefix + "view","",view);
		
		my.languages.init(view);
		
		my.refreshListDisplay(true);
		
	};
	
	
	my.createListDIV = function(view){
	
		dom.make("div",my.element_id_prefix + "list","",view);
		
	}
	
	
	my.getSaveData = function(){
	
		var object = {};
		
		my.saveActiveActor();
		
		object.actors = my.actors;
		object.id_counter = my.id_counter;
		object.active_actor_index = my.active_actor_index;
		
		return object;
	
	};
	
	/*
	my.beforeViewChange = function(){
	
		if (!isEveryActorNamed()){
			APP.alert("Every Actor must have a name!");
			return false;
		}
		
		else {
			return true;
		}
	
	};*/
	
	
	my.showNoActorsMessage = function(){
	
		var view = my.module_view;
	
		view.innerHTML = "";
		
		var no_actors_message = dom.make("h2","no_actors_text","no_actors_text", view);
		no_actors_message.innerHTML = l("there_are_no_actors_yet") + " " + 
		l("why_not_create_one__before_link");

		var new_actor_link = dom.make("a","new_actor_link","new_actor_link", no_actors_message);

		new_actor_link.innerHTML = l("why_not_create_one__link");
		new_actor_link.href = "#";

		no_actors_message.innerHTML += l("why_not_create_one__after_link");

		g("new_actor_link").addEventListener('click', function() {my.createNewActor(); });
		//we have to use g here instead of no_sessions_link, because latter isn't there anymore. it has been overwritten by ...innerHTML --> logically!
		
	
	};
	
	
	my.recall = function(data){
	
		my.actors = data.actors;
		my.id_counter = data.id_counter;
		my.active_actor_index = data.active_actor_index;
		
		my.refreshListDisplay();
		
		if (typeof my.active_actor_index != "undefined"){
			my.show(my.actors[my.active_actor_index].id);
		}
	
	};
	
	
	my.functions = function(){
		return [
			{
				id: "link_new_actor",
				icon: "plus",
				label: l("new_actor"),
				onclick: function() { my.createNewActor(); }
			},
			{
				id: "link_delete_active_actor",
				icon: "reset",
				label: l("delete_this_actor"),
				onclick: function() { my.handleClickOnDeleteActor(); }
			},
			{
				id: "link_sort_actors_alphabetically",
				icon: "az",
				label: l("sort_actors_alphabetically"),
				onclick: function() { my.sortAlphabetically(); }
			},
			{
				id: "link_duplicate_active_actor",
				icon: "duplicate_user",
				label: l("duplicate_this_actor"),
				onclick: function() { my.duplicate_active_actor(); }
			}
		];
	};
	

	my.erase_database = function(){

		alertify.set({ labels: {
			ok     : l("no"),
			cancel : l("yes_delete_all_actors")
		} });

		alertify.confirm(l("confirm_erasing_actors_db"), function (e) {

			if (e) {
				// user clicked "ok"
				
			}
		
			else {
				// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button
				
				my.id_counter = 0;
				my.actors = [];

				APP.log(l("all_actors_deleted"));
				
				my.refreshListDisplay();

			}
		});
	};


	my.show = function(actor_id){
	
		var actor_index = my.getIndexByID(actor_id);
		
		if (typeof actor_index == "undefined"){
			console.error("actor.show: Undefined actor_id!");
			actor_index = 0;
		}
		
		if (my.actors.length == 0){
			console.info("actor.show: No actors to show!");
			return;
		}
		
		console.log("Showing actor " + actor_index);
		
		my.createFormIfNotExistent();
		
		highlightActiveActorInList(actor_index);
		my.languages.clearActiveActorLanguages();
		
		my.active_actor_index = actor_index;
		
		var form_title = g(my.element_id_prefix + "form_title");
		var actor_name = my.actors[actor_index].name;
		
		if (actor_name == ""){
			form_title.innerHTML = l("unnamed_actor");
		}
		
		else {
			form_title.innerHTML = actor_name;
		}
		
		var actor_to_display = my.actors[actor_index];
		
		APP.forms.fill(actor_form, my.element_id_prefix, actor_to_display);
		
		showLanguagesOfActiveActor();
		
	};
	
	
	my.getIndexByID = function(actor_id) {

		var index = getIndex(my.actors, "id", actor_id);
		
		if (typeof index == "undefined"){
			alert("An error has occured.\nCould not find actors cache index from actor id!\n\nactor_id = " + actor_id);
		}
		
		return index;
		
	};
	
	
	my.export_actors = function(){
		
		if (my.actors.length !== 0){
		
			var actors_json = JSON.stringify(my.actors);
			
			APP.save_file(actors_json, "actors.json", APP.CONF.file_download_header);
			
		}
		
		else {
		
			APP.alert(l("there_are_no_actors"));
		
		}


	};
	
	
	my.handleImportFileInputChange = function (evt){
	
		var files = evt.target.files; // FileList object

		console.log(files);
		
		var file = files[0];
		
		console.log(file);
		
		var reader = new FileReader();
		
		reader.onload = function(e){
			var imported_actors;
		
			var result = e.target.result;
		
			try {
				imported_actors = JSON.parse(result);
			}
			
			catch (e) {
			//if json parsing is not possible, try xml parsing

				if (window.DOMParser) {
					var parser = new DOMParser();
					
					var xml = parser.parseFromString(result,"text/xml");
					
					imported_actors = parseIMDIForActors(xml);
					
				}
				
				
			}
			
			if (!imported_actors){
				return;
			}
			
			for (var a=0; a<imported_actors.length; a++){
				my.save(imported_actors[a], true);
			}
			
			my.refreshListDisplay();
			
			APP.log(imported_actors.length + " " + l("actors_imported"));
		
		};
		
		reader.readAsText(file);
		
	};


	my.createFormIfNotExistent = function(){
	
		var ac_view = g("actor_view");
		
		if (ac_view){
			return;
		};
	
		ac_view = dom.make("div", "actor_view", "actor_view", my.module_view);
		
		ac_view.innerHTML = "";
		
		var title_div = dom.make("div", my.element_id_prefix + "title_div","",ac_view);
		dom.make("h1", my.element_id_prefix + "form_title", "", title_div, l("new_actor"));
		dom.make("div", my.element_id_prefix + "content_div","", ac_view);

		APP.forms.make(g(my.element_id_prefix + "content_div"), actor_form, my.element_id_prefix, my.element_id_prefix, undefined, my.languages.makeInputInForm);

	};
	
	
	my.duplicate_active_actor = function(){

		//first, save changes to the actor
		var save = my.saveActiveActor();
		
		//then create a duplicate
		if (save === true){
			my.saveActiveActor(true);
			APP.log(l("actor_saved_and_duplicated"),"success");
		}

	};


	my.saveActiveActor = function(){
	
		if (typeof my.active_actor_index == "undefined"){
			console.info("Should save active actor but active actor is undefined!");
			return;
		}
	
		var actor_to_put = makeActorObjectFromFormInput();

		my.save(actor_to_put);

		my.refreshListDisplay();

		//how do we require actor name?
	};
	
	
	my.save = function(actor_to_put){
	//this will always overwrite an existing actor
		
		//create array with all actor ids
		var actor_ids = getArrayWithIDs(my.actors);

		my.actors.splice(my.getIndexByID(actor_to_put.id),1,actor_to_put);
		
		//if the actor does already exist, check if it is in a session and correct the actor name in the session, if required
		session.updateActorNameInAllSessions(actor_to_put.id);
		
		console.log('Yeah, dude inserted! insertId is: ' + actor_to_put.id);

		return true;

	};
	
	
	my.createNewActor = function(){
	
		if (typeof my.active_actor_index != "undefined"){
			my.saveActiveActor();
		}
	
		var actor_to_put = APP.forms.createEmptyObjectFromTemplate(actor_form);
		
		actor_to_put.id = my.id_counter;
		console.log("Saving actor with id " + actor_to_put.id);
		my.id_counter++;
		
		my.actors.push(actor_to_put);
	 
		console.log('Yeah, dude inserted! insertId is: ' + actor_to_put.id);

		my.refreshListDisplay();
		
		//show this created actor
		my.show(actor_to_put.id);
	};

	
	my.handleClickOnDeleteActor = function(){
	
		var name_of_actor = my.actors[my.active_actor_index].name;

		alertify.set({ labels: {
			ok     : l("no"),
			cancel : l("yes_delete_actor")
		} });

		alertify.confirm(l("really_erase_before_name") + name_of_actor + l("really_erase_after_name"), function (e) {

			if (e) {
				// user clicked "ok"
			}
		
			else {
				// user clicked "cancel"
				
				my.deleteActiveActor();
				
				APP.log(l("actor_deleted_before_name") + name_of_actor + l("actor_deleted_after_name"));

			}
		});	
	
	};
	

	my.deleteActiveActor = function(){

		my.actors.splice(my.active_actor_index,1);
		
		
		if (my.actors.length == 0){
			my.active_actor_index = undefined;
		}		
		
		if (my.active_actor_index > 0){
			my.show(my.actors[my.active_actor_index - 1].id);
			console.log("deleted actor " + my.active_actor_index + ". showing actor " + my.active_actor_index - 1);
		}
		
		else if (my.actors.length > 0){
			my.show(my.actors[0].id)
		}
		
		my.refreshListDisplay();
	};
	
	
	my.getAge = function (session_id, actor_id){

		var i = my.getIndexByID(actor_id);
		
		if (my.actors[i].age === ""){   //at first, check, if actor's age hasn't been specified yet
		
			if (g("radio_age_calc").on){  //then, check if auto calculate feature in settings is activated
				
				var birthDate = my.actors[i].birth_date.year + "-" + my.actors[i].birth_date.month + "-" + my.actors[i].birth_date.day;
				var sessionDate = get(session.dom_element_prefix+session_id+"_session_date_year") + "-" +
				get(session.dom_element_prefix+session_id+"_session_date_month") + "-" + get(session.dom_element_prefix+session_id+"_session_date_day"); 
				var age_calc_result = calcAgeAtDate(sessionDate,birthDate);
				
				if (age_calc_result !== 0){
				
					console.log("Actor's age successfully calculated");			
					return age_calc_result;
			
				}
				
				else {  //if age calc = 0, age could not be calculated
				
					return "Unspecified";
				
				}
				
			}
			
			else {	//if feature is activated, but age has not been specified
			
				return "Unspecified";
			
			}
		}
		
		else { //if actor's age has been specified
		
			return my.actors[i].age;
		
		}

	};
	

	my.sortAlphabetically = function(){

		my.actors = sortByKey(my.actors,"name");

		my.refreshListDisplay();
		
		APP.log(l("actors_alphabetically_sorted"));

	};


	my.refreshListDisplay = function(not_in_sessions){
		
		if (!g(my.element_id_prefix + 'list')){
			my.module_view.innerHTML = "";
			my.createListDIV(my.module_view);
		}
		
		
		g(my.element_id_prefix + 'list').innerHTML = "";

		forEach(my.actors, renderActorListEntry);
		
		if (my.actors.length == 0){
			my.showNoActorsMessage();
		}
		
		else {
			highlightActiveActorInList(my.active_actor_index);
		}

		if ((session) && (!not_in_sessions)){
			session.refreshActorLists(my.actors);
		}
		
	};
	
	
	var renderActorListEntry = function(actor, i){
	
		var div = dom.make('div', my.element_id_prefix + "list_entry_" + i, my.element_id_prefix + "list_entry", g(my.element_id_prefix + 'list'));
		
		var name_display = (actor.name != "") ? actor.name : l("unnamed_actor");
		
		dom.h2(div, name_display);
		dom.p(div, actor.role);
		
		div.addEventListener('click', function(num) { 
			return function(){ handleClickOnActorList(num); }; 
		}(i), false );
	
	};


	return my;
	
})();