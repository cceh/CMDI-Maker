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


eldp_environment.workflow[3] = (function (){
	'use strict';

	var my = {};
	
	var bundle;
	var person;
	var resources;
	
	my.parent = eldp_environment;
	var l = my.parent.l;
	
	my.view_element;
	
	my.identity = {
		id: "xml_output",
		title: "JSON Output",
		icon: "data"
	};
	
	
	my.init = function(view_element){
	
		bundle = eldp_environment.workflow[2];
		person = eldp_environment.workflow[1];
		resources = eldp_environment.workflow[0];
		
		my.view_element = view_element;
		
		var h2 = dom.h2(my.view_element, "", "", "");
		dom.link(h2, "", "", "Download JSON of this project", APP.save_and_recall.saveActiveEnvironmentStateToFile);
	
	};
	
	
	my.view = function(){
	
		APP.save();
	
		//if there is nothing to be done, return
		if (bundle.bundles.length === 0){
		
			APP.alert(l("output", "you_must_create_some_bundles_first"));
			APP.view(bundle);
			return;
			
		}
		
		//corpus must have a proper name or no name at all
		if (!bundle.areAllBundlesProperlyNamed()){
			
			APP.view(bundle);
			APP.alert(l("output", "bundles_must_have_proper_name") + my.parent.not_allowed_chars);
			return;
			
		}
		
		my.generate();
		
	};
	

	my.functions = function() {
		return [
			{
				id: "link_export_corpus",
				icon: "download",
				label: "Download All Bundles",
				onclick: function(){APP.saveAllOutputFiles();}
			}
		
		];
	};
	

	my.generate = function (){
		var filename;
		
		var xml_window = g('VIEW_xml_output');
		
		xml_window.innerHTML = "";
		
		APP.save(); //BAD HERE. has to be there so that all values in objects are up-to-date. must happen before eldp_generator is called.
		
		
		var data = {
			bundles: bundle.bundles,
			persons: person.persons,
			resources: resources.resources
		};
		
		var xml_strings = eldp_environment.eldp_generator(data);
		
		for (var s = 0; s < bundle.bundles.length; s++){
			
			filename = bundle.bundles[s].bundle.name + ".cmdi";
			APP.GUI.createXMLOutputDIV(xml_window, "CMDI Bundle " + (s+1), "textarea_bundle_"+s,
			xml_strings.bundles[s],filename, false);
			
		}
		
	};
	
	
	return my;
	
})();