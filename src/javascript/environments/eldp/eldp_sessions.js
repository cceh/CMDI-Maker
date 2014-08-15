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


eldp_environment.workflow[2] = (function(resources, actor) {
	'use strict';

	var my = {};
	my.parent = eldp_environment;
	
	var bundle_form = my.parent.bundle_form;
	
	my.identity = {
		id: "bundle",
		title: "Bundles",
		icon: "edit",
	};
	
	my.bundles = [];
	my.id_counter = 0;
	my.resource_id_counter = 0;
	
	my.dom_element_prefix = "bundle_";
	
	my.reset = function(){ my.eraseAll(); };
	
	
	var l = my.parent.l;

	
	my.init = function(){
	
		my.displayNoBundleText();
		
		my.bundles = [];
		my.id_counter = 0;
		my.resource_id_counter = 0;

	};
	
	
	my.view = function(){
	
		APP.GUI.scrollTop();
	
	};
	
	
	my.recall = function(data){
		
		for (var s=0; s<data.length; s++){
		
			my.bundles.push(data[s]);
			my.bundles[s].id = my.getNewBundleID();
		}
		
		my.refreshBundlesDisplay();
	
	};
	
	
	my.getSaveData = function(){
	
		my.refreshBundlesArray();
	
		return my.bundles;
	
	};
	
	
	my.refreshBundlesArray = function(){
	
		var array = [];
	
		for (var s=0; s<my.bundles.length; s++){
		
			var bundle_object = my.bundles[s];
			
			APP.forms.fillObjectWithFormData(bundle_object, my.dom_element_prefix+my.bundles[s].id+"_", bundle_form);		
			
			array.push(bundle_object);
		}
		
		my.bundles = array;	
	
	};
	
	
	my.createCopyBundleOptions = function (){

		var div = g("copy_bundles_select");
		
		if (!bundle_form.fields_to_copy){
		
			dom.make("span", "", "", div, "This function is currently unavailable!");
			return;
			
		}

		var options = bundle_form.fields_to_copy;

		for (var c=0; c<options.length; c++){
		
			var input = dom.input(div, APP.CONF.copy_checkbox_element_prefix+options[c].name, "", "", "checkbox");
			input.checked = true;
			
			dom.span(div, "", "", " "+options[c].label);
			dom.br(div);
		
		}


	};
	
	
	my.functions = [
		{
			label: "New Bundle",
			icon: "plus",
			id: "link_newBundle",
			onclick: function() {my.newBundle(); }
		},
		{
			label: "Copy Bundle 1 metadata to all bundles",
			icon: "copy",
			id: "link_copy_bundles",
			wrapper_id: "copy_bundles_div",
			type: "function_wrap",
			sub_div: "copy_bundles_select",
			onclick: function() { my.assignBundle1Metadata(); },
			after_that: my.createCopyBundleOptions
		},
		{
			label: "Reset Form",
			icon: "reset",
			id: "bundle_link_reset_form",
			onclick: function() {       

				alertify.set({ labels: {
					ok     : "No",
					cancel : "Yes, delete form"
				} });
				
				alertify.confirm("Really?<br>You want to reset the form and delete corpus and all bundles?", function (e) {
					if (e) {
						// user clicked "ok"
					}
			
					else {
						// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button=
						APP.reset_form();
						APP.log("Form reset");
						
					}
				});
			}
		},
		{
			label: "Sort by Name",
			icon: "az",
			id: "bundle_link_sort_by_name",
			onclick: function() { my.sortAlphabetically(); }
		}
	];
	

	my.refreshResources = function(s){
	//refresh resources for one bundle

		g(my.dom_element_prefix+my.bundles[s].id+"_resources_add_mf_div").innerHTML = "";

		var select = document.createElement("select");
		
		for (var i=0; i<resources.available_resources.length; i++){ 
			
			var NewOption = new Option( resources.available_resources[i][0], i, false, true);
			select.options[select.options.length] = NewOption;		
			
		}

		if (resources.available_resources.length > 0){
		
			g(my.dom_element_prefix+my.bundles[s].id+"_resources_add_mf_div").appendChild(select);
		
			select.selectedIndex = 0;	
		
			var add_button = document.createElement("input");
			add_button.type = "button";
			add_button.value = "Add to bundle";
			
			g(my.dom_element_prefix+my.bundles[s].id+"_resources_add_mf_div").appendChild(document.createElement("br"));
			
			g(my.dom_element_prefix+my.bundles[s].id+"_resources_add_mf_div").appendChild(add_button);		
			
			add_button.addEventListener('click', function(num) { 
				return function(){ my.addResource(num, select.selectedIndex);  };
			}(my.bundles[s].id) );
			
		}

		if (resources.available_resources.length === 0){
		
			var p = document.createElement("h5");
			g(my.dom_element_prefix+my.bundles[s].id+"_resources_add_mf_div").appendChild(p);
			p.innerHTML = "No files have been added.<br>";
		
			var a = document.createElement("a");
			a.href="#";
			a.innerHTML = "Add some files.";
		
			p.appendChild(a);

			a.addEventListener('click', function() { 
				APP.view(resources);
			} );
			
		
		}
		
	};


	my.newBundle = function(){

		var bundle_object = APP.forms.createEmptyObjectFromTemplate(my.parent.bundle_form);
		bundle_object.id = my.getNewBundleID();
		
		//new bundles are always expanded
		bundle_object.expanded = true;
		
		//push new bundle object into bundles array
		my.bundles.push(bundle_object);

		my.drawNewBundle(bundle_object);
		
		return bundle_object.id;
	};
	
	
	my.getNewBundleID = function(){
	
		//this is the id, always unique, even if bundle created after one is deleted
		var bundle_id = my.id_counter;
		
		my.id_counter += 1;
		
		return bundle_id;
	
	};
	
	
	my.createNewBundleWithResources = function(name, expanded, resources){
	
		var bundle_object = APP.forms.createEmptyObjectFromTemplate(my.parent.bundle_form);
		bundle_object.bundle.name = name;
		bundle_object.expanded = expanded;
		bundle_object.id = my.getNewBundleID();
		my.bundles.push(bundle_object);
		
		my.drawNewBundle(bundle_object);
		
		for (var r=0; r<resources.length; r++){
		
			my.addResource(bundle_object.id, resources[r]);
			
		}
		
		alertify.log("A new bundle has been created.<br>Name: " + name, "", "5000");
		
		return bundle_object.id;
		
	};
	
	
	my.refreshBundlesDisplay = function(){
	
		var bundles_view = g(APP.CONF.view_id_prefix + my.identity.id);
		
		bundles_view.innerHTML = "";
		
		if (my.bundles.length === 0){
	
			my.displayNoBundleText();
			return;
	
		}
		
		for (var s=0; s<my.bundles.length; s++){
		
			my.drawNewBundle(my.bundles[s]);
		
		}
	
	};
	
	
	my.drawNewBundle = function(bundle_object){
		var r;
		var file;
	
		var bundle_id = bundle_object.id;
		var bundle_expanded = bundle_object.expanded;
	
		var bundles_view = g(APP.CONF.view_id_prefix + my.identity.id);
	
		//remove no bundles message before drawing new bundle
		if (g("no_bundle_text")) {
			bundles_view.innerHTML = "";
		}
		
		var bundle_div = dom.make('div',my.dom_element_prefix+bundle_id,'bundle_div',bundles_view); 
		//bundles_count is right! but it has to be clear which bundle in bundles has which bundle_id

		var bundle_header = dom.make('div',my.dom_element_prefix+bundle_id+'_header','bundle_header',bundle_div);
		bundle_header.addEventListener('click', function(num) { 
			return function(){
				my.display(num);  
			};
		}(bundle_id) );

		var bundle_label = dom.make('a',my.dom_element_prefix+bundle_id+'_label','bundle_label',bundle_header);
		
		if ((!bundle_object.bundle) || (!bundle_object.bundle.name) || (bundle_object.bundle.name === "")){
		
			bundle_label.innerHTML = "<h1 class=\"bundle_heading\">Unnamed Bundle   </h1>";
			my.bundles[my.getBundleIndexByID(bundle_id)].bundle.name = "";
			
		}
		
		else {
			bundle_label.innerHTML = "<h1 class=\"bundle_heading\">Bundle: " + bundle_object.bundle.name + "   </h1>";
			my.bundles[my.getBundleIndexByID(bundle_id)].bundle.name = bundle_object.bundle.name;
		
		}

		bundle_label.href = "#";

		//create icon for deleting the bundle
		var bundle_delete_link = dom.make('a',my.dom_element_prefix+bundle_id+'_delete_link','bundle_delete_link',bundle_header);
		bundle_delete_link.addEventListener('click', function(num) {

			return function(event){	//only event must be a parameter of the return function because event is to be looked up when the event is fired, not when calling the wrapper function
				event.stopPropagation();
				my.userErase(num);  
			};
			
		}(bundle_id) );
		bundle_delete_link.innerHTML = "<img id=\""+my.dom_element_prefix+bundle_id+"_delete_img\" class=\"delete_img\" src=\""+APP.CONF.path_to_icons+"reset.png\" alt=\"Delete Bundle\">";
		bundle_delete_link.href = "#";
		
		//create icon to expand/collapse the bundle
		var bundle_display_link = dom.make('a',my.dom_element_prefix+bundle_id+'_display_link','bundle_display_link',bundle_header);
		bundle_display_link.innerHTML = "<img id=\""+my.dom_element_prefix+bundle_id+"_expand_img\" class=\"expand_img\" src=\""+APP.CONF.path_to_icons+"down.png\">";
		bundle_display_link.href = "#";


		var bundle_content = dom.make('div',my.dom_element_prefix+bundle_id+'_content','bundle_content',bundle_div);

		//create the form
		APP.forms.make(bundle_content, bundle_form, my.dom_element_prefix+bundle_id+"_", my.dom_element_prefix, bundle_object, my.makeSpecialFormInput);
		
		
		g(my.dom_element_prefix+bundle_id+"_bundle_name").addEventListener("blur", function(num){
		
			return function(){
			
				my.refreshBundleHeading(num);
			};
		}(bundle_id) );
		
		
		if (typeof(bundle_object.actors.actors) != "undefined"){
		
			forEach(bundle_object.actors.actors, function(actor){
		
				my.renderActor(bundle_id, actor);
		
			});
		}
		
		
		if (typeof(bundle_object.resources.resources.writtenResources) != "undefined"){
			
			forEach(bundle_object.resources.resources.writtenResources, function (file){
				file.id = my.resource_id_counter;
				my.renderResource(my.resource_id_counter, bundle_id, "wr", file.name, file.size);
				my.resource_id_counter += 1;
			});
		
		}
		
		
		if (typeof(bundle_object.resources.resources.mediaFiles) != "undefined"){
			
			forEach(bundle_object.resources.resources.mediaFiles, function(file){
				file.id = my.resource_id_counter;
				my.renderResource(file.id, bundle_id, "mf", file.name, file.size);
				my.resource_id_counter += 1;
			});
		
		}
		
		my.refreshResources(my.getBundleIndexByID(bundle_id));
		
		var all_available_actor_ids = map(actor.actors, function(actor){
			return actor.id;
		});   // find a better place for that

		my.refreshPersonListInBundle(my.getBundleIndexByID(bundle_id),all_available_actor_ids);
		
		if (bundle_expanded === false){
			my.display(bundle_id);
		}
	
	
	};
	
	
	my.makeSpecialFormInput = function (field, parent, element_id_prefix, element_class_prefix){
	
		if (field.name == "bundle_languages"){
		
			APP.GUI.makeLanguageSearchForm(parent, element_id_prefix, function(input){my.search(input, element_id_prefix);},
			function(input){ my.addByISO(input, element_id_prefix); }, false);
	
		}
	
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
	
	
	
	my.search = function(input, element_id_prefix){
		var j;
		console.log(element_id_prefix);
		
		//UGLY AND DIRTY
		var bundle_id = element_id_prefix.slice(my.dom_element_prefix.length, element_id_prefix.indexOf("_", my.dom_element_prefix.length));
		console.log("bundle id: " + bundle_id);
		
		if (input.length < 3){
		
			APP.alert(l("languages", "specify_search_request_at_least_3_chars"));
			
			return;
		}
		
		var name_hits = [];
		
		var results = [];

		for (var i=0;i<LanguageIndex.length;i++){

			if (isSubstringAStartOfAWordInString(LanguageIndex[i][3],input)){
				
				//get an array with all relevant IDs
				name_hits.push(LanguageIndex[i][0]);
			}

		}
		
		//now we have all relevant languageIDs in name_hits. next step: get the L-names of theses language IDs.
		
		for (j=0;j<LanguageIndex.length;j++){
		
			if ( (name_hits.indexOf(LanguageIndex[j][0]) != -1)  &&  (LanguageIndex[j][2] == "L" )){		//look for their l-name entry
			
				results.push(LanguageIndex[j]);
				
			}
		
		}
		
		var titles = [];
		
		forEach(results, function(result){

			titles.push(result[0] + ", "+result[1]+", " + result[3]);

		});
		
		var heading = l("languages", "language_search") + ": " + results.length + " " + ((results.length == 1) ? l("languages", "result") : l("languages", "results"));
		
		APP.GUI.showSelectFrame(results, titles, function(result){ my.set(result, bundle_id, element_id_prefix); }, heading,
		"(ISO639-3 Code, Country ID, " + l("languages", "language_name") + ")"); 

	};


	my.set = function(LanguageObject, bundle_id, element_id_prefix){

		//LanguageObject is only a reference to the original array in the LanguageIndex.
		// We have to clone our Language Object from the DB first.
		// Otherwise we would overwrite the DB array which we do not want.
		var LanguageObject = LanguageObject.slice(0);

		LanguageObject.id = my.id_counter;
		
		var bundle_index = my.getBundleIndexByID(bundle_id);
		
		my.bundles[bundle_index].content.languages.bundle_languages.push(LanguageObject);
		
		var div = dom.div(g(element_id_prefix + "display"), element_id_prefix + my.id_counter+"_div", "bundle_language_entry");
		
		var img = APP.GUI.icon(div,"","delete_lang_icon", "reset");
		img.addEventListener('click', function(num){
			return function(){
				actor.languages.remove(num);  
			};
		}(my.id_counter));
		
		dom.spanBR(div,"","", "ISO639-3 Code: " + LanguageObject[0]);
		dom.spanBR(div,"","", "Name: " + LanguageObject[3]);
		dom.spanBR(div,"","", "Country ID: " + LanguageObject[1]);
		
		my.id_counter += 1;

	};


	my.addByISO = function(input, element_id_prefix){
		console.log(element_id_prefix);
		console.log("ADDING ISO LANGUAGE " + input);
		
		//UGLY AND DIRTY
		var bundle_id = element_id_prefix.slice(my.dom_element_prefix.length, element_id_prefix.indexOf("_", my.dom_element_prefix.length));
		console.log("bundle id: " + bundle_id);
		
		for (var j=0;j<LanguageIndex.length;j++){   //for all entries in LanguageIndex
		
			if ( (LanguageIndex[j][0] == input)  &&  (LanguageIndex[j][2] == "L")){		//look for their l-name entry
				
				my.set(LanguageIndex[j], bundle_id, element_id_prefix);
				
				g(element_id_prefix + "iso_input").value = "";
				return;

			}

		}
		
		APP.alert(l("languages", "iso_code") + " " + input + " " + l("languages", "not_found_in_db") + ".");

	};

	
	my.refreshPersonName = function(bundle_id, actor_id){

		var div = g(my.dom_element_prefix + bundle_id + "_actor_" + actor_id + "_label");
		div.innerHTML = "<h2 class='actor_name_disp'>" + actor.actors[actor.getActorsIndexFromID(actor_id)].name + "</h2>";  //display name of actor
		div.innerHTML += "<p class='actor_role_disp'>" + actor.actors[actor.getActorsIndexFromID(actor_id)].role + "</p>";   //display role of actor


	};
	
	
	my.getName = function(bundle_index){

		if (my.bundles[bundle_index].name === ""){
		
			return "Unnamed Bundle";
			
		}
		
		else {
		
			return "Bundle: " + my.bundles[bundle_index].name;
		
		}
		
	};
	
	
	my.getBundleIndexByID = function(bundle_id){

		var index = getIndex(my.bundles, "id", bundle_id);
		
		if (typeof index == "undefined"){
		
			console.error("ERROR: Could not find bundle index from bundle_id! bundle_id = " + bundle_id);
			console.log(my.bundles);
			
		}
		
		return index;		

	};
	
	
	my.refreshPersonListInBundle = function(s,all_available_actor_ids){

		var aad = g(my.dom_element_prefix+my.bundles[s].id+"_actors_addActors_div");
		
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
			
			var add_button = dom.input(aad,"","","","button", "Add to bundle");
			add_button.addEventListener('click', function(num) { 
				return function(){ my.addActor(num, actor.actors[select.selectedIndex].id);  };
			}(my.bundles[s].id) );
			
		}
		
		if (actor.actors.length === 0){
		
			var h5 = dom.h5(aad, "There are no actors in the database yet.<br>");	
			
			dom.a(h5,"","","#","Create some actors.", function() { 
				APP.view("VIEW_persons");  
			} );
			
		}
		
		
		console.log("Refreshing Actor List of Bundle "+s);
		
		
		//check if actor in bundle is part of actors[...].id(s)? if not, remove it immediately!
		for (var k=0;k<my.bundles[s].actors.actors.length;k++){
			
			console.log("Trying to find id " + my.bundles[s].actors.actors[k] + " in actors of bundle "+s);
			
			// if an actor k is not in all available actors, remove it in the bundle!
			if (all_available_actor_ids.indexOf(my.bundles[s].actors.actors[k]) == -1){
				
				console.log("There is an actor in bundle "+s+" that does not exist anymore. Deleting!");
				my.removeActor(my.bundles[s].id,my.bundles[s].actors.actors[k]);
			
			}
		
		
		}


	};


	my.refreshPersonLists = function(actors){
		//Offer possibility to add every available actor to all bundle
		//refresh all bundles with available actors

		var all_available_actor_ids = [];
		
		forEach(actors, function(actor){
			all_available_actor_ids.push(actor.id);
		});
		
		for (var s=0;s<my.bundles.length;s++){   //for all existing bundles
		
			my.refreshPersonListInBundle(s,all_available_actor_ids);

		}

	};
	
	
	my.sortAlphabetically = function(){
		
		//Before we sort the bundles, we save the newest user input
		my.refreshBundlesArray();
		
		my.bundles = sortBySubKey(my.bundles,["bundle","name"]);
		my.refreshBundlesDisplay();
		
		console.log("Bundles sorted by name");
		
	};


	my.userErase = function(bundle_id){

		alertify.set({ labels: {
			ok     : "No",
			cancel : "Yes, delete bundle"
		} });

		alertify.confirm("Really?<br>You want to erase a whole bundle? Are you sure about that?", function (e) {

			if (e) {
				// user clicked "ok"
				
			}
		
			else {
				// user clicked "cancel"
				my.erase(bundle_id);

				alertify.log("Bundle deleted", "", "5000");
			}
		});


	};


	my.erase = function (bundle_id){

		dom.remove(my.dom_element_prefix+bundle_id);
		
		my.bundles.splice(my.getBundleIndexByID(bundle_id),1);
		
		if (my.bundles.length === 0) {
			my.displayNoBundleText();
		} 


	};
	
	
	my.getIndexFromResourceID = function (resource_id){
		var r;

		for (var s=0;s<my.bundles.length;s++){
		
			for (r=0; r<my.bundles[s].resources.writtenResources.length; r++){
		
				if (my.bundles[s].resources.writtenResources[r].id == resource_id){
					return r;
				}
			
			}
			
			for (r=0; r<my.bundles[s].resources.mediaFiles.length; r++){
		
				if (my.bundles[s].resources.mediaFiles[r].id == resource_id){
					return r;
				}
			
			}
		
		
		
		}


	};
	

	my.displayNoBundleText = function(){

		console.log("Showing no bundle text");

		var bundles_view = g(APP.CONF.view_id_prefix + my.identity.id);
		
		bundles_view.innerHTML = "";

		var no_bundles_message = dom.make("h2","no_bundle_text","no_bundle_text",bundles_view);
		no_bundles_message.innerHTML = "This corpus contains no bundles yet. Why not ";

		var new_bundle_link = dom.make("a","new_bundle_link","new_bundle_link",no_bundles_message);

		new_bundle_link.innerHTML = "create one";
		new_bundle_link.href = "#";

		no_bundles_message.innerHTML += "?";

		g("new_bundle_link").addEventListener('click', function() {my.newBundle(); });
		//we have to use g here instead of no_bundles_link, because letter isn't there anymore. it has been overwritten by ...innerHTML --> logically!
		
		bundles_view.scrollTop = 0;

	};


	my.eraseAll = function (){

		while (my.bundles.length > 0){
		
			my.eraseLast();
		
		}

	};



	my.eraseLast = function(){

		if (my.bundles.length > 0){
		
			my.erase(my.bundles[my.bundles.length-1].id);

		}
		
		else {
		
			alert("There is no bundle to be erased!\nTo erase one, you have to create one first.");
		
		}
	};


	my.addActor = function(bundle_id, actor_id){
	//add existing actor to bundle
	//new actors are only created in manage actors


		//if bundle doesn't already contain this actor
		if (my.bundles[my.getBundleIndexByID(bundle_id)].actors.actors.indexOf(actor_id) == -1){
		
			if (actor.actors[actor.getActorsIndexFromID(actor_id)]){  //check if actor still exists before adding
		
				my.bundles[my.getBundleIndexByID(bundle_id)].actors.actors.push(actor_id);
			
				my.renderActor(bundle_id, actor_id);
				
			}
			
			else {
			
				console.log("Tried to add actor to bundle although this actor is not in the actors database. This is odd.");
				return;
			
			}

		}
		
		else {
		
			alertify.log("This actor is already in the bundle.","error",5000);
		
		}
	};


	my.renderActor = function(bundle_id, actor_id){

		dom.make("div", my.dom_element_prefix + bundle_id + "_actor_" + actor_id, "actor_in_bundle_wrap", g(my.dom_element_prefix+bundle_id+"_actors_actors"));
		var div = dom.make("div", my.dom_element_prefix+bundle_id+"_actor_" + actor_id + "_label", "actor_in_bundle", g(my.dom_element_prefix+bundle_id+"_actor_" + actor_id));
		
		my.refreshPersonName(bundle_id, actor_id);
		
		var img = dom.img(g(my.dom_element_prefix+bundle_id+"_actor_" + actor_id),
		"delete_actor_"+actor_id+"_icon", "delete_actor_icon", APP.CONF.path_to_icons+"reset.png");
		img.addEventListener('click', function(num, num2) { 
			return function(){ my.removeActor(num, num2);  
			};
		}(bundle_id, actor_id) );

	};


	my.removeActor = function(bundle_id, actor_id){

		var position_in_array = my.bundles[my.getBundleIndexByID(bundle_id)].actors.actors.indexOf(actor_id);
		
		console.log("Removing actor. Position in array: " + position_in_array);

		//remove actor_id in array
		my.bundles[my.getBundleIndexByID(bundle_id)].actors.actors.splice(position_in_array,1);
		
		dom.remove(my.dom_element_prefix+bundle_id+"_actor_"+actor_id);
		
		APP.save();
		
	};


	my.addResource = function(bundle_id, resource_file_index, without_questions){
	// resource_file_index is the index of the available media file, that is to be added to the bundle
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
		
			my.bundles[my.getBundleIndexByID(bundle_id)].resources.resources.mediaFiles.push({
				name: resources.available_resources[resource_file_index][0],
				size: resources.available_resources[resource_file_index][2],
				id: my.resource_id_counter,
				resource_file_index: resource_file_index
			});

		}
		
		else if ((resources.getValidityOfFile(resources.available_resources[resource_file_index][0]) == 1)
		|| (resources.getValidityOfFile(resources.available_resources[resource_file_index][0]) == 3)){
		
			resource_type = "wr";
		
			my.bundles[my.getBundleIndexByID(bundle_id)].resources.resources.writtenResources.push({
				name: resources.available_resources[resource_file_index][0],
				size: resources.available_resources[resource_file_index][2],
				id: my.resource_id_counter,
				resource_file_index: resource_file_index
			});
			
		}
		
		else {
		
			if (!without_questions){
			
				APP.alert("We have a problem.<br>I don't know if this file is a Media File or a Written Resource:<br>" + resources.available_resources[resource_file_index][0] + 
				"<br>As for now, I will handle it as a written resource. But you really shouldn't do that");
			
			}
			
			resource_type = "wr";
			
			my.bundles[my.getBundleIndexByID(bundle_id)].resources.resources.writtenResources.push({
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
		
		
		//Rename the bundle if an EAF file is added for the first time and bundle has no name yet
		if ((getFileTypeFromFilename(filename) == "eaf") && (get(my.dom_element_prefix+bundle_id+"_bundle_name") === "")){
		
			var name = removeEndingFromFilename(resources.available_resources[resource_file_index][0]);
			
			g(my.dom_element_prefix+bundle_id+"_bundle_name").value = name;
			
			my.refreshBundleHeading(bundle_id);
		
			alertify.log("Bundle name has been taken from EAF file name, since bundle has not been manually named yet.","",8000);
		
		}
		
		
		//Check, if there is a date string in the form of YYYY-MM-DD in the filename of an eaf file. If so, adopt it for the bundle date
		//only, if bundle date is still YYYY
		if ((getFileTypeFromFilename(filename) == "eaf") && (get(my.dom_element_prefix+bundle_id+"_bundle_date_year") == "YYYY")){
			
			var date = parseDate(resources.available_resources[resource_file_index][0]);
			
			if (date !== null){
			
				g(my.dom_element_prefix+bundle_id+"_bundle_date_year").value = date.year;
				g(my.dom_element_prefix+bundle_id+"_bundle_date_month").value = date.month;
				g(my.dom_element_prefix+bundle_id+"_bundle_date_day").value = date.day;
				
				alertify.log("Bundle date has been extracted from EAF file name: " + date.year + "-" + date.month + "-" + date.day, "", 5000);
			
			}
		
		
		}
		
		my.renderResource(resource_id, bundle_id, resource_type, filename, filesize);

		my.resource_id_counter += 1;
		
		return my.resource_id_counter - 1;
		
	};


	my.renderResource = function(resource_id, bundle_id, type, name, size){

		var div = dom.make('div', my.dom_element_prefix+bundle_id+"_mediafile_" + resource_id, type, g(my.dom_element_prefix+bundle_id+"_resources_resources"));

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
		}(bundle_id,resource_id) );
		
		dom.span(div, "", "resource_file_content_span",
		"File Name<br><input type=\"text\" name=\""+my.dom_element_prefix+bundle_id+"_mediafile_" + resource_id + "_name\" value=\"\"><br>"+
		"Size<br><input type=\"text\" name=\""+my.dom_element_prefix+bundle_id+"_mediafile_" + resource_id + "_size\" value=\"\">");
		
		div.getElementsByTagName("input")[0].value = name;
		div.getElementsByTagName("input")[1].value = size;


	};


	my.refreshBundleHeading = function(bundle_id){

		if (get(my.dom_element_prefix+bundle_id+"_bundle_name") === ""){
			g(my.dom_element_prefix+bundle_id+"_label").innerHTML = "<h1 class=\"bundle_heading\">Unnamed Bundle   </h1>";
		}
		
		else {
		
			g(my.dom_element_prefix+bundle_id+"_label").innerHTML = "<h1 class=\"bundle_heading\">Bundle: "+get(my.dom_element_prefix+bundle_id+"_bundle_name")+"   </h1>";

		}

	};


	my.removeResource = function(bundle_id, resource_id){
		var m;

		var ids_of_bundles_media_files = [];
		
		for (m=0; m<my.bundles[my.getBundleIndexByID(bundle_id)].resources.mediaFiles.length; m++){
		
			ids_of_bundles_media_files.push(my.bundles[my.getBundleIndexByID(bundle_id)].resources.mediaFiles[m].id);
		
		}
		
		var ids_of_bundles_written_resources = [];
		
		for (m=0; m<my.bundles[my.getBundleIndexByID(bundle_id)].resources.writtenResources.length; m++){
		
			ids_of_bundles_written_resources.push(my.bundles[my.getBundleIndexByID(bundle_id)].resources.writtenResources[m].id);
		
		}

		if (ids_of_bundles_written_resources.indexOf(resource_id) != -1){

			my.bundles[my.getBundleIndexByID(bundle_id)].resources.writtenResources.splice(my.getIndexFromResourceID(resource_id),1);
		
		}
		
		if (ids_of_bundles_media_files.indexOf(resource_id) != -1){

			my.bundles[my.getBundleIndexByID(bundle_id)].resources.mediaFiles.splice(my.getIndexFromResourceID(resource_id),1);
		
		}
		
		var child = document.getElementById(my.dom_element_prefix+bundle_id+"_mediafile_"+resource_id);
		
		g(my.dom_element_prefix+bundle_id+"_resources_resources").removeChild(child);

	};


	my.assignBundle1Metadata = function(){

		if (my.bundles.length < 2){
		
			alertify.log("There have to be at least 2 bundles to assign metadata from one to another.", "error", "5000");
			return;
			
		}
		
		for (var i=0; i<bundle_form.fields_to_copy.length; i++){
		
			if (g(APP.CONF.copy_checkbox_element_prefix+bundle_form.fields_to_copy[i].name).checked){  //if checkbox is checked
			
				if (bundle_form.fields_to_copy[i].name == "actors"){  //special case: actors!
				
					for (var s=1; s<my.bundles.length; s++){
						my.removeAllActors(my.bundles[s].id);
			
						// copy actors from bundle 1 to bundle bundle
						for (var a=0;a<my.bundles[0].actors.actors.length;a++){
							my.addActor(my.bundles[s].id,my.bundles[0].actors.actors[a]);
						}
					
					}
				
				}
			
				my.copyFieldsToAllBundles(bundle_form.fields_to_copy[i].fields);
				
			}
		
		}

		alertify.log("Bundle 1 metadata assigned to all bundles.", "", "5000");

	};


	my.copyFieldsToAllBundles = function(fields_to_copy){
	//fields_to_copy is an array
	//it is indeed html conform to get textarea.value
		
		for (var s=1;s<my.bundles.length;s++){   //important to not include the first bundle in this loop
		
			for (var k=0;k<fields_to_copy.length;k++){
				dom.copyField(my.dom_element_prefix+my.bundles[s].id+"_"+fields_to_copy[k],my.dom_element_prefix+my.bundles[0].id+"_"+fields_to_copy[k]);
			}
		
		}
		
	};

	
	my.removeAllActors = function(bundle_id){
	//Remove all actors from respective bundle
		
		while (my.bundles[my.getBundleIndexByID(bundle_id)].actors.actors.length > 0){
			my.removeActor(bundle_id,my.bundles[my.getBundleIndexByID(bundle_id)].actors.actors[0]);
			//Remove always the first actor of this bundle because every actor is at some point the first	
		}
	};


	my.refreshResourcesOfAllBundles = function(){
	//Offer possibility to add every available media file to all bundle
	//refresh all bundles with available media files

		for (var s=0;s<my.bundles.length;s++){
		
			my.refreshResources(s);
			
		}

	};


	my.areAllBundlesProperlyNamed = function(){

		for (var i=0;i<my.bundles.length;i++){
		
			if (get(my.dom_element_prefix+my.bundles[i].id+"_bundle_name") === ""){
			
				return false;
			
			}
			
			for (var c=0; c<APP.CONF.not_allowed_chars.length; c++){
		
				if (get(my.dom_element_prefix+my.bundles[i].id+"_bundle_name").indexOf(APP.CONF.not_allowed_chars[c]) != -1){
			
					return false;
				
				}
		
			}
			
		}
		
		return true;
		
	};


	my.display = function(bundle_id){
	
		if (document.getElementById(my.dom_element_prefix+bundle_id+"_content").style.display != "none"){
			document.getElementById(my.dom_element_prefix+bundle_id+"_content").style.display = "none";
			document.getElementById(my.dom_element_prefix+bundle_id+"_expand_img").src=APP.CONF.path_to_icons+"up.png";
			my.bundles[my.getBundleIndexByID(bundle_id)].expanded = false;
		}
		
		else {
			document.getElementById(my.dom_element_prefix+bundle_id+"_content").style.display = "block";
			document.getElementById(my.dom_element_prefix+bundle_id+"_expand_img").src=APP.CONF.path_to_icons+"down.png";
			my.bundles[my.getBundleIndexByID(bundle_id)].expanded = true;
		}
	};


	return my;

})(imdi_environment.workflow[1],imdi_environment.workflow[2]);