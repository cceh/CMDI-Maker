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
		icon: "edit"
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
	
		my.bundles = [];
		my.id_counter = 0;
		my.lang_id_counter = 0;
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
		
		my.render.refresh(my.bundles);
	
	};
	
	
	my.getSaveData = function(){

		my.refreshVisibleBundlesInArray();
	
		var object = {
			bundles: my.bundles,
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
	
		forEach(my.bundles, my.refreshBundleInArray);
	
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
	

	my.newBundle = function(){

		var bundle_object = APP.forms.createEmptyObjectFromTemplate(my.parent.bundle_form);
		bundle_object.id = my.getNewBundleID();
		
		//new bundles are always expanded
		bundle_object.expanded = true;
		
		//push new bundle object into bundles array
		my.bundles.push(bundle_object);

		my.render.refresh(my.bundles);
		
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
			content_language: false,
		};
		
		
		var bundle_index = my.getIndexByID(bundle_id);
		
		my.bundles[bundle_index].languages.bundle_languages.push(BLO);
		
		my.render.renderLanguage(BLO, bundle_id, element_id_prefix);
		
		my.lang_id_counter += 1;

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
	
	
	my.sortAlphabetically = function(){
		
		//Before we sort the bundles, we save the newest user input
		my.refreshBundlesArray();
		
		my.bundles = sortBySubKey(my.bundles,["bundle","name"]);
		
		my.render.refresh(my.bundles);
		
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

		my.bundles.splice(my.getIndexByID(bundle_id),1);
		
		my.render.refresh(my.bundles);

	};
	
	
	my.getIndexFromResourceID = function (resource_id){
		var r;

		for (var s=0;s < my.bundles.length;s++){
		
			for (r=0; r < my.bundles[s].resources.resources.length; r++){
		
				if (my.bundles[s].resources.resources[r].id == resource_id){
					return r;
				}
			
			}
			
		}

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


	my.addPerson = function(bundle_id, person_id, role){
	//add existing person to bundle
	
		//var person_ids_in_bundle = getArrayWithIDs(my.bundles[my.getIndexByID(bundle_id)].persons.persons);

		//if bundle doesn't already contain this person
		//if (person_ids_in_bundle.indexOf(person_id) == -1){
		
			if (person.persons[person.getIndexByID(person_id)]){  //check if person still exists before adding
				
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
				
				my.bundles[my.getIndexByID(bundle_id)].persons.persons.push(person_in_bundle);
			
				//my.render.renderPerson(my.bundles[my.getIndexByID(bundle_id)], person_in_bundle);
				my.render.refresh(my.bundles);
				
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
	
		var bundle = my.bundles[my.getIndexByID(bundle_id)];

		var persons_in_bundle = bundle.persons.persons;
		
		var person_index = getIndexByID(persons_in_bundle, id);
		
		//remove id in array
		persons_in_bundle.splice(person_index, 1);
		
		dom.remove(my.dom_element_prefix + bundle_id + "_person_" + id);
		
		//my.refreshBundlesArray();
		//my.render.refresh(my.bundles);
		
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
		
		my.render.renderResource(resource_id, bundle_id,filename, filesize, urcs);

		my.resource_id_counter += 1;
		
		return my.resource_id_counter - 1;
		
	};


	my.removeResource = function(bundle_id, resource_id){
		var m;

		var ids_of_bundle_resources = getArrayWithIDs(my.bundles[my.getIndexByID(bundle_id)].resources.resources);
		
		if (ids_of_bundle_resources.indexOf(resource_id) != -1){

			my.bundles[my.getIndexByID(bundle_id)].resources.resources.splice(my.getIndexFromResourceID(resource_id),1);
		
		}
		
		dom.remove(my.dom_element_prefix+bundle_id+"_resource_"+resource_id);

	};
	
	
	my.handleClickOnCopyMetadata = function(){
	
		my.refreshVisibleBundlesInArray();
	
		if (get("copy_bundle_options") == "1_to_others"){
			my.assignBundle1Metadata();
		}
		
		else {
			my.copyMetadataFrom2ndLastToLast();
		}
		
		my.render.refresh(my.bundles);
	
	};
	
	
	my.copyMetadataFrom2ndLastToLast = function(){
	
		if (my.bundles.length < 2){
		
			APP.log(l("bundle", "at_least_2_bundles_to_assign_metadata"), "error");
			return;
			
		}
		
		for (var i=0; i<bundle_form.fields_to_copy.length; i++){
		
			if (g(APP.CONF.copy_checkbox_element_prefix+bundle_form.fields_to_copy[i].name).checked){  //if checkbox is checked
			
				if (bundle_form.fields_to_copy[i].name == "persons"){  //special case: persons!
				
					var last_bundle = my.bundles[my.bundles.length - 1];   //last bundle
					var second_last_bundle = my.bundles[my.bundles.length - 2];  //second_last_bundle
					
					my.removeAllPersons(last_bundle.id);
			
					// copy persons from 2nd last bundle to last bundle
					forEach(second_last_bundle.persons.persons, function(pers){
						my.addPerson(last_bundle.id, pers.person_id, pers.role);
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
				
					for (var s=1; s<my.bundles.length; s++){
						my.removeAllPersons(my.bundles[s].id);
			
						// copy persons from bundle 1 to bundle bundle
						forEach(my.bundles[0].persons.persons, function(pers){
							my.addPerson(my.bundles[s].id, pers.person_id, pers.role);
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
		
		for (var s=1; s<my.bundles.length; s++){   //important to not include the first bundle in this loop
		
			for (var k=0;k<fields_to_copy.length;k++){
				
				if (fields_to_copy[k] == "bundle_date"){
					my.bundles[s].bundle.date = cloneObject(my.bundles[0].bundle.date);
				}
				
				if (fields_to_copy[k] == "bundle_location"){
					my.bundles[s].bundle.location = cloneObject(my.bundles[0].bundle.location);
				}
				
				if (fields_to_copy[k] == "content"){
					my.bundles[s].content = cloneObject(my.bundles[0].content);
				}	

				if (fields_to_copy[k] == "persons_description"){
					my.bundles[s].persons.description = my.bundles[0].persons.description;
				}						
				
			}
		
		}
		
	};
	
	
	my.refreshPersonLists = function(persons){
	
		my.render.refreshPersonLists(my.bundles, persons);
	
	};
	
	
	my.copyFieldsFrom2ndLastToLastBundle = function(fields_to_copy){
	//fields_to_copy is an array
	//it is indeed html conform to get textarea.value
		
		var last_bundle = my.bundles[my.bundles.length - 1];   //last bundle
		var second_last_bundle = my.bundles[my.bundles.length - 2];  //second_last_bundle
		
		
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
			
		}
	
	};

	
	my.removeAllPersons = function(bundle_id){
	//Remove all persons from respective bundle
		
		my.bundles[my.getIndexByID(bundle_id)].persons.persons = [];
		my.render.refresh(my.bundles);
		
	};


	my.refreshResourcesOfAllBundles = function(){
	//Offer possibility to add every available media file to all bundle
	//refresh all bundles with available media files

		var visible_bundles = my.render.pager.visible_items;
	
		for (var s = 0; s < visible_bundles.length; s++){
		
			my.render.refreshResources(visible_bundles[s].id);
			
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
	
	
	my.updatePersonNameInAllBundles = function(person_id){
	
		//return my.render.updatePersonNameInAllBundles(person_id, my.bundles);
		return;
	
	};


	return my;

})();