lido_environment.workflow.push((function (){
	'use strict';

	var my = {};
	
	var start;
	
	my.parent = lido_environment;
	
	my.view_element;
	
	my.identity = {
		id: "xml_output",
		title: "XML Output",
		icon: "submit"
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
	
})());