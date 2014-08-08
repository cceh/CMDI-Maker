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
	
	my.parent = eldp_environment;
	var l = my.parent.l;
	
	my.identity = {
		id: "xml_output",
		title: "XML Output",
		icon: "data"
	};
	
	
	my.init = function(){
	
		bundle = eldp_environment.workflow[2];
	
	};
	
	
	my.view = function(){
	
		//if there is nothing to be done, return
		if (bundle.bundles.length === 0){
		
			APP.alert(l("output", "you_must_create_some_bundles_first"));
			APP.view(bundle);
			return;
		}
		
		//corpus must have a proper name or no name at all
		if (bundle.areAllBundlesProperlyNamed()){
			
			if (bundle.doesEveryBundleHaveAProjectName()){

				my.generate();
				
			}
			
			else {
				
				APP.alert(l("output", "every_bundle_must_have_a_project_name"));
			
				APP.view(bundle);
			
			}
			
		}
		
		else {
			APP.view(bundle);
			APP.alert(l("output", "bundles_must_have_proper_name") + APP.CONF.not_allowed_chars);
		}
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
		/*
		for (var s=0;s<bundle.bundles.length;s++){

			filename = get(bundle.dom_element_prefix+bundle.bundles[s].id+"_bundle_name")+"."+file_ending;
			dom.createXMLOutputDIV(xml_window, output_format + " Bundle " + (s+1), "textarea_bundle_"+s,
			xml_strings.bundles[s],filename);
			
		}*/
		
	};


	return my;
	
})();