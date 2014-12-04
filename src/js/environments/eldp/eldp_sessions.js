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
	
	var refresh = function(){
		my.render.refresh(my.bundles.getAll());
	}
	
	my.identity = {
		id: "bundle",
		title: "Bundles",
		icon: "edit"
	};
	
	my.bundles = new ObjectList();

	my.lang_id_counter = 0;
	my.resource_id_counter = 0;
	my.person_id_counter = 0;
	
	my.dom_element_prefix = "bundle_";
	
	my.reset = function(){
		my.bundles.eraseAll();
		refresh();
	};
	
	var resources;
	var person;
	
	
	var l = my.parent.l;

	my.init = function(view){
	
		resources = eldp_environment.workflow[0];
		person = eldp_environment.workflow[1];
	
		my.bundles.reset();

		my.resource_id_counter = 0;
		my.person_id_counter = 0;
		
		var actions = {
		
			newBundle: my.newBundle,
			deleteBundle: my.userErase,
			setLanguage: my.set,
			addPerson: my.addPerson,
			removePerson: my.removePerson,
			addResource: my.addResource,
			removeResource: my.removeResource,
			removeLanguage: my.removeLanguage
		
		};
		
		my.render.init(view, actions);

	};
	
	
	my.view = function(){
	
		my.render.view();
	
	};
	
	
	my.recall = function(data){
		
		if (!data.bundles){
			return;
		}
		
		my.bundles.setState(data.bundles);

		if (data.person_id_counter){
			my.person_id_counter = data.person_id_counter;
		}
		
		refresh();
	
	};
	
	
	my.getSaveData = function(){

		my.refreshVisibleBundlesInArray();
	
		var object = {
			bundles: my.bundles.getState(),
			lang_id_counter: my.lang_id_counter,
			person_id_counter: my.person_id_counter
		};
	
		return object;
	
	};
	
	
	my.refreshVisibleBundlesInArray = function(){
		
		forEach(
			my.render.pager.visible_items,
			my.refreshBundleInArray
		);
		
	}
	
	
	my.refreshBundlesArray = function(){
	
		forEach(my.bundles.getAll(), my.refreshBundleInArray);
	
	};
	
	
	my.refreshBundleInArray = function(bun){
	
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
				label: l("bundle", "copy_metadata"),
				icon: "copy",
				id: "link_copy_bundles",
				wrapper_id: "copy_bundles_div",
				type: "function_wrap",
				sub_div: "copy_bundles_select",
				onclick: function() { my.handleClickOnCopyMetadata(); },
				after_that: my.render.createCopyBundleOptions
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
							// user clicked "cancel" (as cancel is always the red 
							//button, the red button is chosen to be the executive 
							//button
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
				onclick: function() {
					my.refreshBundlesArray();
					my.bundles.sortBySubKey("bundle", "name");
					refresh();
				}
			}
		];
	};
	

	my.newBundle = function(){

		var bundle_object = APP.forms.createEmptyObjectFromTemplate(my.parent.bundle_form);
		
		//new bundles are always expanded
		bundle_object.expanded = true;
		
		my.bundles.add(bundle_object);

		refresh();
		
		return bundle_object.id;
	};
	
	
	my.createNewBundleWithResources = function(name, expanded, resources){
	
		var bundle_object = APP.forms.createEmptyObjectFromTemplate(my.parent.bundle_form);
		bundle_object.bundle.name = name;
		bundle_object.expanded = expanded;

		my.bundles.add(bundle_object);
		
		my.render.renderBundle(bundle_object);
		
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
	
	
	my.set = function(LanguageObject, bundle_id, element_id_prefix){
		
		//BLO = bundle language object
		var BLO = {
			code: LanguageObject[0],
			name: LanguageObject[3],
			name_type: LanguageObject[2],
			country_code: LanguageObject[1],
			id: my.lang_id_counter,
			working_language: false,
			content_language: false
		};
		
		my.bundles.getByID(bundle_id).languages.bundle_languages.push(BLO);
		
		my.render.renderLanguage(BLO, bundle_id, element_id_prefix);
		
		my.lang_id_counter += 1;

	};

	
	my.removeLanguage = function(bundle_id, l_id, element_id){
	
		var bundle_index = my.getIndexByID(bundle_id);	
		var language_index = my.getLanguageObjectIndexByID(bundle_index, l_id);

		console.log(bundle_index + ", " + language_index);
		my.bundles.get(bundle_index).languages.bundle_languages.splice(language_index, 1);
		
		dom.remove(element_id);
	
	};
	
	
	my.getLanguageObjectIndexByID = function(bundle_index, l_id){
		
		return getIndex(my.bundles.get(bundle_index).languages.bundle_languages, 4, l_id);

	};

	
	my.getName = function(bundle_index){

		if (my.bundles.get(bundle_index).name === ""){
		
			return l("bundle", "unnamed_bundle");
			
		}
		
		else {
		
			return l("bundle", "bundle") + ": " + my.bundles.get(bundle_index).name;
		
		}
		
	};
	
	
	my.userErase = function(bundle_id){

		APP.confirm(l("bundle", "really_erase_bundle"), function (e) {

			if (e) {
				// user clicked "ok"
				
			}
		
			else {
				// user clicked "cancel"
				my.bundles.eraseByID(bundle_id);
				APP.log(l("bundle", "bundle_deleted"));
				refresh();
			}
		}, l("bundle", "no"), l("bundle", "yes_delete_bundle"));

	};


	my.getIndexFromResourceID = function (id){
	
		var r;

		for (var b = 0; b < my.bundles.length; b++){
		
			var bun = my.bundles.get(b);
		
			for (r = 0; r < bun.resources.resources.length; r++){
		
				if (bun.resources.resources[r].id == id){
					return r;
				}
			
			}
			
		};

	};
	

	my.addPerson = function(bundle_id, person_id, role){
	//add existing person to bundle
	
		//var person_ids_in_bundle = getArrayWithIDs(my.bundles[my.getIndexByID(bundle_id)].persons.persons);

		//if bundle doesn't already contain this person
		//if (person_ids_in_bundle.indexOf(person_id) == -1){
		
			if (person.persons.getByID(person_id)){  //check if person still exists before adding
				
				console.log("adding person in bundle with id " + bundle_id);
				console.log(role);
				
				if (typeof role != "string"){
					role = "";
				}
				
				var person_in_bundle = {
					id: my.person_id_counter,
					person_id: person_id,
					role: role
				};
				
				my.bundles.getByID(bundle_id).persons.persons.push(person_in_bundle);
			
				//my.render.renderPerson(my.bundles[my.getIndexByID(bundle_id)], person_in_bundle);
				my.render.refresh(my.bundles.getAll());
				
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


	my.removePerson = function(bundle_id, id){
	
		var bundle = my.bundles.getByID(bundle_id);

		var persons_in_bundle = bundle.persons.persons;
		
		var person_index = getIndexByID(persons_in_bundle, id);
		
		//remove id in array
		persons_in_bundle.splice(person_index, 1);
		
		dom.remove(my.dom_element_prefix + bundle_id + "_person_" + id);
		
	};


	my.addResource = function(bundle_id, resource_file_index, without_questions){
	// resource_file_index is the index of the available media file, that is to be added to the bundle
	// if resource_file_index is -1, a new empty field with no available media file is created
	//if without_questions == true, no alerts will be thrown (e.g. when resources are added at start up)

		if (resource_file_index >= resources.resources.length){
			return;
		}
		
		var res = resources.resources.get(resource_file_index);
		
		var id = my.resource_id_counter;

		var urcs = {
			u: false,
			r: false,
			c: false,
			s: false
		};
		
		var resource_in_bundle = {
			id: id,
			resource_id: res.id,
			urcs: urcs
		};
		
		my.bundles.getByID(bundle_id).resources.resources.push(resource_in_bundle);
		
		//Rename the bundle if an EAF file is added for the first time and bundle has no name yet
		if ((getFileTypeFromFilename(res.name) == "eaf") && (get(my.dom_element_prefix+bundle_id+"_bundle_title") === "")){
		
			var name = removeEndingFromFilename(res.name);
			
			my.bundles.getByID(bundle_id).bundle.title = name;
		
			APP.log(l("bundle", "bundle_title_taken_from_eaf"));
		
		}
		
		refresh();

		my.resource_id_counter += 1;
		
		return id;
		
	};


	my.removeResource = function(bundle_id, id){
		var m;

		var ids_of_bundle_resources = getArrayWithIDs(my.bundles.getByID(bundle_id).resources.resources);
		
		if (ids_of_bundle_resources.indexOf(id) != -1){
		
			var index = my.getIndexFromResourceID(id);

			my.bundles.getByID(bundle_id).resources.resources.splice(index, 1);
		
		}
		
		dom.remove(my.dom_element_prefix + bundle_id + "_resource_" + id);

	};
	
	
	my.handleClickOnCopyMetadata = function(){
	
		my.refreshVisibleBundlesInArray();
	
		if (get("copy_bundle_options") == "1_to_others"){
			my.assignBundle1Metadata();
		}
		
		else {
			my.copyMetadataFrom2ndLastToLast();
		}
		
		refresh();
	
	};
	
	
	my.copyMetadataFrom2ndLastToLast = function(){
	
		if (my.bundles.length < 2){
		
			APP.log(l("bundle", "at_least_2_bundles_to_assign_metadata"), "error");
			return;
			
		}
		
		for (var i=0; i<bundle_form.fields_to_copy.length; i++){
		
			if (g(APP.CONF.copy_checkbox_element_prefix+bundle_form.fields_to_copy[i].name).checked){  //if checkbox is checked

				var last_bundle = my.bundles.getLast();
				var second_last_bundle = my.bundles.getFromEnd(1);
			
				if (bundle_form.fields_to_copy[i].name == "persons"){  //special case: persons!
				
					my.removeAllPersons(last_bundle.id);
			
					// copy persons from 2nd last bundle to last bundle
					forEach(second_last_bundle.persons.persons, function(pers){
						my.addPerson(last_bundle.id, pers.person_id, pers.role);
					});
					
				}
				
				if (bundle_form.fields_to_copy[i].name == "languages"){  //special case: persons!
					
					last_bundle.languages.bundle_languages = [];
					
					forEach(second_last_bundle.languages.bundle_languages, function(BLO){
					
						var BLO_new = cloneObject(BLO);
						BLO_new.id = my.lang_id_counter;
						my.lang_id_counter += 1;
					
						last_bundle.languages.bundle_languages.push(BLO_new);
						
					});
					
				}
				
			
				my.copyFieldsFrom2ndLastToLastBundle(bundle_form.fields_to_copy[i].fields);
				
			}
		
		}

		APP.log(l("bundle", "metadata_copied"));
	
	};


	my.assignBundle1Metadata = function(){

		if (my.bundles.length < 2){
		
			APP.log(l("bundle", "at_least_2_bundles_to_assign_metadata"), "error");
			return;
			
		}
		
		for (var i=0; i<bundle_form.fields_to_copy.length; i++){
		
			if (g(APP.CONF.copy_checkbox_element_prefix + bundle_form.fields_to_copy[i].name).checked){  //if checkbox is checked
			
				if (bundle_form.fields_to_copy[i].name == "persons"){  //special case: persons!
				
					for (var s = 1; s < my.bundles.length; s++){
						my.removeAllPersons(my.bundles.idOf(s));
			
						// copy persons from bundle 1 to bundle bundle
						forEach(my.bundles.get(0).persons.persons, function(pers){
							my.addPerson(my.bundles.idOf(s), pers.person_id, pers.role);
						});
					
					}
				
				}
				
				
				if (bundle_form.fields_to_copy[i].name == "languages"){  //special case: languages!
					
					for (s = 1; s < my.bundles.length; s++){
						
						my.bundles.get(s).languages.bundle_languages = [];
					
						forEach(my.bundles.get(0).languages.bundle_languages, function(BLO){
						
							var BLO_new = cloneObject(BLO);
							BLO_new.id = my.lang_id_counter;
							my.lang_id_counter += 1;
						
							my.bundles.get(s).languages.bundle_languages.push(BLO_new);
							
						});
					
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
		
		for (var s = 1; s < my.bundles.length; s++){   //important to not include the first bundle in this loop
		
			for (var k = 0; k < fields_to_copy.length; k++){
				
				if (fields_to_copy[k] == "bundle_date"){
					my.bundles.get(s).bundle.date = cloneObject(my.bundles.getFirst().bundle.date);
				}
				
				if (fields_to_copy[k] == "bundle_location"){
					my.bundles.get(s).bundle.location = cloneObject(my.bundles.getFirst().bundle.location);
				}
				
				if (fields_to_copy[k] == "content"){
					my.bundles.get(s).content = cloneObject(my.bundles.getFirst().content);
				}	

				if (fields_to_copy[k] == "persons_description"){
					my.bundles.get(s).persons.description = my.bundles.getFirst().persons.description;
				}

				if (fields_to_copy[k] == "resources_recording_equipment"){
					my.bundles.get(s).resources.recording_equipment = my.bundles.getFirst().resources.recording_equipment;
				}	

				if (fields_to_copy[k] == "resources_recording_conditions"){
					my.bundles.get(s).resources.recording_conditions = my.bundles.getFirst().resources.recording_conditions;
				}	
				
			}
		
		}
		
	};
	
	
	my.refreshPersonLists = function(persons){
	
		my.render.refreshPersonLists(my.bundles.getAll(), persons);
	
	};
	
	
	my.copyFieldsFrom2ndLastToLastBundle = function(fields_to_copy){
	//fields_to_copy is an array
	//it is indeed html conform to get textarea.value
		
		var last_bundle = my.bundles.getLast();
		var second_last_bundle = my.bundles.getFromEnd(1);
		
		
		for (var k=0;k<fields_to_copy.length;k++){
		
			if (fields_to_copy[k] == "bundle_date"){
				last_bundle.bundle.date = cloneObject(second_last_bundle.bundle.date);
			}
			
			if (fields_to_copy[k] == "bundle_location"){
				last_bundle.bundle.location = cloneObject(second_last_bundle.bundle.location);
			}
			
			if (fields_to_copy[k] == "content"){
				last_bundle.content = cloneObject(second_last_bundle.content);
			}	
			
			if (fields_to_copy[k] == "persons_description"){
				last_bundle.persons.description = second_last_bundle.persons.description;
			}	

			if (fields_to_copy[k] == "resources_recording_equipment"){
				last_bundle.resources.recording_equipment = second_last_bundle.resources.recording_equipment;
			}	

			if (fields_to_copy[k] == "resources_recording_conditions"){
				last_bundle.resources.recording_conditions = second_last_bundle.resources.recording_conditions;
			}				
			
		}
	
	};

	
	my.removeAllPersons = function(bundle_id){
	//Remove all persons from respective bundle
		
		my.bundles.getByID(bundle_id).persons.persons = [];
		refresh();
		
	};


	my.refreshResourcesOfAllBundles = function(resources){
	//Offer possibility to add every available media file to all bundle
	//refresh all bundles with available media files
	
		var all_available_resource_ids = getArrayWithIDs(resources);

		my.bundles.forEach(function(bun){
		//check for added resources that have been deleted in resource tab and delete them here too
			bun.resources.resources.forEach(function(res_in_bun){
			
				// if a person is not in available persons, remove it from the bundle!
				if (all_available_resource_ids.indexOf(res_in_bun.resource_id) == -1){
					
					console.log("There is a resource in bundle with id" + res_in_bun.resource_id + " that does not exist anymore. Deleting!");
					my.removeResource(bun.id, res_in_bun.id);
				
				}
			
			
			});
			
		});
		
	

		var visible_bundles = my.render.pager.visible_items;
		//console.log("VISIBLE ITEMS");
		//console.log(visible_bundles);
	
		for (var s = 0; s < visible_bundles.length; s++){
		
			my.render.refreshResources(visible_bundles[s].id);
			
		}

	};


	my.areAllBundlesProperlyNamed = function(){

		for (var i = 0; i < my.bundles.length; i++){
		
			if (my.bundles.get(i).bundle.title === ""){
			
				return false;
			
			}
			
			for (var c = 0; c < my.parent.not_allowed_chars.length; c++){
		
				if (my.bundles.get(i).bundle.title.indexOf(my.parent.not_allowed_chars[c]) != -1){
			
					return false;
				
				}
		
			}
			
		}
		
		return true;
		
	};
	
	
	
	my.doAllBundlesHaveALanguage = function(){
	
		for (var i = 0; i < my.bundles.length; i++){
		
			if (my.bundles.get(i).languages.bundle_languages.length == 0){
			
				return false;
			
			}
			
		}
		
		return true;	
	
	};
	
	
	my.updatePersonNameInAllBundles = function(person_id){
	
		return my.render.updatePersonNameInAllBundles(person_id, my.bundles.getAll());
	
	};
	
	
	return my;

})();