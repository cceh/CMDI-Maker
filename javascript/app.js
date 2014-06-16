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

	var my = {};
	
	my.active_view;
	my.active_environment;
	
	my.environments = [imdi_environment];
	
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
	
	
	my.init = function (){
	
		my.checkIfFirstStart();
		g("version_span").innerHTML = version;
		my.sayHello();
		my.displayMetadataLanguages();
		my.addEventListeners(); 
		
		save_and_recall.getRecallDataForApp();
	}

	
	my.makeInput = function (parent, field, element_id_prefix, element_class_prefix, session_object){

		switch (field.type){
			
			case "text": {
			
				var input = dom.makeTextInput(parent, field.heading,
					element_id_prefix+field.name,
					element_id_prefix+field.name,
					(session_object && session_object[field.name] ? session_object[field.name] : ""),
					field.comment
				);
				
				break;
			}
			
			case "date": {
			
				var input = dom.makeDateInput(parent, field.heading,
					element_id_prefix+field.name,
					element_id_prefix+field.name,
					(session_object && session_object[field.name] ? session_object[field.name]["year"] : ""),
					(session_object && session_object[field.name] ? session_object[field.name]["month"] : ""),				
					(session_object && session_object[field.name] ? session_object[field.name]["day"] : ""),					
					field.comment
				);
				
				break;
			}
			
			case "textarea": {
			
				var input = dom.makeTextarea(
					form_textarea_rows,
					form_textarea_columns,
					parent,
					field.heading,
					element_id_prefix+field.name,
					element_id_prefix+field.name,
					element_id_prefix+field.name,
					(session_object && session_object[field.name] ? session_object[field.name] : ""),
					field.comment
				);
				break;
			}			
			
			case "subarea": {
			
				var h3 = document.createElement("h3");
				h3.innerHTML = field.heading;
				parent.title = field.comment;
				parent.appendChild(h3);
				
				if (field.fields){
				
					element_id_prefix += field.name + "_";
			
					for (var f=0; f<field.fields.length; f++){
					
						my.makeInput(parent, field.fields[f], element_id_prefix, element_class_prefix, session_object[field.name]);
				
					}
				
				}
				
				break;
			}
			
			case "column": {
			
				if (field.name != ""){
				
					var td_name = field.name+"_td";
				
				}
				
				else {
				
					var td_name = "td";
				
				}
			
				var td = dom.newElement("td",element_id_prefix+td_name,element_class_prefix+td_name,parent);
				var h2 = dom.newElement("h2","","",td,field.title);
				
				if (field.fields){
				
					if (field.name != ""){
				
						element_id_prefix += field.name + "_";
						
					}
				
					for (var f=0; f<field.fields.length; f++){
					
						my.makeInput(td, field.fields[f], element_id_prefix, element_class_prefix, (session_object ? session_object[field.name] : undefined));
				
					}
				
				}
				
				break;
			}
			
			case "form": {
			
				var table = dom.newElement("table",element_id_prefix+"table","session_table",parent);
				var tr = dom.newElement("tr","","",table);
				
				for (var f=0; f<field.fields.length; f++){
					
					my.makeInput(tr, field.fields[f], element_id_prefix, element_class_prefix, session_object);
				
				}
				
				break;
			}
			
			case "special": {
				APP.active_environment.specialInput(field, parent, element_id_prefix, element_class_prefix);
				break;
			
			}
			
			case "select": {
				var input = dom.makeSelect(
					parent, field.heading,
					element_id_prefix+field.name,
					element_id_prefix+field.name,
					field.size,
					field.vocabulary,
					(session_object && session_object[field.name] ? session_object[field.name] : ""),
					field.comment
				);
				break;
			}

			case "open_vocabulary": {
				var input = dom.openVocabulary(
					parent, field.heading,
					element_id_prefix+field.name,
					element_id_prefix+field.name,
					field.size,
					field.vocabulary,
					(session_object && session_object[field.name] ? session_object[field.name] : ""),
					field.comment
				);
				break;
			}
			
			case "check": {
				var input = dom.makeCheckbox(
					parent, field.heading,
					element_id_prefix+field.name,
					element_id_prefix+field.name,
					(session_object && session_object[field.name] ? session_object[field.name] : false),
					field.comment
				);
				break;
			}
			
		}

		if (field.onkeypress){
			input.onkeypress = field.onkeypress;
		}

	}


	my.displayMetadataLanguages = function (){

		for (var j=0;j<MetadataLanguageIDs.length;j++){

			NewOption = new Option(MetadataLanguageIDs[j][1], MetadataLanguageIDs[j][0], false, true);
			g("metadata_language_select").options[g("metadata_language_select").options.length] = NewOption;
		}
	  
		g("metadata_language_select").selectedIndex = 0;

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
		
			alertify.log("Welcome back!", "", 5000);
		
		}

	}


	my.sayHello = function (){


		var index = Math.floor(Math.random() * hellos.length);

		g("hello").innerHTML = hellos[index][0];
		
		g("hello").addEventListener("click", function () {
			alertify.log("This is " + hellos[index][1] + "!");
		});


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
	
	
	my.save_file = function (text, filename, mime_type){

		var clean_filename = remove_invalid_chars(filename);

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
	
		my.createEnvironmentSettings(environment.settings);
	
		my.createWorkflow(environment.workflow);
		
		my.view("default");
	
	}
	
	
	my.createEnvironmentSettings = function (settings){
	
		var environment_settings = g("environment_settings");
	
		for (var s=0; s<settings.length; s++){
		
			var h2 = dom.newElement("h2","","",environment_settings);	
			
			if (settings[s].onclick){
	
				var a = dom.newElement("a","","",h2,settings[s].title);
				a.href = "#";
				a.addEventListener("click", settings[s].onclick);

			}
			
			else {
			
				h2.innerHTML = settings[s].title;
			
			}
			
			if (settings[s].description){
				var description = dom.newElement("p","","",environment_settings,settings[s].description);
			}

			if (settings[s].type == "radio"){
			
				for (var r=0; r<settings[s].options.length; r++){
				
					var input = dom.newElement("input","","",environment_settings);
					input.type = "radio";
					input.name = settings[s].radio_name;
					
					dom.newElement("span","","",environment_settings,settings[s].options[r]);
					
					dom.newElement("br","","",environment_settings);	
					
					if (r == settings[s].default_option) {
						input.checked = true;
					};
				}	
			
			}
			
			if (settings[s].type == "file"){
		
				var input = dom.newElement("input",settings[s].file_input_id,"",environment_settings);
				input.type = "file";
				input.name = settings[s].file_input_name;
				dom.newElement("br","","",environment_settings);
				
				input.addEventListener('change', settings[s].onchange, false);
		
			}
			
			if (settings[s].type == "empty"){
				
				var div = dom.newElement("div",settings[s].id,"",environment_settings);
		
			}
			
			dom.newElement("br","","",environment_settings);
			
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
		
		document.getElementsByName("radio_auto_save")[0].addEventListener( "click", function() {    save_and_recall.set_autosave_interval(-1);     });
		document.getElementsByName("radio_auto_save")[1].addEventListener( "click", function() {    save_and_recall.set_autosave_interval(30);     });
		document.getElementsByName("radio_auto_save")[2].addEventListener( "click", function() {    save_and_recall.set_autosave_interval(60);     });	
		document.getElementsByName("radio_auto_save")[3].addEventListener( "click", function() {    save_and_recall.set_autosave_interval(300);     });
		document.getElementsByName("radio_auto_save")[4].addEventListener( "click", function() {    save_and_recall.set_autosave_interval(600);     });	
		
		g('link_delete_recall_data').addEventListener('click', function() {save_and_recall.deleteEnvironmentData();});
		g('link_hard_reset').addEventListener('click', function() {    

			alertify.set({ labels: {
				ok     : "No",
				cancel : "Yes, delete everything"
			} });

			alertify.confirm("Really?<br>You want to hard reset CMDI Maker? All your actors and stuff will be deleted!", function (e) {

				if (e) {
					// user clicked "ok"
				}
		
				else {
					// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button=
					APP.hard_reset();
				}
			});

		});	
		
		document.onkeydown = function(event) {
		
			if (event.keyCode == 16) {  //if shift is pressed
				if (resources.shift == false){
					resources.shift = true;
					console.log("shift on");
				}
			}
			
			if (event.keyCode == 27)  {   //escape pressed
			
				resources.deselectAllFiles();
			
			}
		
		};

		document.onkeyup = function(event) {
		
			if (event.keyCode == 16) {  //if shift is let go
				resources.shift = false;
				console.log("shift off");
			}
			
		};

	}
	
	return my;
	
})();
