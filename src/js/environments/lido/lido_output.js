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


lido_environment.workflow[3] = (function (){
	'use strict';

	var my = {};
	
	var start;
	
	my.parent = lido_environment;
	
	my.view_element;
	
	my.identity = {
		id: "xml_output",
		title: "XML Output",
		icon: "data"
	};
	
	
	my.init = function(view_element){
	
		start = my.parent.workflow[0];
	
		my.view_element = view_element;
		
	};
	
	
	my.view = function(){
	
		APP.save();
	
		my.generate();
		
	};
	

	my.functions = function() {
		return [];
	};
	

	my.generate = function (){
		
		my.view_element.innerHTML = "";
		
		var data = {
			start: start.getSaveData()
		};
		
		var xml_string = lido_environment.lido_generator(data);

		var filename = "LIDO.xml";
		//(parent, title, textarea_id, value, filename,
		APP.GUI.createXMLOutputDIV(my.view_element, "LIDO", "ta_0", xml_string, filename);

	};
	
	
	return my;
	
})();