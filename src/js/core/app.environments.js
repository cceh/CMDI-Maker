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


APP.environments = (function () {
	'use strict';
	
	//PRIVATE
	
	var getIndexOfEnvironment = function(environment){
	
		var index = getIndex(my.environments, "id", environment.id);
		
		if (typeof index == "undefined"){
			return console.log("Environment " + environment.id + " not found in APP.environments");
		}
		
		return index;
	
	};
	
	//PUBLIC

	var my = {};
	
	my.disabled_functions = [];
	
	//Environments can integrate themselves in this array to get noticed by CMDI Maker
	my.environments = [];
	
	my.active_environment = undefined;

	my.isAnEnvironmentLoaded = function(){
	
		if (typeof my.active_environment != "undefined"){
			return true;
		}
		
		else {
			return false;
		}
	
	};
	
	
	my.displayAllInSelect = function (){
		
		var select = g("profile_select");
		var start_select = g("start_profile_select");
		
		dom.setSelectOptions(select, my.environments, "title", "id", true);
		dom.setSelectOptions(start_select, my.environments, "title", "id", false);
		
		start_select.addEventListener("change", function(){my.change(start_select.selectedIndex);});
		
	};

	
	my.getModuleByViewID = function(id){
		
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
	
	
	my.resetActive = function(){
	
		if (!my.active_environment){
			return;
		}
	
		if (my.active_environment.reset){
			my.active_environment.reset();
		}
		
		forEach(my.active_environment.workflow, function(module){
		
			if (typeof module.reset != "undefined"){
				module.reset();
			}
		
		});
	
	};
	
	
	my.unloadActive = function (){
	
		if (!my.active_environment){
			console.warn("APP.environments.unloadActive called although there is no environment loaded!");
			return;
		}
	
		console.log("Unloading active environment: " + my.active_environment.id);
	
		APP.save();
		
		g("environment_settings").innerHTML = "";
	
		forEach(my.active_environment.workflow, function (module){
		
			//delete module view
			dom.remove(APP.CONF.view_id_prefix + module.identity.id);
			
		});
		
		g("functions").innerHTML = "";
	
		g("module_icons").innerHTML = "";
		
		my.active_environment = undefined;
		
		g("profile_select").selectedIndex = 0;
		
		APP.view("VIEW_start");
	
	};
	
	
	my.create = function (environment){
		
		if (typeof environment == "undefined"){
			console.warn("APP.environments.create: Environment parameter is undefined!");
			return;
		}
		
		if (typeof my.active_environment != "undefined"){
		
			if (environment.id == my.active_environment.id){
				console.log("Environment to be created is already active: " + my.active_environment.id);
				return;
			}
			
			else {
				my.unloadActive();
			}
		}
	
		//Variable has to be set first, because later methods depend on that
		my.active_environment = environment;	
		
		console.log("Creating environment: " + environment.id);
	
		my.initSettings(environment.settings());
		
		if (environment.init){
			environment.init();
		}
	
		my.createWorkflow(environment.workflow);
		
		var index = getIndexOfEnvironment(environment);
	
		g("profile_select").selectedIndex = index + 1;
		//+1 because the first option of profile select is an empty option
		
		g("start_profile_select").selectedIndex = index;
		
		APP.view("default");
	
	};
	
	
	my.initSettings = function (settings){
	
		APP.settings.init(settings, g("environment_settings"));
	
	};
	
	
	my.createWorkflow = function(workflow){
	
		forEach(workflow, my.createWorkflowModule);
	
		my.createWorkflowDisplay(workflow);
	
	};
	
	
	my.createWorkflowModule = function(module){
	
		//create a view for the module
		var view = dom.newElement("div",APP.CONF.view_id_prefix+module.identity.id,"content",g(APP.CONF.content_wrapper_id));
		
		//initialize functions for the interface
		if (module.functions){
		
			if (typeof module.functions == "function"){
				my.initFunctions(module.functions());
			}
			
			else {
				my.initFunctions(module.functions);
			}
			
		}
		
		if (module.init){
			module.init(view);
		}
	
	};
	
	
	my.createWorkflowDisplay = function (workflow){
	
		var div = g("module_icons");
	
		for (var w=0; w<workflow.length; w++){
		
			if (w !== 0){
			
				var arrow = dom.newElement("div","","wizard_arrow",div);
				APP.GUI.icon(arrow,"","wizard_icon", "right2");
			
			}
			
			var icon = dom.newElement("div",APP.CONF.viewlink_id_prefix + workflow[w].identity.id,"icon_div",div);
			APP.GUI.icon(icon, "", "module_icon", workflow[w].identity.icon);
			dom.br(icon);
			dom.span(icon,"","",workflow[w].identity.title);
			
			icon.addEventListener('click', function(num) {
				return function(){
					APP.view(num);
				};
			}(workflow[w]));
		}
	
	};
	
	
	my.getByID = function(id){
		
		return getObjectByID(my.environments, id);
	
	};
	
	
	my.get = function(index){
	
		return my.environments[index];
	
	};
	
	
	my.changeByID = function(id){
	
		var index = my.getIndexFromID(id);
		my.change(index);
	
	};

	
	my.change = function(index){

		APP.save();
		
		if (index == -1){
			my.unloadActive();
			return;
		}
		
		if (typeof my.active_environment != "undefined"){
		
			if (my.environments[index].id == my.active_environment.id){
				console.log("Environment does not have to be changed because it is already active: " + my.active_environment.id);
				return;
			}
			
			my.unloadActive();
			
		}
		
		APP.GUI.scrollTop();
		
		my.create(my.environments[index]);
	
	};
	
	
	my.getIndexFromID = function(id){
		
		var index = getIndex(my.environments, "id", id);
		
		if (typeof index == "undefined"){
			console.error("ERROR: Unknown environment id: " + id);
		}
		
		return index;
	
	};
	
	
	my.initFunctions = function(functions){
	
		var functions_div = g("functions");
		forEach(functions, function(func) { my.createFunction(functions_div, func); });
		
	};
	
	
	my.disableFunction = function(id){
		
		if (my.disabled_functions.indexOf(id) == -1){	
		
			my.disabled_functions.push(id);
			APP.GUI.showFunctionsForView(APP.environments.getModuleByViewID(APP.active_view));			
			
		}

	};
	
	
	my.enableFunction = function(id){
		
		if (my.disabled_functions.indexOf(id) != -1){
			
			my.disabled_functions.splice(my.disabled_functions.indexOf(id), 1);
			APP.GUI.showFunctionsForView(APP.environments.getModuleByViewID(APP.active_view));
			
		}		
	
	};
	
	
	my.createFunction = function(parent, func){
		var function_div;
		
		if (func.type != "function_wrap"){
		
			function_div = dom.make("div", func.id, "function_icon", parent);
			APP.GUI.icon(function_div,"","function_img", func.icon);
			var label = dom.h3(function_div, func.label);
			
			if (func.label_span_id){
				dom.make("span", func.label_span_id, "", label);
			}
			
			else if (func.label) {  //if label is there
				label.innerHTML = func.label;
			}
			
			function_div.addEventListener('click', func.onclick);

		}

		else {
		
			var function_wrap = dom.div(parent, func.wrapper_id, "function_wrap");
			
			function_div = dom.div(function_wrap, func.id, "function_icon");
			APP.GUI.icon(function_div,"","function_img", func.icon);
			dom.h3(function_div, func.label);
			
			function_div.addEventListener('click', func.onclick);

			var sub_div = dom.make("div",func.sub_div,"function_sub_div",function_wrap);
			
			if (func.sub_div_innerHTML){
				sub_div.innerHTML = func.sub_div_innerHTML;
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
		
		if (func.after_that){
			func.after_that();
		}
	
	};
	
	
	my.add = function(environment){
	
		my.environments.push(environment);
	
	};
	
	
	return my;
	
})();
