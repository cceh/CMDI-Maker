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
	
	my.environments = [imdi_environment, eldp_environment];
	
	my.active_environment = undefined;

	
	my.displayAllInSelect = function (){
		
		var select = g("profile_select");
		var start_select = g("start_profile_select");
		
		dom.setSelectOptions(select, my.environments, true);
		dom.setSelectOptions(start_select, my.environments, false);
		
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
	
		if (my.active_environment && my.active_environment.reset){
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
			console.log("WARNING: APP.environments.unloadActive called although there is no environment loaded!");
			return;
		}
	
		console.log("Unloading active environment: " + my.active_environment.id);
	
		APP.save();
		
		g("environment_settings").innerHTML = "";
	
		forEach(my.active_environment.workflow, function (module){
		
			//delete module view
			dom.remove(APP.CONF.view_id_prefix+module.identity.id);
			
		});
		
		g("functions").innerHTML = "";
	
		g("module_icons").innerHTML = "";
		
		my.active_environment = undefined;
		
		g("profile_select").selectedIndex = 0;
		
		APP.view("VIEW_start");
	
	};
	
	
	my.create = function (environment){
	
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
	
		my.createWorkflow(environment.workflow);
		
		var profile_select_index = getIndexOfEnvironment(environment) + 1;
		//+1 because the first option of profile select is an empty option
		
		g("profile_select").selectedIndex = profile_select_index;
		
		APP.view("default");
	
	};
	
	
	my.initSettings = function (settings){
	
		APP.initSettings(settings, g("environment_settings"));
	
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
				APP.initFunctions(module.functions());
			}
			
			else {
				APP.initFunctions(module.functions);
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
				dom.icon(arrow,"","wizard_icon", "right2");
			
			}
			
			var icon = dom.newElement("div",APP.CONF.viewlink_id_prefix + workflow[w].identity.id,"icon_div",div);
			dom.icon(icon, "", "module_icon", workflow[w].identity.icon);
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
		
		return getObject(my.environments, "id", id);
	
	};
	
	
	my.get = function(index){
	
		return my.environments[index];
	
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
		
		dom.scrollTop();
		
		my.create(my.environments[index]);
	
	};
	
	
	my.getIndexFromID = function(id){
		
		var index = getIndex(my.environments, "id", id);
		
		if (typeof index == "undefined"){
			console.error("ERROR: Unknown environment id: " + id);
		}
		
		return index;
	
	};
	
	return my;
	
})();
