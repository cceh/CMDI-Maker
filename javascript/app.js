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
	
	my.environments = [imdi_environment, eldp_environment];
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
	my.active_environment = undefined;
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
	
	
	my.getActiveLanguageFromID = function(id, LanguagesArray){
	
		for (var l=0; l<LanguagesArray.length; l++){
			if (LanguagesArray[l].id == id){
				return LanguagesArray[l];
			}
		}
	
		return undefined;
	
	};
	
	
	my.getTermInActiveLanguage = function(LanguagesArray, arg1, arg2, arg3){
	
		//Look in the LanguagesArray, that's been given by the APP or by one environment and then search for the language that has the id of the APP's active language
		var active_language = my.getActiveLanguageFromID(my.active_language.id, LanguagesArray);
	

		//if there is no word in this language, take the word in the first one
	
		if (arg3){

			if (active_language[arg1][arg2][arg3]){
				return active_language[arg1][arg2][arg3];
			}
			
			else {
				return LanguagesArray[0][arg1][arg2][arg3];
			}
		}
		
		if (arg2){

			if (active_language[arg1][arg2]){
				return active_language[arg1][arg2];
			}
			
			else {
				return LanguagesArray[0][arg1][arg2];
			}
		}
		
		if (active_language[arg1]){
			return active_language[arg1];
		}
		
		else {
			return LanguagesArray[0][arg1];
		}
		
		return "";		
	
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
				onchange: function(){my.changeEnvironment(g("profile_select").selectedIndex-1);}
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
				description: my.l("save_project_description"),
				type: "link",
				onclick: function () { save_and_recall.saveAllToFile(); }
			},
			{
				title: my.l("settings","load_project"),
				description: my.l("settings","load_project_description"),
				type: "file",
				file_input_id: "project_file_input",
				file_input_name: "project_file_input",
				onchange: save_and_recall.handleProjectFileInputChange
			},
			{
				title: my.l("settings","delete_recall_data"),
				type: "link",
				description: my.l("settings","delete_recall_data_description"),
				onclick: function() {save_and_recall.deleteEnvironmentData();}
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
			recall_object = save_and_recall.getRecallDataForApp();
			
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
		my.displayEnvironments();
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
		
		dom.removeOptions(select);
		
		var NewOption = new Option("", 0, false, true);
		select.options[select.options.length] = NewOption;
	
		for (var j=0;j<my.environments.length;j++){

			NewOption = new Option(my.environments[j].title, my.environments[j].id, false, true);
			select.options[select.options.length] = NewOption;
		}
	
		select.selectedIndex = 0;

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


	my.sayHello = function (){


		var index = Math.floor(Math.random() * APP.CONF.hellos.length);

		g("hello").innerHTML = APP.CONF.hellos[index][0];
		
		g("hello").addEventListener("click", function () {
			alertify.log(my.l("this_is","before") + APP.CONF.hellos[index][1] + my.l("this_is","after"));
		});

		g("greeting_text").innerHTML = my.l("greeting_text");
		g("link_lets_go").innerHTML = my.l("lets_go");
		g("supported_by_label").innerHTML = my.l("is_supported_by");
		g("need_help_label").innerHTML = my.l("need_help");
		g("help_pages_description").innerHTML = my.l("help_pages_description");
	};
	
	
	my.hard_reset = function(){

		save_and_recall.deleteAllData();
		location.reload();

	};


	my.saveAllOutputFiles = function(){
	
		var textareas = document.getElementsByClassName(APP.CONF.xml_textarea_class_name);
		
		for (var t=0; t<textareas.length; t++){
		
			my.save_file(textareas[t].value, textareas[t].filename);
			
		}
	
	};
	
	
	my.init_functions = function(functions){
	
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

	
	my.reset_form = function (){
		
		if (my.active_environment.reset){
			my.active_environment.reset();
		}
		
		forEach(my.active_environment.workflow, function(module){
		
			if (typeof module.reset != "undefined"){
				module.reset();
			}
		
		});

	};
	
	
	my.getModuleOfViewID = function(id){
		
		if (typeof my.active_environment != "undefined"){
		
			//find the module for this id
			for (var m=0; m<my.active_environment.workflow.length; m++){

				if ((APP.CONF.view_id_prefix + my.active_environment.workflow[m].identity.id) == id){
					return my.active_environment.workflow[m];
				}
			
			}
		}
		
		return undefined;
	
	};


	my.view = function (module_or_id){
		var module;
		var id;
	
		dom.closeSelectFrame();
	
		if (typeof module_or_id === 'string') {
			
			id = module_or_id;
			module = my.getModuleOfViewID(id);
			
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
		
		if (typeof my.active_environment != "undefined"){
		
			//Unhighlight all workflow icons
			forEach(my.active_environment.workflow, function(workflow){
				g(APP.CONF.viewlink_id_prefix + workflow.identity.id).style.backgroundColor = "";
			});
		}

		//Unhighlight APP VIEWLINKS
		forEach(my.views, function(view){
			g(APP.CONF.viewlink_id_prefix + view.id).style.backgroundColor = "";
		});
		
		var module = my.getModuleOfViewID(id);
		
		if (module){
			g(APP.CONF.viewlink_id_prefix + module.identity.id).style.backgroundColor = APP.CONF.highlight_color;
		}
		
		else {
			id = id.substr(APP.CONF.view_id_prefix.length);
			g(APP.CONF.viewlink_id_prefix+id).style.backgroundColor = APP.CONF.highlight_color;
		}

	};
	
	
	my.save = function(){
	
		save_and_recall.save();
	
	};
	
	
	my.save_file = function (text, filename, mime_type){

		var clean_filename = remove_invalid_chars(filename);
		
		if (!mime_type){
			mime_type = APP.CONF.file_download_header;
		}

		var blob = new Blob([text], {type: mime_type});
		saveAs(blob, clean_filename);

	};
	
	
	my.unloadActiveEnvironment = function (){
	
		if (!APP.active_environment){
			console.log("WARNING: APP.unloadActiveEnvironment called although there is no environment loaded!");
			return;
		}
	
		console.log("Unloading active environment: " + my.active_environment.id);
	
		save_and_recall.save();
		
		g("environment_settings").innerHTML = "";
	
		forEach(my.active_environment.workflow, function (module){
		
			//delete module view
			dom.remove(APP.CONF.view_id_prefix+module.identity.id);
			
		});
		
		g("functions").innerHTML = "";
	
		g("module_icons").innerHTML = "";
		
		my.active_environment = undefined;
		
		g("profile_select").selectedIndex = 0;
		
		my.view("VIEW_start");
	
	};
	
	
	my.createEnvironment = function (environment){
	
		if (typeof my.active_environment != "undefined"){
		
			if (environment.id == my.active_environment.id){
				console.log("Environment to be created is already active: " + my.active_environment.id);
				return;
			}
			
			else {
				my.unloadActiveEnvironment();
			}
		}
	
		//Variable has to be set first, because later methods depend on it
		my.active_environment = environment;	
		
		console.log("Creating environment: " + environment.id);
	
		my.initEnvironmentSettings(environment.settings());
	
		my.createWorkflow(environment.workflow);
		
		g("profile_select").selectedIndex = getIndexOfEnvironment(environment) + 1;
		
		my.view("default");
	
	};
	
	
	var getIndexOfEnvironment = function(environment){
		
		for (var e=0; e<my.environments.length; e++){
		
			if (environment.id == my.environments[e].id){
				return e;
			}
		
		}
		
		return console.log("Environment " + environment.id + " not found in APP.environments");
	
	};
	
	
	my.initEnvironmentSettings = function (settings){
	
		my.initSettings(settings, g("environment_settings"));
	
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
	
	
	my.createWorkflow = function(workflow){
	
		for (var e=0; e<workflow.length; e++){
		
			var module = workflow[e];
			
			//create a view for the module
			dom.newElement("div",APP.CONF.view_id_prefix+module.identity.id,"content",g(APP.CONF.content_wrapper_id));
			
			//initialize functions for the interface
			if (module.functions){
				my.init_functions(module.functions);
			}

			if (module.init){
				module.init();
			}
		}
	
		my.createWorkflowDisplay(workflow);
	
	};
	
	
	my.createWorkflowDisplay = function (workflow){
	
		var div = g("module_icons");
	
		for (var w=0; w<workflow.length; w++){
		
			if (w !== 0){
			
				var arrow = dom.newElement("div","","wizard_arrow",div);
				dom.img(arrow,"","wizard_icon", APP.CONF.path_to_icons + "right2.png");
			
			}
			
			var icon = dom.newElement("div",APP.CONF.viewlink_id_prefix + workflow[w].identity.id,"icon_div",div);
			dom.img(icon, "", "module_icon", APP.CONF.path_to_icons + workflow[w].identity.icon);
			dom.br(icon);
			dom.span(icon,"","",workflow[w].identity.title);
			
			icon.addEventListener('click', function(num) {
				return function(){
					my.view(num);
				};
			}(workflow[w]));
		}
	
	};
	
	
	my.getEnvironmentFromID = function(id){
	
		for (var e=0; e<my.environments.length; e++){
			
			if (my.environments[e].id == id){
				return my.environments[e];
			}
			
		}
		
		return undefined;
	
	};

	
	my.addEventListeners = function(){
	
		g('link_lets_go').addEventListener('click', function() {
			if (typeof my.active_environment == "undefined"){
				my.createEnvironment(imdi_environment);	
			}
			
			if (my.active_environment.workflow[0]){
				my.view(my.active_environment.workflow[0]);
			}
			
			else {
				alertify.set({ labels: {
					ok     : my.l("ok")
				} });
				alertify.alert(my.l("error","no_workflow"));
			}
			
		});
		
		for (var v=0; v<my.views.length; v++){
			g(APP.CONF.viewlink_id_prefix + my.views[v].id).addEventListener('click', function(num) {
				return function(){
					my.view(APP.CONF.view_id_prefix + num);
				};
			}(my.views[v].id));
		}
		
		g("LINK_save_form").addEventListener("click", function(){ save_and_recall.userSave(); });
		
		document.getElementsByName("radio_auto_save").selectedIndex = 3;
		
		for (var r=0; r<document.getElementsByName("radio_auto_save").length; r++){
		
			var radio = document.getElementsByName("radio_auto_save")[r];
		
			radio.addEventListener( "click", function(num) {
				return function(){
					save_and_recall.set_autosave_interval(num);
				};
			}(radio.value));
		}
		
	};
	
	
	my.changeEnvironment = function(index){

		save_and_recall.save();
		
		if (typeof my.active_environment != "undefined"){
			my.unloadActiveEnvironment();
		}
		
		dom.scrollTop();
		
		if (index == -1){
			return;
		}
		
		my.createEnvironment(my.environments[index]);
	
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

		save_and_recall.set_autosave_interval(recall_object.settings.save_interval_time);
		
		if (recall_object.active_environment_id){
		
			var environment = my.getEnvironmentFromID(recall_object.active_environment_id);
			my.createEnvironment(environment);
			
			if (typeof environment_data == "undefined"){
				environment_data = save_and_recall.getRecallDataForEnvironment(environment);
			}
			
			if (typeof environment_data != "undefined"){
				save_and_recall.recallEnvironmentData(environment_data);
			}
			
			g("profile_select").selectedIndex = my.getEnvironmentIndexFromID(recall_object.active_environment_id) + 1;
		
		}
		
		my.view(recall_object.active_view);
		g(APP.CONF.content_wrapper_id).scrollTop = recall_object.scroll_top;
	};
	
	
	my.getEnvironmentIndexFromID = function(id){
	
		for (var e=0; e<my.environments.length; e++){
		
			if (my.environments[e].id == id){
				return e;
			}
		
		}
	
		console.log("ERROR: Unknown environment id: " + id);
		return undefined;
	
	};
	
	
	my.changeLanguage = function(index){
		
		my.active_language = my.languages[index];
		save_and_recall.save();
		location.reload();
	
	};
	
	
	return my;
	
})();
