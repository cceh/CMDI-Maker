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


var APP = (function () {
	'use strict';

	var my = {};
	
	my.languages = [];
	
	my.getLPFromID = function(id){
	
		for (var l=0; l<my.languages.length; l++){
		
			if (id == my.languages[l].id){
				return my.languages[l];
			}
		
		}
		
		console.log("ERROR: No language object with id " + id + " found!");
		return undefined;
	
	};
	
	
	my.getIndexFromLPID = function(id){
	
		for (var l=0; l<my.languages.length; l++){
		
			if (id == my.languages[l].id){
				return l;
			}
		
		}
		
		console.log("ERROR: No language object with id " + id + " found!");
		return undefined;
	
	};
	
	
	my.active_view = undefined;
	my.active_language = undefined;

	
	my.views = [
		{
			id: "start",
			place: "top"
		},
		{
			id: "settings",
			icon: "gear2.png",
			place: "bottom"
		},
		{
			id: "about",
			icon: "about.png",
			place: "bottom"
		}
	];
	
	
	my.l = function(arg1, arg2, arg3){
		
		return my.getTermInActiveLanguage(my.languages, arg1, arg2, arg3);
		
	};
	
	
	my.getActiveLanguagePackFromID = function(id, LPArray){
	
		for (var l=0; l<LPArray.length; l++){
			if (LPArray[l].id == id){
				return LPArray[l];
			}
		}
	
		return undefined;
	
	};
	
	
	var getTermInLP = function(LP, arg1, arg2, arg3, arg4){

		if (typeof LP[arg1] == "undefined"){
			return undefined;
		}
	
		if (arg4){

			if (typeof LP[arg1][arg2][arg3][arg4] != "undefined"){
				return LP[arg1][arg2][arg3][arg4];
			}
			
			else {
				return undefined;
			}
			
		}
	
		if (arg3){

			if (typeof LP[arg1] != "undefined" && typeof LP[arg1][arg2][arg3] != "undefined"){
				return LP[arg1][arg2][arg3];
			}
			
			else {
				return undefined;
			}
			
		}
		
		if (arg2){

			if (typeof LP[arg1] != "undefined" && typeof LP[arg1][arg2] != "undefined"){
				return LP[arg1][arg2];
			}
			
			else {
				return undefined;
			}
			
		}
		
		return LP[arg1];
	
	}
	
	
	my.getTermInActiveLanguage = function(LanguagePacksArray, arg1, arg2, arg3, arg4){
	
		//Look in the LanguagesArray, that's been given by the APP or by one environment and then search for the language that has the id of the APP's active language
		var LP = my.getActiveLanguagePackFromID(my.active_language.id, LanguagePacksArray);
	
		
		
		var termInLP = getTermInLP(LP, arg1, arg2, arg3, arg4);
		
		if (typeof termInLP != "undefined"){
			return termInLP;
		}
		
		//try to get term in default language
		console.log("Haven't found a term in active language: " + arg1 + ", " + arg2 + ", " + arg3 + ", " + arg4);
		console.log("Trying to get it in default language");
		
		var defaultLP = LanguagePacksArray[0];
		var termInDefaultLP = getTermInLP(defaultLP,arg1,arg2,arg3,arg4);
		
		if (typeof termInDefaultLP != "undefined"){
			return termInDefaultLP;
		}
		
		//if there's no word at all, PROBLEM!!!
		console.log("LANGUAGE ERROR: " + arg1 + ", " + arg2 + ", " + arg3 + ", " + arg4);
		return "###";

	};
	
	
	my.settings = function(){
	
		return [
			{
				title: my.l("settings","program_language"),
				type: "select",
				name: "language_select",
				id: "language_select",
				onchange: function(){my.changeLanguage(g("language_select").selectedIndex);}
			},
			{
				title: my.l("settings","profile"),
				type: "select",
				name: "profile_select",
				id: "profile_select",
				onchange: function(){my.environments.change(g("profile_select").selectedIndex-1);}
			},
			{
				title: my.l("settings","auto_save"),
				radio_name: "radio_auto_save",
				type: "radio",
				options: [
					{
						title: my.l("settings","off"),
						value: -1
					},
					{
						title: my.l("settings","every_30_seconds"),
						value: 30
					},
					{
						title: my.l("settings","every_60_seconds"),
						value: 60
					},
					{
						title: my.l("settings","every_5_minutes"),
						value: 300
					},
					{
						title: my.l("settings","every_10_minutes"),
						value: 600
					}
				],
				default_option: 2
			},
			{
				
				title: my.l("settings","global_language_of_metadata"),
				type: "select",
				name: "metadata_language",
				id: "metadata_language_select"
			},
			{
				title: my.l("settings","cmdi_metadata_creator"),
				description: my.l("settings","cmdi_metadata_creator_description"),
				type: "text",
				name: "metadata_creator",
				id: "metadata_creator",
				value: "CMDI Maker User"
			},
			{
				title: my.l("settings","save_project"),
				description: my.l("settings", "save_project_description"),
				type: "link",
				onclick: function () { my.save_and_recall.saveAllToFile(); }
			},
			{
				title: my.l("settings","load_project"),
				description: my.l("settings","load_project_description"),
				type: "file",
				file_input_id: "project_file_input",
				file_input_name: "project_file_input",
				onchange: my.save_and_recall.handleProjectFileInputChange
			},
			{
				title: my.l("settings","delete_recall_data"),
				type: "link",
				description: my.l("settings","delete_recall_data_description"),
				onclick: function() {my.save_and_recall.deleteEnvironmentData();}
			},
			{
				title: my.l("settings","hard_reset"),
				importance: "high",
				description: my.l("settings","hard_reset_description"),
				onclick: function() {    

					alertify.set({ labels: {
						ok     : my.l("confirm","no"),
						cancel : my.l("confirm","yes_delete_everything")
					} });

					alertify.confirm(my.l("confirm","hard_reset"), function (e) {

						if (e) {
							// user clicked "ok"
						}
				
						else {
							// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button=
							my.hard_reset();
						}
					});

				}
			}
		];
	};
	
	
	my.init = function (no_recall) {
		var recall_object;
		
		my.active_language = my.languages[0];
		
		if (!no_recall){
			recall_object = my.save_and_recall.getRecallDataForApp();
			
			if (recall_object && recall_object.settings.active_language_id){
				my.active_language = my.getLPFromID(recall_object.settings.active_language_id);
			}
		}
		
		my.checkIfFirstStart();
		g("version_span").innerHTML = APP.CONF.version;
		my.sayHello();
		g("settings_heading").innerHTML = my.l("settings","settings");
		my.initSettings(my.settings(), g("core_settings"));
		my.displayMetadataLanguages();
		my.displayLanguages();
		my.environments.displayAllInSelect();
		my.addEventListeners();
		
		if ((!no_recall) && (typeof recall_object != "undefined")){
			my.recall(recall_object);
		}
		
	};

	
	my.displayMetadataLanguages = function (){
	
		var select = g("metadata_language_select");
		
		dom.removeOptions(select);

		for (var j=0;j<APP.CONF.MetadataLanguageIDs.length;j++){

			var NewOption = new Option(APP.CONF.MetadataLanguageIDs[j][1], APP.CONF.MetadataLanguageIDs[j][0], false, true);
			select.options[select.options.length] = NewOption;
		}
	  
		select.selectedIndex = 0;

	};
	
	
	my.displayLanguages = function (){
		
		var select = g("language_select");
		
		dom.removeOptions(select);
	
		for (var j=0;j<my.languages.length;j++){

			var NewOption = new Option(my.languages[j].name, my.languages[j].id, false, true);
			select.options[select.options.length] = NewOption;
		}
	  
		select.selectedIndex = 0;

	};
	
	
	my.displayEnvironments = function (){
		
		var select = g("profile_select");
		var start_select = g("start_profile_select");
		
		dom.setSelectOptions(select, my.environments, true);
		dom.setSelectOptions(start_select, my.environments, false);
		
		start_select.addEventListener("change", function(){my.changeEnvironment(start_select.selectedIndex);});
		
	};


	my.checkIfFirstStart = function (){

		var first_start = localStorage.getItem("first_start");
		
		if (first_start === null){  //if there's no data, assume it's the first start
			first_start = true;
		}
		
		
		if (first_start === true){

			localStorage.setItem("first_start", false);
			console.log("First start! Hey there and welcome to CMDI Maker!");
		
		}
		
		else {
		
			alertify.log(my.l("welcome_back"), "", 5000);
		
		}

	};
	
	
	my.alert = function(message) {
	
		alertify.set({ labels: {
			ok     : my.l("ok")
		} });
		
		alertify.alert(message);
	
	};


	my.sayHello = function (){

		var index = Math.floor(Math.random() * APP.CONF.hellos.length);

		g("hello").innerHTML = APP.CONF.hellos[index][0];
		
		g("hello").addEventListener("click", function () {
			alertify.log(my.l("this_is","before") + APP.CONF.hellos[index][1] + my.l("this_is","after"));
		});

		g("greeting_text").innerHTML = my.l("start","greeting_text");
		
		g("start_select_profile_span").innerHTML = my.l("start","select_your_profile");
		
		g("link_lets_go").innerHTML = my.l("start","lets_go");
		g("supported_by_label").innerHTML = my.l("start","is_supported_by");
		g("need_help_label").innerHTML = my.l("start","need_help");
		g("help_pages_description").innerHTML = my.l("start","help_pages_description");
	};
	
	
	my.hard_reset = function(){

		my.save_and_recall.deleteAllData();
		location.reload();

	};


	my.saveAllOutputFiles = function(){
	
		var textareas = document.getElementsByClassName(APP.CONF.xml_textarea_class_name);
		
		forEach(textareas, function(textarea){
		
			my.save_file(textarea.value, textarea.filename);
			
		});
	
	};
	
	
	my.initFunctions = function(functions){
	
		var functions_div = g("functions");
		var function_div;
	
		for (var f=0; f<functions.length; f++){
		
			if (functions[f].type != "function_wrap"){
				function_div = dom.newElement("div", functions[f].id, "function_icon",functions_div);
				dom.img(function_div,"","function_img", APP.CONF.path_to_icons + functions[f].icon);
				var label = dom.h3(function_div, functions[f].label);
				
				if (functions[f].label_span_id){
					dom.newElement("span", functions[f].label_span_id, "", label);
				}
				
				else if (functions[f].label) {  //if label is there
					label.innerHTML = functions[f].label;
				}
				
				function_div.addEventListener('click', functions[f].onclick);

			}

			else {
			
				var function_wrap = dom.div(functions_div,functions[f].wrapper_id,"function_wrap");
				
				function_div = dom.div(function_wrap, functions[f].id, "function_icon");
				dom.img(function_div,"","function_img", APP.CONF.path_to_icons + functions[f].icon);
				dom.h3(function_div, functions[f].label);
				
				function_div.addEventListener('click', functions[f].onclick);

				var sub_div = dom.newElement("div",functions[f].sub_div,"",function_wrap);
				
				if (functions[f].sub_div_innerHTML){
					sub_div.innerHTML = functions[f].sub_div_innerHTML;
				}
				
				
				//this cannot be done with css
				function_div.addEventListener('mousedown', function(elem) {
					return function(){
						elem.style.backgroundColor = "black";
					};
				}(function_div));
				
				function_div.addEventListener('mouseup', function(elem) {
					return function(){
						elem.style.backgroundColor = "";
					};
				}(function_div));
			
			}
			
			if (functions[f].after_that){
				functions[f].after_that();
			}
		
		}
	};

	
	my.view = function (module_or_id){
		var module;
		var id;
	
		dom.closeSelectFrame();
	
		if (typeof module_or_id === 'string') {
			
			id = module_or_id;
			module = my.environments.getModuleByViewID(id);
			
		}
		
		else { //if argument is a module
			module = module_or_id;
			id = APP.CONF.view_id_prefix + module.identity.id;
		
		}
		
		if (id == "default"){
			id = "VIEW_start";
		}
		
		var views = g(APP.CONF.content_wrapper_id).children;
		var view_ids = [];
		
		//make all views invisible
		forEach(views, function(view){
			view.style.display = "none";
			view_ids.push(view.id);
		});
		
		//check if view exists, if not, throw error
		if (view_ids.indexOf(id) == -1){
			console.log("Error: Unkown view requested (" + id +")!");
			my.view("default");
			return;
		}			

		my.active_view = id;

		my.highlightViewIcon(id);
		
		g("module_icons").style.display = "block";
		
		dom.showFunctionsForView(module);
		
		//make the selected view visible
		g(id).style.display = "block";
		
		//if a module view is selected, call the view method of the module
		//every module can have a view method for things to be done, before viewing the page
		if (module && module.view){
			module.view();
		}
	
	};
	
	
	my.highlightViewIcon = function (id) {
		
		if (typeof my.environments.active_environment != "undefined"){
		
			//Unhighlight all workflow icons
			forEach(my.environments.active_environment.workflow, function(workflow){
				g(APP.CONF.viewlink_id_prefix + workflow.identity.id).style.backgroundColor = "";
			});
		}

		//Unhighlight APP VIEWLINKS
		forEach(my.views, function(view){
			g(APP.CONF.viewlink_id_prefix + view.id).style.backgroundColor = "";
		});
		
		var module = my.environments.getModuleByViewID(id);
		
		if (module){
			g(APP.CONF.viewlink_id_prefix + module.identity.id).style.backgroundColor = APP.CONF.highlight_color;
		}
		
		else {
			id = id.substr(APP.CONF.view_id_prefix.length);
			g(APP.CONF.viewlink_id_prefix+id).style.backgroundColor = APP.CONF.highlight_color;
		}

	};
	
	
	my.save = function(){
	
		my.save_and_recall.save();
	
	};
	
	
	my.save_file = function (text, filename, mime_type){

		var clean_filename = remove_invalid_chars(filename);
		
		if (!mime_type){
			mime_type = APP.CONF.file_download_header;
		}

		var blob = new Blob([text], {type: mime_type});
		saveAs(blob, clean_filename);

	};
	
	
	my.initSettings = function (settings, parent){
		var input;
		var h2;
		
		parent.innerHTML = "";
		
		for (var s=0; s<settings.length; s++){
		
			h2 = dom.h2(parent);	
			
			if ((settings[s].importance) && (settings[s].importance == "high")){
				h2.style.color = "red";
			}
			
			if (settings[s].onclick){
	
				var a = dom.a(h2,"","","#",settings[s].title, settings[s].onclick);
				
				if ((settings[s].importance) && (settings[s].importance == "high")){
					a.style.color = "red";
				}

			}
			
			else {
			
				h2.innerHTML = settings[s].title;
			
			}
			
			if (settings[s].description){
				dom.newElement("p","","",parent,settings[s].description);
			}

			if (settings[s].type == "radio"){
			
				for (var r=0; r<settings[s].options.length; r++){
				
					input = dom.input(parent,"","",settings[s].radio_name, "radio", settings[s].options[r].value);
					
					dom.span(parent,"","",settings[s].options[r].title);
					dom.br(parent);	
					
					if (r == settings[s].default_option) {
						input.checked = true;
					}
				}	
			
			}
			
			if (settings[s].type == "select"){
			
				var select = dom.newElement("select",settings[s].id,"",parent);
				select.size = 1;
				select.name = settings[s].name;
				
				if (settings[s].onchange){
					select.addEventListener("change", settings[s].onchange, false);
				}
				
				dom.br(parent);
			
			}
			
			if (settings[s].type == "switch"){
			
				input = dom.input(parent,settings[s].id,"on_off_switch",settings[s].name, "button", "Off");
				input.on = false;
				input.addEventListener("click", function(){dom.onOffSwitch(this);}, false);
				
				dom.setOnOffSwitchValue(g(settings[s].id),settings[s].default_value);
				
				dom.br(parent);
			
			}
			
			if (settings[s].type == "file"){
		
				input = dom.input(parent,settings[s].file_input_id,"",settings[s].file_input_name,"file");
				input.addEventListener('change', settings[s].onchange, false);
				dom.br(parent);
			}
			
			if (settings[s].type == "text"){
		
				input = dom.input(parent,settings[s].id,"",settings[s].name, "text", settings[s].value);
				input.addEventListener('change', settings[s].onchange, false);
				dom.br(parent);
			}
			
			if (settings[s].type == "empty"){
				
				dom.newElement("div",settings[s].id,"",parent);
		
			}
			
			dom.br(parent);
			
		}
	
	};
	
	
	my.addEventListeners = function(){
	
		g('link_lets_go').addEventListener('click', function() {
		
			if (typeof my.environments.active_environment == "undefined"){
				my.environments.create(my.environments.get(0));	
			}
			
			if (my.environments.active_environment.workflow[0]){
				my.view(my.environments.active_environment.workflow[0]);
			}
			
			else {
			
				my.alert(my.l("error","no_workflow"));
			}
			
		});
		
		for (var v=0; v<my.views.length; v++){
			g(APP.CONF.viewlink_id_prefix + my.views[v].id).addEventListener('click', function(num) {
				return function(){
					my.view(APP.CONF.view_id_prefix + num);
				};
			}(my.views[v].id));
		}
		
		g("LINK_save_form").addEventListener("click", function(){ my.save_and_recall.userSave(); });
		
		document.getElementsByName("radio_auto_save").selectedIndex = 3;
		
		for (var r=0; r<document.getElementsByName("radio_auto_save").length; r++){
		
			var radio = document.getElementsByName("radio_auto_save")[r];
		
			radio.addEventListener( "click", function(num) {
				return function(){
					save_and_recall.setAutosaveInterval(num);
				};
			}(radio.value));
		}
		
	};
	
	
	my.recall = function(recall_object, environment_data){
	//environment_data is an optional parameter, if it is not specified, the function tries to get the
	//environment_data from local storage

		console.log("Filling the form with recalled data");
		
		g("metadata_language_select").selectedIndex = recall_object.settings.metadata_language;
		g("metadata_creator").value = recall_object.settings.metadata_creator;
		
		if (recall_object.settings.active_language_id){
		
			var index = my.getIndexFromLPID(recall_object.settings.active_language_id);
		
			my.active_language = my.getLPFromID(recall_object.settings.active_language_id);
			g("language_select").selectedIndex = index;
			
		}		

		my.save_and_recall.setAutosaveInterval(recall_object.settings.save_interval_time);
		
		if (recall_object.active_environment_id){
		
			var environment = my.environments.getByID(recall_object.active_environment_id);
			my.environments.create(environment);
			
			if (typeof environment_data == "undefined"){
				environment_data = my.save_and_recall.getRecallDataForEnvironment(environment);
			}
			
			if (typeof environment_data != "undefined"){
				my.save_and_recall.recallEnvironmentData(environment_data);
			}
			
			g("profile_select").selectedIndex = my.environments.getByID(recall_object.active_environment_id) + 1;
		
		}
		
		my.view(recall_object.active_view);
		g(APP.CONF.content_wrapper_id).scrollTop = recall_object.scroll_top;
		
	};
	
	
	my.changeLanguage = function(index){
		
		my.active_language = my.languages[index];
		my.save();
		location.reload();
	
	};
	
	
	return my;
	
})();
