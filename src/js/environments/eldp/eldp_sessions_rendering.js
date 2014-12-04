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


eldp_environment.workflow[2].render = (function() {
	'use strict';
	
	var my = {};
	my.parent = eldp_environment;
	
	
	var l = my.parent.l;
	var bundle_form = my.parent.bundle_form;
	var resources;
	var person;

	var actions;
	
	var bundle;

	my.dom_element_prefix = "bundle_";
	
	my.init = function(view, actions_object){
	
		my.view_element = view;
		
		actions = actions_object;
		
		resources = eldp_environment.workflow[0];
		person = eldp_environment.workflow[1];
		bundle = eldp_environment.workflow[2];
	
		my.displayNoBundleText(actions.newBundle);
		
		
		var pager_config = {
			render: my.renderBundle,
			on_page_change: my.refresh,
			items_list: bundle.bundles.getAll(),
			view: view,
			items_per_page: 10,
			before_page_change: bundle.refreshVisibleBundlesInArray
		};
		
		my.pager = new APP.GUI.pager(pager_config);
		
	};
	
	
	my.view = function(){
	
		APP.GUI.scrollTop();
		
		my.pager.refresh(bundle.bundles.getAll());
	
	};
	

	my.createCopyBundleOptions = function (){

		var div = g("copy_bundles_select");
		
		dom.h3(div, l("bundle", "from_where_to_where"));
		
		var options = [
			{
				title: l("bundle", "from_bundle_1_to_all_others"),
				id: "1_to_others"
			},
			{
				title: l("bundle", "from_2nd_last_to_last_bundle"),
				id: "second_last_to_last"
			}		
		];
		
		dom.makeRadios(div, options, "copy_bundle_options", "", "title", "id", 0, undefined);
		
		dom.br(div);
		
		dom.h3(div, l("bundle", "elements_to_copy"));
		
		if (!bundle_form.fields_to_copy){
		
			dom.make("span", "", "", div, l("bundle", "this_function_is_currently_unavailable"));
			return;
			
		}

		var copy_options = bundle_form.fields_to_copy;

		for (var c = 0; c < copy_options.length; c++){
		
			var input = dom.input(div, APP.CONF.copy_checkbox_element_prefix+copy_options[c].name, "", "", "checkbox");
			input.checked = true;
			
			dom.span(div, "", "", " " + copy_options[c].label);
			dom.br(div);
		
		}


	};
	
	
	my.refreshResources = function(bundle_id){
	//refresh resources for one bundle

		var add_res_div = g(my.dom_element_prefix+bundle_id+"_resources_add_mf_div");
		
		add_res_div.innerHTML = "";

		var select = document.createElement("select");
		
		dom.setSelectOptions(select, resources.resources.getAll(), "name", "take_index", false);
		
		if (resources.resources.length > 0){
		
			add_res_div.appendChild(select);
			dom.br(add_res_div);
			
			dom.button(
				add_res_div,
				l("bundle", "add_to_bundle"),
				function(num) {
					return function(){
						actions.addResource(num, select.selectedIndex, false);
					};
				}(bundle_id)
			);
			
		}

		if (resources.resources.length === 0){
		
			var p = document.createElement("h5");
			add_res_div.appendChild(p);
			p.innerHTML = l("bundle", "no_files_have_been_added") + "<br>";
		
			dom.link(p, "", "", l("bundle", "add_some_files"), function() {
				APP.view(resources);
			});
			
		
		}
		

	};


	my.refresh = function(bundles){
	
		var bundles_view = my.view_element;
		
		bundles_view.innerHTML = "";
		
		//console.log("render.refresh: bundles: ");
		//console.log(bundles);

		my.pager.refresh(bundles);
		
		forEach(my.pager.visible_items, my.renderBundle);
		
		if (bundles.length === 0){
	
			my.displayNoBundleText(actions.newBundle);
	
		}

	};
	
	
	my.renderBundle = function(bundle_object){
	
		var bundle_id = bundle_object.id;
		var bundle_expanded = bundle_object.expanded;
	
		var bundles_view = my.view_element;
	
		//remove no bundles message before drawing new bundle
		if (g("no_bundle_text")) {
			bundles_view.innerHTML = "";
		}
		
		var form = APP.GUI.FORMS.expandableForm(
			bundles_view,
			my.dom_element_prefix + bundle_id,
			bundle_expanded,
			function(event) {

				bundle_object.expanded = event.expanded;
			
			},
			actions.deleteBundle,
			bundle_id
		);
		
		//create the form
		APP.forms.make(form.content, bundle_form, my.dom_element_prefix+bundle_id+"_", my.dom_element_prefix, bundle_object, my.makeSpecialFormInput);
		
		g(my.dom_element_prefix+bundle_id+"_bundle_title").addEventListener("blur", function(num){
			return function(){
			
				my.refreshBundleHeading(num);
			};
		}(bundle_id));

		
		//Render languages
		var element_id_prefix = my.dom_element_prefix + bundle_id + "_languages_";
		
		forEach(bundle_object.languages.bundle_languages, function(LanguageObject){
			my.renderLanguage(LanguageObject, bundle_id, element_id_prefix);
		});

		if (typeof(bundle_object.persons) != "undefined" && typeof(bundle_object.persons.persons) != "undefined"){
		
			forEach(bundle_object.persons.persons, function(person_in_bundle){
		
				my.renderPerson(bundle_object, person_in_bundle);
		
			});
		}
		
		
		if (typeof(bundle_object.resources.resources) != "undefined"){
			
			forEach(bundle_object.resources.resources, function (resource_in_bundle){
				my.renderResource(resource_in_bundle, bundle_id);
				bundle.resource_id_counter += resource_in_bundle.id;  //DIRTY!
			});
		
		}
		
		//refreshes list of resources that are available
		my.refreshResources(bundle_id);
		
		var all_available_person_ids = person.persons.getArrayWithIDs();
		// find a better place for that

		my.refreshPersonListInBundle(bundle_object, all_available_person_ids);
		
		my.refreshBundleHeading(bundle_id);
	
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
					actions.setLanguage(LanguageObject, bundle_id, element_id_prefix);
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

			var textInputValue = (BLO.name !== "") ? BLO.name : l("bundle", "specify_local_used_language_name");
			
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
		
		APP.GUI.FORMS.redBox(g(element_id_prefix + "display"), element_id, "bundle_language_entry", box_content, function(num, num2, num3){
			return function(){
				actions.removeLanguage(num, num2, num3);
			};
		}(bundle_id, lang_id, element_id));
	};
	
	
	my.refreshPersonName = function(bundle, id){
	
		var bundle_id = bundle.id;
		
		var h2_id = my.dom_element_prefix + bundle_id + "_person_" + id + "_name_disp";

		var h2 = g(h2_id);
		
		console.log(h2);
		
		var person_in_bundle = getObjectByID(bundle.persons.persons, id);
		var person_id = person_in_bundle.person_id;
		
		console.log(person_id);
		
		var display_name = person.getDisplayName(person_id);
		
		console.log(display_name);
		
		h2.innerHTML = display_name;
		//display name of person

	};
	
	
	my.updatePersonNameInAllBundles = function(person_id, bundles){
	
		forEach(bundles, function(bundle){
		
			var person_ids_in_bundle = map(bundle.persons.persons, function(pers){
				return pers.person_id;
			});
			
			//search for person_id in this bundles' persons
			if (person_ids_in_bundle.indexOf(person_id) != -1){

				my.refreshPersonName(bundle, person_id);
	
			}
			
		});
	};
	
	
	my.refreshPersonListInBundle = function(bundle, all_available_person_ids){
	
		var bundle_id = bundle.id;

		var aad = g(my.dom_element_prefix + bundle_id + "_persons_addPersons_div");
		
		aad.innerHTML = "";

		var select = document.createElement("select");
		
		dom.setSelectOptions(select, person.persons.getAll(), "display_name", "take_index");

		if (person.persons.length > 0){
		
			aad.appendChild(select);
		
			dom.br(aad);	
			
			dom.button(aad, "Add to bundle", function(num) { 
				return function(){ actions.addPerson(num, person.persons.idOf(select.selectedIndex));  };
			}(bundle_id));
			
		}
		
		if (person.persons.length === 0){
		
			var h5 = dom.h5(aad, l("bundle", "no_persons_created_yet") + "<br>");	
			
			dom.link(h5,"","", l("bundle", "create_some_persons"), function() { 
				APP.view("VIEW_persons");  
			} );
			
		}
		
		
		//console.log("Refreshing Person List of Bundle with id" + bundle_id);
		
		
		//check if person in bundle is part of persons[...].id(s)? if not, remove it immediately!
		bundle.persons.persons.forEach(function(person_in_bundle){
			
			// if a person is not in available persons, remove it from the bundle!
			if (all_available_person_ids.indexOf(person_in_bundle.person_id) == -1){
				
				console.log("There is an person in bundle with id" + bundle_id + " that does not exist anymore. Deleting!");
				actions.removePerson(bundle_id, person_in_bundle.id);
			
			}
		
		
		});


	};


	my.refreshPersonLists = function(bundles, persons){
		//Offer possibility to add every available person to all bundle
		//refresh all bundles with available persons

		var all_available_person_ids = getArrayWithIDs(persons);
		
		
		// for all visible bundles
		for (var i = 0; i < my.pager.visible_items.length; i++){
		
			my.refreshPersonListInBundle(my.pager.visible_items[i], all_available_person_ids);

		}

	};
	
	
	my.displayNoBundleText = function(action){

		console.log("Showing no bundle text");

		var bundles_view = my.view_element;
		
		bundles_view.innerHTML = "";

		var no_bundles_message = dom.make("h2","no_bundle_text","no_bundle_text",bundles_view);
		no_bundles_message.innerHTML = l("bundle", "no_bundles_have_been_created_yet") +
		" " + l("bundle", "why_not_create_one__before_link");

		var new_bundle_link = dom.make("a","new_bundle_link","new_bundle_link",no_bundles_message);

		new_bundle_link.innerHTML = l("bundle", "why_not_create_one__link");

		no_bundles_message.innerHTML += l("bundle", "why_not_create_one__after_link");

		g("new_bundle_link").addEventListener('click', action);
		//we have to use g here instead of no_bundles_link, because latter one isn't there anymore. it has been overwritten by ...innerHTML --> logically!
		
		bundles_view.scrollTop = 0;

	};


	my.renderPerson = function(bundle, person_in_bundle){

		var bundle_id = bundle.id;
	
		var id = person_in_bundle.id;
		var role_display = (person_in_bundle.role !== "") ? person_in_bundle.role : "Role";

		dom.make("div", my.dom_element_prefix + bundle_id + "_person_" + id, "person_in_bundle_wrap", g(my.dom_element_prefix+bundle_id+"_persons_persons"));
		var div = dom.make("div", my.dom_element_prefix+bundle_id+"_person_" + id + "_label", "person_in_bundle", g(my.dom_element_prefix+bundle_id+"_person_" + id));
		
		var h2 = dom.h2(div);
		h2.className = "person_name_disp";
		h2.id = my.dom_element_prefix+bundle_id+"_person_" + id + "_name_disp";
		
		
		/*
		APP.GUI.openVocabulary(div,
			undefined, "", "person_in_bundle_"+id+"_role_input", 1,
			[
				"annotator","Author","Compiler","Consultant","Data_inputter","Depositor",
				"Developer","Editor","Illustrator","Interpreter","Interviewee","Interviewer",
				"Participant","Performer","Photographer","Recorder","Researcher","Research_participant",
				"Responder","Signer","Singer","Speaker","Sponsor","Transcriber","Translator"
			],
			role_display, undefined, "person_role_input"
		);
		*/
		
		var select = APP.GUI.makeSelect(div,
			undefined, "person_in_bundle_"+id+"_role_input",
			"person_in_bundle_"+id+"_role_input", 1,
			[
				"annotator","Author","Compiler","Consultant","Data_inputter","Depositor",
				"Developer","Editor","Illustrator","Interpreter","Interviewee","Interviewer",
				"Participant","Performer","Photographer","Recorder","Researcher","Research_participant",
				"Responder","Signer","Singer","Speaker","Sponsor","Transcriber","Translator"
			],
			role_display, undefined
		);
		select.className = "person_role_input";
		
		my.refreshPersonName(bundle, id);
		
		APP.GUI.icon(g(my.dom_element_prefix+bundle_id+"_person_" + id),
		"delete_person_"+id+"_icon", "delete_person_icon", "reset", function(num, num2) { 
			return function(){ actions.removePerson(num, num2);  
			};
		}(bundle_id, id));

	};


	my.renderResource = function(resource_in_bundle, bundle_id){
	
		var id = resource_in_bundle.id;
		var urcs = resource_in_bundle.urcs;
		
		var name = resources.resources.getByID(resource_in_bundle.resource_id).name;

		var div = dom.make('div', my.dom_element_prefix+bundle_id+"_resource_" + id, "mf", g(my.dom_element_prefix+bundle_id+"_resources_resources"));

		var h3 = dom.h3(div);

		h3.innerHTML = l("bundle", "object");

		var img = APP.GUI.icon(div,"delete_resource_" + id +"_icon","delete_resource_icon","reset");
		img.addEventListener('click', function(num, num2) { 
			return function(){ actions.removeResource(num, num2);
			};
		}(bundle_id, id) );
		
		dom.span(div, "", "resource_file_content_span",
		l("bundle", "file_name") + 
		"<br><input type='text' value='" + name + "'><br>");

		my.renderUCRS(div, my.dom_element_prefix+bundle_id+"_resource_" + id + "_", urcs);


	};
	
	
	my.renderUCRS = function(parent, element_id_prefix, urcs){
	
	
	
		var cb_u = dom.input(parent, element_id_prefix+"u", "", "", "checkbox", "u");
		dom.span(parent, "", "", "U");
		if (urcs.u === true) {
			cb_u.checked = true;
		}
		
		
		var cb_r = dom.input(parent, element_id_prefix+"r", "", "", "checkbox", "r");
		dom.span(parent, "", "", "R");
		if (urcs.r === true) {
			cb_r.checked = true;
		}
		
		var cb_c = dom.input(parent, element_id_prefix+"c", "", "", "checkbox", "c");
		dom.span(parent, "", "", "C");
		if (urcs.c === true) {
			cb_c.checked = true;
		}
		
		var cb_s = dom.input(parent, element_id_prefix+"s", "", "", "checkbox", "s");
		dom.span(parent, "", "", "S");
		if (urcs.s === true) {
			cb_s.checked = true;
		}
	
	
	};


	my.refreshBundleHeading = function(bundle_id){

		//if (get(my.dom_element_prefix + bundle_id + "_bundle_title") === ""){
		if (bundle.bundles.getByID(bundle_id).bundle.title === ""){

			g(my.dom_element_prefix + bundle_id + "_label").innerHTML = l("bundle", "unnamed_bundle");
			
		}
		
		else {

			g(my.dom_element_prefix + bundle_id + "_label").innerHTML = l("bundle", "bundle") + ": "+get(my.dom_element_prefix+bundle_id+"_bundle_title");

		}

	};

	return my;

})();