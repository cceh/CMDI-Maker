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


eldp_environment.workflow[2] = (function() {
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
	my.lang_id_counter = 0;
	my.resource_id_counter = 0;
	my.person_id_counter = 0;
	
	my.dom_element_prefix = "bundle_";
	
	my.reset = function(){ my.eraseAll(); };
	
	var resources;
	var person;
	
	
	var l = my.parent.l;

	my.init = function(view){
	
		resources = eldp_environment.workflow[0];
		person = eldp_environment.workflow[1];
	
		my.displayNoBundleText();
		
		my.bundles = [];
		my.id_counter = 0;
		my.lang_id_counter = 0;
		my.resource_id_counter = 0;
		my.person_id_counter = 0;

	};
	
	
	my.view = function(){
	
		APP.GUI.scrollTop();
	
	};
	
	
	my.recall = function(data){
		
		if (!data.bundles){
			return;
		}
		
		
		for (var s=0; s<data.bundles.length; s++){
		
			my.bundles.push(data.bundles[s]);
			my.bundles[s].id = my.getNewBundleID();
			
		}
		
		if (data.lang_id_counter){
			my.lang_id_counter = data.lang_id_counter;
		}
		
		if (data.person_id_counter){
			my.person_id_counter = data.person_id_counter;
		}
		
		my.refreshBundlesDisplay();
	
	};
	
	
	my.getSaveData = function(){

		my.refreshBundlesArray();
	
		var object = {
			bundles: my.bundles,
			lang_id_counter: my.lang_id_counter,
			person_id_counter: my.person_id_counter
		};
	
		return object;
	
	};
	
	
	my.refreshBundlesArray = function(){
	
		var array = [];
	
		forEach(my.bundles, function(bun){
		
			var bundle_object = bun;
			
			APP.forms.fillObjectWithFormData(bundle_object, my.dom_element_prefix+bun.id+"_", bundle_form);
			
			//Refresh persons' roles
			forEach(bundle_object.persons.persons, function(person_in_bundle){
			
				person_in_bundle.role = get("person_in_bundle_" + person_in_bundle.id + "_role_input");
			
			});
			
			
			forEach(bundle_object.resources.resources, function(resource_in_bundle){

				resource_in_bundle.urcs.u = g(my.dom_element_prefix+bun.id+"_resource_" + resource_in_bundle.id + "_u").checked;
				resource_in_bundle.urcs.r = g(my.dom_element_prefix+bun.id+"_resource_" + resource_in_bundle.id + "_r").checked;
				resource_in_bundle.urcs.c = g(my.dom_element_prefix+bun.id+"_resource_" + resource_in_bundle.id + "_c").checked;
				resource_in_bundle.urcs.s = g(my.dom_element_prefix+bun.id+"_resource_" + resource_in_bundle.id + "_s").checked;
			
			});
			
			
			forEach(bundle_object.languages.bundle_languages, function(BLO){
			
				BLO.content_language = g(my.dom_element_prefix+bun.id+"_languages_" + BLO.id + "_content_language").checked;
				BLO.working_language = g(my.dom_element_prefix+bun.id+"_languages_" + BLO.id + "_working_language").checked;
				
				
				if (BLO.name_type == "LOCAL"){
				
					BLO.name = g(my.dom_element_prefix+bun.id+"_languages_" + BLO.id + "_name_input").value;
				
				}
			
			});
			
			array.push(bundle_object);
			
		});
		
		my.bundles = array;	
	
	};
	
	
	my.createCopyBundleOptions = function (){

		var div = g("copy_bundles_select");
		
		if (!bundle_form.fields_to_copy){
		
			dom.make("span", "", "", div, l("bundle", "this_function_is_currently_unavailable"));
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
	
	
	my.functions = function(){
		return [
			{
				label: l("bundle", "new_bundle"),
				icon: "plus",
				id: "link_newBundle",
				onclick: function() {my.newBundle(); }
			},
			{
				label: l("bundle", "copy_bundle_1_metadata"),
				icon: "copy",
				id: "link_copy_bundles",
				wrapper_id: "copy_bundles_div",
				type: "function_wrap",
				sub_div: "copy_bundles_select",
				onclick: function() { my.assignBundle1Metadata(); },
				after_that: my.createCopyBundleOptions
			},
			{
				label: l("bundle", "reset_form"),
				icon: "reset",
				id: "bundle_link_reset_form",
				onclick: function() {       
					APP.confirm(l("bundle", "really_reset_form"), function (e) {
						if (e) {
							// user clicked "ok"
						}
				
						else {
							// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button=
							APP.environments.resetActive();
							APP.log(l("bundle", "form_reset"));
						}
					},
					l("bundle", "no"), l("bundle", "yes_delete_form"));
				}
			},
			{
				label: l("bundle", "sort_by_name"),
				icon: "az",
				id: "bundle_link_sort_by_name",
				onclick: function() { my.sortAlphabetically(); }
			}
		];
	};
	

	my.refreshResources = function(s){
	//refresh resources for one bundle

		var add_res_div = g(my.dom_element_prefix+my.bundles[s].id+"_resources_add_mf_div");

		add_res_div.innerHTML = "";

		var select = document.createElement("select");
		
		dom.setSelectOptions(select, resources.available_resources, "name", "take_index");
		
		if (resources.available_resources.length > 0){
		
			add_res_div.appendChild(select);
			dom.br(add_res_div);
			
			dom.button((add_res_div),
			l("bundle", "add_to_bundle"), function(num) {
				return function(){ my.addResource(num, select.selectedIndex);  };
			}(my.bundles[s].id));
			
		}

		if (resources.available_resources.length === 0){
		
			var p = document.createElement("h5");
			add_res_div.appendChild(p);
			p.innerHTML = l("bundle", "no_files_have_been_added") + "<br>";
		
			dom.link(p, "", "", l("bundle", "add_some_files"), function() {
				APP.view(resources);
			});
			
		
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
		
		APP.log(
			l("bundle", "new_bundle_has_been_created") +
			"<br>" +
			l("bundle", "name") + ": " + name
		);
		
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

		var bundle_label = dom.make('h1',my.dom_element_prefix+bundle_id+'_label','bundle_heading',bundle_header);
		
		if ((!bundle_object.bundle) || (!bundle_object.bundle.name) || (bundle_object.bundle.name === "")){
			bundle_label.innerHTML = l("bundle", "unnamed_bundle");
			my.bundles[my.getIndexByID(bundle_id)].bundle.name = "";
		}
		
		else {
			bundle_label.innerHTML = l("bundle", "bundle") + ": " + bundle_object.bundle.name;
			my.bundles[my.getIndexByID(bundle_id)].bundle.name = bundle_object.bundle.name;
		}

		//create icon for deleting the bundle
		var bundle_delete_link = dom.make('a',my.dom_element_prefix+bundle_id+'_delete_link','bundle_delete_link',bundle_header);
		bundle_delete_link.addEventListener('click', function(num) {

			return function(event){	//only event must be a parameter of the return function because event is to be looked up when the event is fired, not when calling the wrapper function
				event.stopPropagation();
				my.userErase(num);
			};
			
		}(bundle_id) );
		bundle_delete_link.innerHTML = "<img id=\""+my.dom_element_prefix+bundle_id+"_delete_img\" class=\"delete_img\" src=\""+APP.CONF.path_to_icons+"reset.png\" alt=\"Delete Bundle\">";
		
		//create icon to expand/collapse the bundle
		var bundle_display_link = dom.make('a',my.dom_element_prefix+bundle_id+'_display_link','bundle_display_link',bundle_header);
		APP.GUI.icon(bundle_display_link, my.dom_element_prefix+bundle_id+"_expand_img", "expand_img", "down");

		var bundle_content = dom.make('div',my.dom_element_prefix+bundle_id+'_content','bundle_content',bundle_div);

		//create the form
		APP.forms.make(bundle_content, bundle_form, my.dom_element_prefix+bundle_id+"_", my.dom_element_prefix, bundle_object, my.makeSpecialFormInput);
		
		g(my.dom_element_prefix+bundle_id+"_bundle_name").addEventListener("blur", function(num){
			return function(){
			
				my.refreshBundleHeading(num);
			};
		}(bundle_id));

		
		//Render languages
		var element_id_prefix = my.dom_element_prefix + bundle_id + "_languages_";
		console.log("rendering langs by");
		console.log(bundle_object.languages.bundle_languages);
		
		forEach(bundle_object.languages.bundle_languages, function(LanguageObject){
			console.log("RENDERING LANG : ");
			console.log(LanguageObject, bundle_id, element_id_prefix);
			my.renderLanguage(LanguageObject, bundle_id, element_id_prefix);
		});

		if (typeof(bundle_object.persons) != "undefined" && typeof(bundle_object.persons.persons) != "undefined"){
		
			forEach(bundle_object.persons.persons, function(person_in_bundle){
		
				my.renderPerson(bundle_id, person_in_bundle);
		
			});
		}
		
		
		if (typeof(bundle_object.resources.resources) != "undefined"){
			
			forEach(bundle_object.resources.resources, function (file){
				file.id = my.resource_id_counter;
				my.renderResource(my.resource_id_counter, bundle_id, file.name, file.size, file.urcs);
				my.resource_id_counter += 1;
			});
		
		}
		
		//refreshes list of resources that are available
		my.refreshResources(my.getIndexByID(bundle_id));
		
		var all_available_person_ids = getArrayWithIDs(person.persons);
		// find a better place for that

		my.refreshPersonListInBundle(my.getIndexByID(bundle_id), all_available_person_ids);
		
		if (bundle_expanded === false){
			my.display(bundle_id);
		}
	
	
	};
	
	
	my.makeSpecialFormInput = function (field, parent, element_id_prefix, element_class_prefix){
	
		if (field.name == "bundle_languages"){

			//UGLY AND DIRTY
			var bundle_id = element_id_prefix.slice(my.dom_element_prefix.length, element_id_prefix.indexOf("_", my.dom_element_prefix.length));
		
			APP.GUI.makeLanguageSearchForm(
				parent,
				element_id_prefix,
				false,
				false,
				function(LanguageObject){
					my.set(LanguageObject, bundle_id, element_id_prefix);
				}
			);
	
		}
	
		if (field.name == "persons"){
		
			dom.br(parent);
			dom.make("div",element_id_prefix+"persons", "persons", parent);
			dom.make("div",element_id_prefix+"addPersons_div", "persons", parent);
		
		}
		
		if (field.name == "resources"){
		
			dom.make("div",element_id_prefix+"resources", "mfs", parent);
			dom.make("div",element_id_prefix+"add_mf_div", "", parent);
			dom.p(parent, "");
		
		}
	
	};


	my.set = function(LanguageObject, bundle_id, element_id_prefix){
		
		//BLO = bundle language object
		var BLO = {
			code: LanguageObject[0],
			name: LanguageObject[3],
			name_type: LanguageObject[2],
			country_code: LanguageObject[1],
			id: my.lang_id_counter,
			working_language: false,
			content_language: false,
		};
		
		
		var bundle_index = my.getIndexByID(bundle_id);
		
		my.bundles[bundle_index].languages.bundle_languages.push(BLO);
		
		my.renderLanguage(BLO, bundle_id, element_id_prefix);
		
		my.lang_id_counter += 1;

	};
	
	
	my.renderLanguage = function(BLO, bundle_id, element_id_prefix){
	
		var lang_id = BLO.id;
		
		//prevent chaos from happening
		if (lang_id >= my.lang_id_counter){
			my.lang_id_counter = lang_id + 1;
		}
		
		console.log("Rendering lang with id " + lang_id);
		
		var element_id = element_id_prefix + lang_id + "_div";
	
		var box_content = [];
		box_content.push("ISO639-3 Code: " + BLO.code);
		
		var line2 = [];
		line2.push(l("bundle", "name") + ": ");
		
		
		//If lang type is local and name has not been specified yet, put a message there
		if (BLO.name_type == "LOCAL"){

			var textInputValue = (BLO.name != "") ? BLO.name : l("bundle", "specify_local_used_language_name");
			
			line2.push(
				dom.textInput(
					undefined, element_id_prefix + lang_id + "_name_input", "eldp_bundle_lang_name_input", "",
					textInputValue
				)
			);
			
		}
		
		else {
			
			line2.push(BLO.name);
			
		}
		
		//dom.spanBR(div,"","", "Country ID: " + BLO.country_code);
		
		var line3 = [];
		
		line3.push(
			dom.checkbox(undefined, element_id_prefix + lang_id + "_content_language", "", "", BLO.content_language)
		);
		line3.push(l("bundle", "content_language") + "  ");
		
		line3.push(
			dom.checkbox(undefined, element_id_prefix + lang_id + "_working_language", "", "", BLO.working_language)
		);
		line3.push(l("bundle", "working_language"));
		
		console.log(line3);

		box_content.push(line2, line3);
		
		console.log("Doing red box to ");
		console.log(element_id_prefix + "display");
		
		APP.GUI.FORMS.redBox(g(element_id_prefix + "display"), element_id, "bundle_language_entry", box_content, function(num, num2, num3){
			return function(){
				my.removeLanguage(num, num2, num3);
			};
		}(bundle_id, lang_id, element_id));
	};
	
	
	my.removeLanguage = function(bundle_id, l_id, element_id){
	
		var bundle_index = my.getIndexByID(bundle_id);	
		var language_index = my.getLanguageObjectIndexByID(bundle_index, l_id);

		console.log(bundle_index + ", " + language_index);
		my.bundles[bundle_index].languages.bundle_languages.splice(language_index, 1);
		
		dom.remove(element_id);
	
	};
	
	
	my.getLanguageObjectIndexByID = function(bundle_index, l_id){
		
		return getIndex(my.bundles[bundle_index].languages.bundle_languages, 4, l_id);

	};

	
	my.refreshPersonName = function(bundle_id, id){

		var div = g(my.dom_element_prefix + bundle_id + "_person_" + id + "_label");
		
		var h2 = div.getElementsByTagName("h2")[0];
		
		var bundle = getObjectByID(my.bundles, bundle_id);
		
		var person_in_bundle = getObjectByID(bundle.persons.persons, id);
		
		h2.innerHTML = person.getDisplayName(person_in_bundle.person_id);
		//display name of person

	};
	
	
	my.getName = function(bundle_index){

		if (my.bundles[bundle_index].name === ""){
		
			return l("bundle", "unnamed_bundle");
			
		}
		
		else {
		
			return l("bundle", "bundle") + ": " + my.bundles[bundle_index].name;
		
		}
		
	};
	
	
	my.getIndexByID = function(bundle_id){

		var index = getIndex(my.bundles, "id", bundle_id);
		
		if (typeof index == "undefined"){
		
			console.error("ERROR: ELDP.bundles: Could not find bundle index from bundle_id! bundle_id = " + bundle_id);
			console.log(my.bundles);
			
		}
		
		return index;		

	};
	
	
	my.updatePersonNameInAllBundles = function(person_id){
	
		forEach(my.bundles, function(bundle){
		
			var person_ids_in_bundle = getArrayWithIDs(bundle.persons.persons);
	
			//search for person_id in this bundles' persons
			if (person_ids_in_bundle.indexOf(person_id) != -1){
				
				my.refreshPersonName(bundle.id, person_id);
	
			}
			
		});
	};
	
	
	my.refreshPersonListInBundle = function(s, all_available_person_ids){

		var aad = g(my.dom_element_prefix+my.bundles[s].id+"_persons_addPersons_div");
		
		aad.innerHTML = "";

		var select = document.createElement("select");
		
		dom.setSelectOptions(select, person.persons, "display_name", "take_index");

		if (person.persons.length > 0){
		
			aad.appendChild(select);
		
			dom.br(aad);	
			
			dom.button(aad, "Add to bundle", function(num) { 
				return function(){ my.addPerson(num, person.persons[select.selectedIndex].id);  };
			}(my.bundles[s].id));
			
		}
		
		if (person.persons.length === 0){
		
			var h5 = dom.h5(aad, l("bundle", "no_persons_created_yet") + "<br>");	
			
			dom.link(h5,"","", l("bundle", "create_some_persons"), function() { 
				APP.view("VIEW_persons");  
			} );
			
		}
		
		
		console.log("Refreshing Person List of Bundle "+s);
		
		
		//check if person in bundle is part of persons[...].id(s)? if not, remove it immediately!
		forEach(my.bundles[s].persons.persons, function(person_in_bundle){
			
			// if a person is not in available persons, remove it from the bundle!
			if (all_available_person_ids.indexOf(person_in_bundle.person_id) == -1){
				
				console.log("There is an person in bundle "+s+" that does not exist anymore. Deleting!");
				my.removePerson(my.bundles[s].id, person_in_bundle.id);
			
			}
		
		
		});


	};


	my.refreshPersonLists = function(persons){
		//Offer possibility to add every available person to all bundle
		//refresh all bundles with available persons

		var all_available_person_ids = getArrayWithIDs(persons);
		
		for (var s=0; s<my.bundles.length; s++){   //for all existing bundles
		
			my.refreshPersonListInBundle(s, all_available_person_ids);

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

		APP.confirm(l("bundle", "really_erase_bundle"), function (e) {

			if (e) {
				// user clicked "ok"
				
			}
		
			else {
				// user clicked "cancel"
				my.erase(bundle_id);
				APP.log(l("bundle", "bundle_deleted"));
			}
		}, l("bundle", "no"), l("bundle", "yes_delete_bundle"));

	};


	my.erase = function (bundle_id){

		dom.remove(my.dom_element_prefix+bundle_id);
		
		my.bundles.splice(my.getIndexByID(bundle_id),1);
		
		if (my.bundles.length === 0) {
			my.displayNoBundleText();
		} 


	};
	
	
	my.getIndexFromResourceID = function (resource_id){
		var r;

		for (var s=0;s<my.bundles.length;s++){
		
			for (r=0; r<my.bundles[s].resources.resources.length; r++){
		
				if (my.bundles[s].resources.resources[r].id == resource_id){
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
		no_bundles_message.innerHTML = l("bundle", "no_bundles_have_been_created_yet") +
		" " + l("bundle", "why_not_create_one__before_link");

		var new_bundle_link = dom.make("a","new_bundle_link","new_bundle_link",no_bundles_message);

		new_bundle_link.innerHTML = l("bundle", "why_not_create_one__link");

		no_bundles_message.innerHTML += l("bundle", "why_not_create_one__after_link");

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
		
			APP.log("There is no bundle to be erased!\nTo erase one, you have to create one first.", "error");
		
		}
	};


	my.addPerson = function(bundle_id, person_id){
	//add existing person to bundle
	
		//var person_ids_in_bundle = getArrayWithIDs(my.bundles[my.getIndexByID(bundle_id)].persons.persons);

		//if bundle doesn't already contain this person
		//if (person_ids_in_bundle.indexOf(person_id) == -1){
		
			if (person.persons[person.getIndexByID(person_id)]){  //check if person still exists before adding
				
				var person_in_bundle = {
					id: my.person_id_counter,
					person_id: person_id,
					role: ""
				};
				
				my.bundles[my.getIndexByID(bundle_id)].persons.persons.push(person_in_bundle);
			
				my.renderPerson(bundle_id, person_in_bundle);
				
				my.person_id_counter++;
				
			}
			
			else {
			
				console.log("Tried to add person to bundle although this person is not in the persons database. This is odd.");
				return;
			
			}
/*
		}
		
		else {
		
			APP.log(l("bundle", "this_person_is_already_in_the_bundle"), "error");
		
		}*/
	};


	my.renderPerson = function(bundle_id, person_in_bundle){
	
		var id = person_in_bundle.id;
		var role_display = (person_in_bundle.role != "") ? person_in_bundle.role : "Role";

		dom.make("div", my.dom_element_prefix + bundle_id + "_person_" + id, "person_in_bundle_wrap", g(my.dom_element_prefix+bundle_id+"_persons_persons"));
		var div = dom.make("div", my.dom_element_prefix+bundle_id+"_person_" + id + "_label", "person_in_bundle", g(my.dom_element_prefix+bundle_id+"_person_" + id));
		
		var h2 = dom.h2(div);
		h2.className = "person_name_disp";
		h2.id = my.dom_element_prefix+bundle_id+"_person_" + id + "_name_disp";
		
		
		//dom.input(div, "person_in_bundle_"+id+"_role_input", "person_role_input", "", "text", role_display);
		APP.GUI.openVocabulary(div,
			undefined, "", "person_in_bundle_"+id+"_role_input", 1,
			[
				"annotator","author","compiler","consultant","data_inputter","depositor",
				"developer","editor","illustrator","interpreter","interviewee","interviewer",
				"participant","performer","photographer","recorder","researcher","research_participant",
				"responder","signer","singer","speaker","sponsor","transcriber","translator"
			],
			role_display, undefined, "person_role_input"
		);
		
		my.refreshPersonName(bundle_id, id);
		
		APP.GUI.icon(g(my.dom_element_prefix+bundle_id+"_person_" + id),
		"delete_person_"+id+"_icon", "delete_person_icon", "reset", function(num, num2) { 
			return function(){ my.removePerson(num, num2);  
			};
		}(bundle_id, id));

	};


	my.removePerson = function(bundle_id, id){
	
		var bundle = my.bundles[my.getIndexByID(bundle_id)];

		var persons_in_bundle = bundle.persons.persons;
		
		var person_index = getIndexByID(persons_in_bundle, id);
		
		//remove id in array
		persons_in_bundle.splice(person_index,1);
		
		dom.remove(my.dom_element_prefix+bundle_id+"_person_"+id);
		
		APP.save();
		
	};


	my.addResource = function(bundle_id, resource_file_index, without_questions){
	// resource_file_index is the index of the available media file, that is to be added to the bundle
	// if resource_file_index is -1, a new empty field with no available media file is created
	//if without_questions == true, no alerts will be thrown (e.g. when resources are added at start up)
	
		if (resource_file_index >= resources.available_resources.length){
			return;
		}
		
		var filename = resources.available_resources[resource_file_index].name;
		var filesize = resources.available_resources[resource_file_index].size;
		
		var resource_id = my.resource_id_counter;

		var urcs = {
			u: false,
			r: false,
			c: false,
			s: false
		};
		
		my.bundles[my.getIndexByID(bundle_id)].resources.resources.push({
			name: filename,
			size: filesize,
			id: my.resource_id_counter,
			resource_file_index: resource_file_index,
			urcs: urcs
		});


		if (resource_file_index == -1){
			filename = "";
			filesize = "";
		}	
		
		
		//Rename the bundle if an EAF file is added for the first time and bundle has no name yet
		if ((getFileTypeFromFilename(filename) == "eaf") && (get(my.dom_element_prefix+bundle_id+"_bundle_name") === "")){
		
			var name = removeEndingFromFilename(filename);
			
			g(my.dom_element_prefix+bundle_id+"_bundle_name").value = name;
			
			my.refreshBundleHeading(bundle_id);
		
			APP.log(l("bundle", "bundle_name_taken_from_eaf"));
		
		}
		
		
		//Check, if there is a date string in the form of YYYY-MM-DD in the filename of an eaf file. If so, adopt it for the bundle date
		//only, if bundle date is still YYYY
		if ((getFileTypeFromFilename(filename) == "eaf") && (get(my.dom_element_prefix+bundle_id+"_bundle_date_year") == "YYYY")){
			
			var date = parseDate(filename);
			
			if (date !== null){
			
				g(my.dom_element_prefix+bundle_id+"_bundle_date_year").value = date.year;
				g(my.dom_element_prefix+bundle_id+"_bundle_date_month").value = date.month;
				g(my.dom_element_prefix+bundle_id+"_bundle_date_day").value = date.day;
				
				APP.log(l("bundle", "bundle_date_extracted_from_eaf_file_name") + ": " + date.year + "-" + date.month + "-" + date.day);
			
			}
		
		
		}
		
		my.renderResource(resource_id, bundle_id,filename, filesize, urcs);

		my.resource_id_counter += 1;
		
		return my.resource_id_counter - 1;
		
	};


	my.renderResource = function(resource_id, bundle_id, name, size, urcs){

		var div = dom.make('div', my.dom_element_prefix+bundle_id+"_resource_" + resource_id, "mf", g(my.dom_element_prefix+bundle_id+"_resources_resources"));

		var h3 = dom.h3(div);

		h3.innerHTML = l("bundle", "object");

		var img = APP.GUI.icon(div,"delete_resource_" + resource_id +"_icon","delete_resource_icon","reset");
		img.addEventListener('click', function(num, num2) { 
			return function(){ my.removeResource(num, num2);
			};
		}(bundle_id,resource_id) );
		
		dom.span(div, "", "resource_file_content_span",
		l("bundle", "file_name") + 
		"<br><input type=\"text\" name=\""+my.dom_element_prefix+bundle_id+"_resource_" + resource_id + "_name\" value=\"\"><br>");
		
		div.getElementsByTagName("input")[0].value = name;
		//div.getElementsByTagName("input")[1].value = size;
		
		my.renderUCRS(div, my.dom_element_prefix+bundle_id+"_resource_" + resource_id + "_", urcs);


	};
	
	
	my.renderUCRS = function(parent, element_id_prefix, urcs){
	
	
	
		var cb_u = dom.input(parent, element_id_prefix+"u", "", "", "checkbox", "u");
		dom.span(parent, "", "", "U");
		if (urcs.u == true) {
			cb_u.checked = true;
		}
		
		
		var cb_r = dom.input(parent, element_id_prefix+"r", "", "", "checkbox", "r");
		dom.span(parent, "", "", "R");
		if (urcs.r == true) {
			cb_r.checked = true;
		}
		
		var cb_c = dom.input(parent, element_id_prefix+"c", "", "", "checkbox", "c");
		dom.span(parent, "", "", "C");
		if (urcs.c == true) {
			cb_c.checked = true;
		}
		
		var cb_s = dom.input(parent, element_id_prefix+"s", "", "", "checkbox", "s");
		dom.span(parent, "", "", "S");
		if (urcs.s == true) {
			cb_s.checked = true;
		}
	
	
	}


	my.refreshBundleHeading = function(bundle_id){

		if (get(my.dom_element_prefix+bundle_id+"_bundle_name") === ""){
			g(my.dom_element_prefix+bundle_id+"_label").innerHTML = l("bundle", "unnamed_bundle");
		}
		
		else {
		
			g(my.dom_element_prefix+bundle_id+"_label").innerHTML = l("bundle", "bundle") + ": "+get(my.dom_element_prefix+bundle_id+"_bundle_name");

		}

	};


	my.removeResource = function(bundle_id, resource_id){
		var m;

		var ids_of_bundle_resources = getArrayWithIDs(my.bundles[my.getIndexByID(bundle_id)].resources.resources);
		
		if (ids_of_bundle_resources.indexOf(resource_id) != -1){

			my.bundles[my.getIndexByID(bundle_id)].resources.resources.splice(my.getIndexFromResourceID(resource_id),1);
		
		}
		
		dom.remove(my.dom_element_prefix+bundle_id+"_resource_"+resource_id);

	};


	my.assignBundle1Metadata = function(){

		if (my.bundles.length < 2){
		
			APP.log(l("bundle", "at_least_2_bundles_to_assign_metadata"), "error");
			return;
			
		}
		
		for (var i=0; i<bundle_form.fields_to_copy.length; i++){
		
			if (g(APP.CONF.copy_checkbox_element_prefix+bundle_form.fields_to_copy[i].name).checked){  //if checkbox is checked
			
				if (bundle_form.fields_to_copy[i].name == "persons"){  //special case: persons!
				
					for (var s=1; s<my.bundles.length; s++){
						my.removeAllPersons(my.bundles[s].id);
			
						// copy persons from bundle 1 to bundle bundle
						for (var a=0;a<my.bundles[0].persons.persons.length;a++){
							my.addPerson(my.bundles[s].id,my.bundles[0].persons.persons[a]);
						}
					
					}
				
				}
			
				my.copyFieldsToAllBundles(bundle_form.fields_to_copy[i].fields);
				
			}
		
		}

		APP.log(l("bundle", "bundle_1_metadata_assigned_to_all_bundles"));

	};


	my.copyFieldsToAllBundles = function(fields_to_copy){
	//fields_to_copy is an array
	//it is indeed html conform to get textarea.value
		
		for (var s=1;s<my.bundles.length;s++){   //important to not include the first bundle in this loop
		
			for (var k=0;k<fields_to_copy.length;k++){
				APP.GUI.copyField(
					my.dom_element_prefix+my.bundles[s].id+"_"+fields_to_copy[k],
					my.dom_element_prefix+my.bundles[0].id+"_"+fields_to_copy[k]
				);
			}
		
		}
		
	};

	
	my.removeAllPersons = function(bundle_id){
	//Remove all persons from respective bundle
		
		while (my.bundles[my.getIndexByID(bundle_id)].persons.persons.length > 0){
			my.removePerson(bundle_id,my.bundles[my.getIndexByID(bundle_id)].persons.persons[0]);
			//Remove always the first person of this bundle because every person is at some point the first	
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
			
			for (var c=0; c<my.parent.not_allowed_chars.length; c++){
		
				if (get(my.dom_element_prefix+my.bundles[i].id+"_bundle_name").indexOf(my.parent.not_allowed_chars[c]) != -1){
			
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
			my.bundles[my.getIndexByID(bundle_id)].expanded = false;
		}
		
		else {
			document.getElementById(my.dom_element_prefix+bundle_id+"_content").style.display = "block";
			document.getElementById(my.dom_element_prefix+bundle_id+"_expand_img").src=APP.CONF.path_to_icons+"down.png";
			my.bundles[my.getIndexByID(bundle_id)].expanded = true;
		}
		
	};

	/*
	my.refreshPersonName = function(bundle_id, person_id){
	
		var person_index = person.getIndexByID(person_id);
		
		var this_bundle = my.bundles[my.getIndexByID(bundle_id)];
		
		var person_in_bundle = getObject(this_bundle.persons.persons, "id", person_id);

		var div = g(my.dom_element_prefix + bundle_id + "_person_" + person_id + "_label");
		
		//display name of person
		g(my.dom_element_prefix+bundle_id+"_person_" + person_id + "_name_disp").innerHTML = person.getDisplayName(person.persons[person_index].id);
		
		//display role of person
		APP.GUI.setFormValue(
			"person_in_bundle_"+person_id+"_role_input",
			person_in_bundle.role,
			[
				"annotator","author","compiler","consultant","data_inputter","depositor",
				"developer","editor","illustrator","interpreter","interviewee","interviewer",
				"participant","performer","photographer","recorder","researcher","research_participant",
				"responder","signer","singer","speaker","sponsor","transcriber","translator"
			]
		);


	};*/
	

	return my;

})();