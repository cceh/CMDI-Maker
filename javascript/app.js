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

"use strict";

var APP = (function () {

	var my = {};
	
	my.environments = [imdi_environment, elar_environment];
	my.languages = [LP_english, LP_german];
	
	my.getLPFromID = function(id){
	
		for (var l=0; l<my.languages.length; l++){
		
			if (id == my.languages[l].id){
				return my.languages[l];
			}
		
		}
		
		console.log("ERROR: No language object with id " + id + " found!");
		return undefined;
	
	}
	
	my.getIndexFromLPID = function(id){
	
		for (var l=0; l<my.languages.length; l++){
		
			if (id == my.languages[l].id){
				return l;
			}
		
		}
		
		console.log("ERROR: No language object with id " + id + " found!");
		return undefined;
	
	}
	
	my.active_view;
	my.active_environment;
	my.active_language;

	
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
	
		//if there is no word in this language, take the word in the first one
		
		if (arg3){
			if (my.active_language[arg1][arg2][arg3]){
				return my.active_language[arg1][arg2][arg3];
			}
			
			else {
				return my.languages[0][arg1][arg2][arg3];
			}
		}
		
		if (arg2){
			if (my.active_language[arg1][arg2]){
				return my.active_language[arg1][arg2];
			}
			
			else {
				return my.languages[0][arg1][arg2];
			}
		}
		
		if (my.active_language[arg1]){
			return my.active_language[arg1];
		}
		
		else {
			return my.languages[0][arg1];
		}
		
		return "";
	
	}
	
	
	my.settings = function(){
	
		return [
			{
				title: my.l("settings","program_language"),
				type: "select",
				name: "language_select",
				id: "language_select",
				onchange: function(){APP.changeLanguage(g("language_select").selectedIndex);}
			},
			{
				title: my.l("settings","profile"),
				type: "select",
				name: "profile_select",
				id: "profile_select",
				onchange: function(){APP.changeEnvironment(g("profile_select").selectedIndex-1);}
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
				onchange: function () {return;}  //TO DO!!!
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
						ok     : "No",
						cancel : "Yes, delete everything"
					} });

					alertify.confirm(my.l("confirm","hard_reset"), function (e) {

						if (e) {
							// user clicked "ok"
						}
				
						else {
							// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button=
							APP.hard_reset();
						}
					});

				}
			}
		];
	}
	
	
	my.init = function (){
		
		my.active_language = my.languages[0];
		
		var recall_object = save_and_recall.getRecallDataForApp();
		
		if (recall_object && recall_object.settings.active_language_id){
			my.active_language = my.getLPFromID(recall_object.settings.active_language_id);
		}
		
		my.checkIfFirstStart();
		g("version_span").innerHTML = version;
		my.sayHello();
		g("settings_heading").innerHTML = my.l("settings","settings");
		my.initSettings(my.settings(), g("core_settings"));
		my.displayMetadataLanguages();
		my.displayLanguages();
		my.displayEnvironments();
		my.addEventListeners();
		
		if (recall_object){
			my.recall(recall_object);
		}
		
	};

	
	my.displayMetadataLanguages = function (){
	
		var select = g("metadata_language_select");

		for (var j=0;j<MetadataLanguageIDs.length;j++){

			var NewOption = new Option(MetadataLanguageIDs[j][1], MetadataLanguageIDs[j][0], false, true);
			select.options[select.options.length] = NewOption;
		}
	  
		select.selectedIndex = 0;

	}
	
	
	my.displayLanguages = function (){
		
		var select = g("language_select");
	
		for (var j=0;j<my.languages.length;j++){

			var NewOption = new Option(my.languages[j].name, my.languages[j].id, false, true);
			select.options[select.options.length] = NewOption;
		}
	  
		select.selectedIndex = 0;

	}
	
	
	my.displayEnvironments = function (){
		
		var select = g("profile_select");
		
		var NewOption = new Option("", 0, false, true);
		select.options[select.options.length] = NewOption;
	
		for (var j=0;j<my.environments.length;j++){

			NewOption = new Option(my.environments[j].title, my.environments[j].id, false, true);
			select.options[select.options.length] = NewOption;
		}
	  
		select.selectedIndex = 0;

	}


	my.checkIfFirstStart = function (){

		var first_start = localStorage.getItem("first_start");
		
		if (first_start == null){  //if there's no data, assume it's the first start
			first_start = true;
		}
		
		
		if (first_start == true){

			localStorage.setItem("first_start", false);
			console.log("First start! Hey there and welcome to CMDI Maker!");
		
		}
		
		else {
		
			alertify.log(my.l("welcome_back"), "", 5000);
		
		}

	}


	my.sayHello = function (){


		var index = Math.floor(Math.random() * hellos.length);

		g("hello").innerHTML = hellos[index][0];
		
		g("hello").addEventListener("click", function () {
			alertify.log(my.l("this_is","before") + hellos[index][1] + my.l("this_is","after"));
		});

		g("greeting_text").innerHTML = my.l("greeting_text");
		g("link_lets_go").innerHTML = my.l("lets_go");
		g("supported_by_label").innerHTML = my.l("is_supported_by");
		g("need_help_label").innerHTML = my.l("need_help");
	}
	
	
	my.hard_reset = function(){

		save_and_recall.deleteAllData();
		localStorage.removeItem("first_start");
		location.reload();

	}


	my.fillObjectWithFormElement = function(object, element_id_prefix, form_element){
	//object = the object to be filled with form data
	//form_element = element of the form as specified in session_form

		if ((form_element.type == "text") || (form_element.type == "textarea") || (form_element.type == "select") || (form_element.type == "open_vocabulary")){

			object[form_element.name] = get(element_id_prefix+form_element.name);
			
		}
		
		if (form_element.type == "date"){
		
			object[form_element.name]["year"] = get(element_id_prefix+form_element.name+"_year");
			object[form_element.name]["month"] = get(element_id_prefix+form_element.name+"_month");
			object[form_element.name]["day"] = get(element_id_prefix+form_element.name+"_day");
		}
		
		if (form_element.type == "column"){
		
			element_id_prefix += form_element.name + "_";
			
			for (var f=0; f<form_element.fields.length; f++){
				
				my.fillObjectWithFormElement(object, element_id_prefix, form_element.fields[f]);
			
			}
		}
		
		if (form_element.type == "subarea"){
		
			element_id_prefix += form_element.name + "_";
			
			for (var f=0; f<form_element.fields.length; f++){
				
				my.fillObjectWithFormElement(object[form_element.name], element_id_prefix, form_element.fields[f]);
			
			}
		}
		
		if (form_element.type == "form"){
		
			for (var f=0; f<form_element.fields.length; f++){
				
				my.fillObjectWithFormElement(object[form_element.fields[f].name], element_id_prefix, form_element.fields[f]);
			
			}
		}
		
		if (form_element.type == "special"){
		
			return;
		
		}

	}
	
	
	my.saveAllOutputFiles = function(){
	
		var textareas = document.getElementsByClassName(xml_textarea_class_name);
		
		for (var t=0; t<textareas.length; t++){
		
			APP.save_file(textareas[t].value, textareas[t].filename);
			
		}
	
	}
	
	
	my.init_functions = function(functions){
	
		var functions_div = g("functions");
	
		for (var f=0; f<functions.length; f++){
		
			if (functions[f].type != "function_wrap"){
				var function_div = dom.newElement("div", functions[f].id, "function_icon",functions_div);
				var img = dom.newElement("img","","function_img", function_div);
				img.src = path_to_icons + functions[f].icon;
				var label = dom.newElement("h3","","", function_div, functions[f].label);
				
				if (functions[f].label_span_id){
					dom.newElement("span", functions[f].label_span_id, "", label);
				}
					
				else if (functions[f].label) {  //if label is there
					label.innerHTML = functions[f].label;
				}
				
				function_div.addEventListener('click', functions[f].onclick);

			}

			else {
			
				var function_wrap = dom.newElement("div",functions[f].wrapper_id,"function_wrap",functions_div);
				
				var function_div = dom.newElement("div", functions[f].id, "function_icon",function_wrap);
				var img = dom.newElement("img","","function_img", function_div);
				img.src = path_to_icons + functions[f].icon;
				dom.newElement("h3","","", function_div, functions[f].label);
				
				function_div.addEventListener('click', functions[f].onclick);

				var sub_div = dom.newElement("div",functions[f].sub_div,"",function_wrap);
				
				if (functions[f].sub_div_innerHTML){
					sub_div.innerHTML = functions[f].sub_div_innerHTML;
				}
				
				
				//this cannot be done with css
				function_div.addEventListener('mousedown', function(elem) {
					return function(){
						elem.style.backgroundColor = "black";
					}
				}(function_div));
				
				function_div.addEventListener('mouseup', function(elem) {
					return function(){
						elem.style.backgroundColor = "";
					}
				}(function_div));
			
			}
			
			if (functions[f].after_that){
				functions[f].after_that();
			}
		
		}
	}

	
	my.reset_form = function (){
		
		APP.active_environment.reset();

	}
	
	
	my.getModuleOfViewID = function(id){
		
		if (typeof my.active_environment != "undefined"){
		
			//find the module for this id
			for (var m=0; m<my.active_environment.workflow.length; m++){

				if ((view_id_prefix + my.active_environment.workflow[m].identity.id) == id){
					return my.active_environment.workflow[m];
				}
			
			}
		}
		
		return undefined;
	
	}


	my.view = function (module_or_id){
	
		dom.closeSelectFrame();
	
		if (typeof module_or_id === 'string') {
			
			var id = module_or_id;
			var module = my.getModuleOfViewID(id);
			
		}
		
		else { //if argument is a module
			
			var module = module_or_id;
			var id = view_id_prefix + module.identity.id;
		
		}
		
		if (id == "default"){
			id = "VIEW_start";
		}
		
		var views = g("content_wrapper").children;
		var view_ids = [];
		
		//make all views invisible
		for (var v=0; v<views.length; v++){
			views[v].style.display = "none";
			view_ids.push(views[v].id);
		}		
		
		//check if view exists, if not, throw error
		if (view_ids.indexOf(id) == -1){
			console.log("Error: Unkown view requested (" + id +")!");
			my.view("default");
			return;
		}			

		my.active_view = id;

		my.highlightViewIcon(id);
		
		g("module_icons").style.display = "block";
		
		my.showFunctionsForView(module);

		
		//make the selected view visible
		g(id).style.display = "block";
		
		//if a module view is selected, call the view method of the module
		//every module can have a view method for things to be done, before viewing the page
		if (module && module.view){
			module.view();
		}
	
	}
	
	
	my.highlightViewIcon = function (id) {
		
		if (typeof my.active_environment != "undefined"){
		
			//Unhighlight all workflow icons
			for (var w=0; w<my.active_environment.workflow.length; w++){
				g(viewlink_id_prefix + my.active_environment.workflow[w].identity.id).style.backgroundColor = "";
			}
		}

		//Unhighlight APP VIEWLINKS
		for (var v=0; v<my.views.length; v++){
			g(viewlink_id_prefix + my.views[v].id).style.backgroundColor = "";
		}
		
		var module = my.getModuleOfViewID(id);
		
		if (module){
			g(viewlink_id_prefix + module.identity.id).style.backgroundColor = highlight_color;
		}
		
		else {
			id = id.substr(view_id_prefix.length);
			g(viewlink_id_prefix+id).style.backgroundColor = highlight_color;
		}

	}
	
	
	my.makeAllFunctionsInvisible = function(){
	
		//make all functions invisible
		var functions = g("functions").children;
		for (var f=0; f<functions.length; f++){
			functions[f].style.display = "none";
		}		
	
	}
	
	
	my.showFunctionsForView = function (module){

		my.makeAllFunctionsInvisible();
		
		//If this view is not from a module, it wont have functions
		if (!module){
			return;
		}

		//if this module has functions, make them visible
		if (module.functions){
			//make functions visible
			for (var f=0; f < module.functions.length; f++){
				var func = module.functions[f];
			
				if (func.type == "function_wrap"){
					g(module.functions[f].wrapper_id).style.display = "inline";
				}
				
				else {
					g(module.functions[f].id).style.display = "inline";
				}
			}	
		}

	}
	
	
	my.save = function(){
	
		save_and_recall.save();
	
	}
	
	
	my.save_file = function (text, filename, mime_type){

		var clean_filename = remove_invalid_chars(filename);
		
		if (!mime_type){
			var mime_type = file_download_header;
		}

		var blob = new Blob([text], {type: mime_type});
		saveAs(blob, clean_filename);

	}
	
	
	my.unloadActiveEnvironment = function (){
	
		console.log("Unloading active environment: " + my.active_environment.id);
	
		save_and_recall.save();
		
		g("environment_settings").innerHTML = "";
	
		for (var e=0; e<my.active_environment.workflow.length; e++){
		
			var module = my.active_environment.workflow[e];
			
			//delete module view
			dom.remove(view_id_prefix+module.identity.id);
			
		}
		
		g("functions").innerHTML = "";
	
		g("module_icons").innerHTML = "";
		
		my.active_environment = undefined;
		
		my.view("VIEW_start");
	
	}
	
	
	my.createEnvironment = function (environment){
	
		//Variable has to be set first, because later methods depend on it
		my.active_environment = environment;	
		
		console.log("Creating environment: " + environment.id);
	
		my.initEnvironmentSettings(environment.settings);
	
		my.createWorkflow(environment.workflow);
		
		/*g("profile_select").selectedIndex = */ //TO DO!!
		
		my.view("default");
	
	}
	
	
	my.initEnvironmentSettings = function (settings){
	
		my.initSettings(settings, g("environment_settings"));
	
	}
	
	
	my.initSettings = function (settings, parent){
	
		for (var s=0; s<settings.length; s++){
		
			var h2 = dom.newElement("h2","","",parent);	
			
			if ((settings[s].importance) && (settings[s].importance == "high")){
				h2.style.color = "red";
			}
			
			if (settings[s].onclick){
	
				var a = dom.newElement("a","","",h2,settings[s].title);
				a.href = "#";
				a.addEventListener("click", settings[s].onclick);
				
				if ((settings[s].importance) && (settings[s].importance == "high")){
					a.style.color = "red";
				}

			}
			
			else {
			
				h2.innerHTML = settings[s].title;
			
			}
			
			if (settings[s].description){
				var description = dom.newElement("p","","",parent,settings[s].description);
			}

			if (settings[s].type == "radio"){
			
				for (var r=0; r<settings[s].options.length; r++){
				
					var input = dom.newElement("input","","",parent);
					input.type = "radio";
					input.name = settings[s].radio_name;
					input.value = settings[s].options[r].value
					
					dom.newElement("span","","",parent,settings[s].options[r].title);
					
					dom.newElement("br","","",parent);	
					
					if (r == settings[s].default_option) {
						input.checked = true;
					};
				}	
			
			}
			
			if (settings[s].type == "select"){
			
				var select = dom.newElement("select",settings[s].id,"",parent);
				select.size = 1;
				select.name = settings[s].name;
				
				if (settings[s].onchange){
					select.addEventListener("change", settings[s].onchange, false);
				}
				
				dom.newElement("br","","",parent);
			
			}
			
			if (settings[s].type == "file"){
		
				var input = dom.newElement("input",settings[s].file_input_id,"",parent);
				input.type = "file";
				input.name = settings[s].file_input_name;
				dom.newElement("br","","",parent);
				
				input.addEventListener('change', settings[s].onchange, false);
		
			}
			
			if (settings[s].type == "text"){
		
				var input = dom.newElement("input",settings[s].id,"",parent);
				input.type = "text";
				input.name = settings[s].name;
				input.value = settings[s].value;				
				dom.newElement("br","","",parent);
				
				input.addEventListener('change', settings[s].onchange, false);
		
			}
			
			if (settings[s].type == "empty"){
				
				var div = dom.newElement("div",settings[s].id,"",parent);
		
			}
			
			dom.newElement("br","","",parent);
			
		}
	
	
	}
	
	
	my.createWorkflow = function(workflow){
	
		for (var e=0; e<workflow.length; e++){
		
			var module = workflow[e];
			
			//create a view for the module
			dom.newElement("div",view_id_prefix+module.identity.id,"content",g("content_wrapper"));
			
			//initialize functions for the interface
			if (module.functions){
				my.init_functions(module.functions);
			}

			if (module.init){
				module.init();
			}
		}
	
		my.createWorkflowDisplay(workflow);
	
	}
	
	
	my.createWorkflowDisplay = function (workflow){
	
		var div = g("module_icons");
	
		for (var w=0; w<workflow.length; w++){
		
			if (w!=0){
			
				var arrow = dom.newElement("div","","wizard_arrow",div);
				var image = dom.newElement("img","","wizard_icon",arrow);
				image.src = path_to_icons + "right2.png";
			
			}
			
			var icon = dom.newElement("div",viewlink_id_prefix + workflow[w].identity.id,"icon_div",div);
			var image = dom.newElement("img","","module_icon",icon);
			image.src = path_to_icons + workflow[w].identity.icon;

			dom.newElement("br","","",icon);
			dom.newElement("span","","",icon,workflow[w].identity.title);
			
			icon.addEventListener('click', function(num) {
				return function(){
					APP.view(num);
				}
			}(workflow[w]));
		}
	
	}
	
	
	my.getEnvironmentFromID = function(id){
	
		for (var e=0; e<APP.environments.length; e++){
			
			if (APP.environments[e].id == id){
				return APP.environments[e];
			}
			
		}
		
		return undefined;
	
	}

	
	my.addEventListeners = function(){
	
		g('link_lets_go').addEventListener('click', function() {
			if (typeof my.active_environment != "undefined"){
		
				APP.view(corpus);
			}

			else {
			
				my.createEnvironment(imdi_environment);
				APP.view(corpus);
			}
			
		});
		
		for (var v=0; v<my.views.length; v++){
			g(viewlink_id_prefix + my.views[v].id).addEventListener('click', function(num) {
				return function(){
					APP.view(view_id_prefix + num);
				}
			}(my.views[v].id));
		}
		
		g("LINK_save_form").addEventListener("click", function(){ save_and_recall.userSave(); });
		
		document.getElementsByName("radio_auto_save").selectedIndex = 3;
		
		for (var r=0; r<document.getElementsByName("radio_auto_save").length; r++){
		
			var radio = document.getElementsByName("radio_auto_save")[r];
		
			radio.addEventListener( "click", function(num) {
				return function(){
					save_and_recall.set_autosave_interval(num);
				}
			}(radio.value));
		}
		
	};
	
	
	my.changeEnvironment = function(index){

		save_and_recall.save();
		
		if (typeof APP.active_environment != "undefined"){
			APP.unloadActiveEnvironment();
		}
		
		dom.scrollTop();
		
		if (index == -1){
			return;
		}
		
		APP.createEnvironment(APP.environments[index]);
	
	}
	
	
	my.recall = function(recall_object){

		console.log("Filling the form with recalled data");
		
		g("metadata_language_select").selectedIndex = recall_object.settings.metadata_language;
		g("metadata_creator").value = recall_object.settings.metadata_creator;
		
		if (recall_object.settings.active_language_id){
		
			var index = APP.getIndexFromLPID(recall_object.settings.active_language_id);
		
			APP.active_language = APP.getLPFromID(recall_object.settings.active_language_id);
			g("language_select").selectedIndex = index;
			
		}		

		save_and_recall.set_autosave_interval(recall_object.settings.save_interval_time);
		
		if (recall_object.active_environment_id){
		
			var environment = APP.getEnvironmentFromID(recall_object.active_environment_id);
			APP.createEnvironment(environment);
			save_and_recall.getRecallDataForEnvironment(environment);
			
			g("profile_select").selectedIndex = APP.getEnvironmentIndexFromID(recall_object.active_environment_id) + 1;
		
		}
		
		APP.view(recall_object.active_view);
	}
	
	
	my.getEnvironmentIndexFromID = function(id){
	
		for (var e=0; e<my.environments.length; e++){
		
			if (my.environments[e].id == id){
				return e;
			}
		
		}
	
		console.log("ERROR: Unknown environment id: " + id);
		return undefined;
	
	}
	
	
	my.changeLanguage = function(index){
		
		my.active_language = my.languages[index];
		save_and_recall.save();
		location.reload();
	
	}
	
	
	return my;
	
})();
