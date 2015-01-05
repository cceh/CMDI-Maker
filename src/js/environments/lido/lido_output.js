lido_environment.workflow.push((function (){
	'use strict';

	var my = {};
	
	var start;
	var object_identification;
	var event;
	var object_relation;
	
	my.parent = lido_environment;
	
	my.view_element;
	
	my.identity = {
		id: "xml_output",
		title: "XML Output",
		icon: "submit"
	};
	
	
	my.init = function(view_element){
	
		start = my.parent.workflow[0];
		object_identification = my.parent.workflow[1];
		event = my.parent.workflow[2];
		object_relation = my.parent.workflow[3];
	
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
			start: start.getSaveData(),
			object_identification: object_identification.getSaveData(),
			event: event.getSaveData(),
			object_relation: object_relation.getSaveData()
		};
		
		var xml_string = lido_environment.lido_generator(data);

		var filename = "LIDO.xml";
		//(parent, title, textarea_id, value, filename,
		APP.GUI.createXMLOutputDIV(my.view_element, "LIDO", "ta_0", xml_string, filename);

	};
	
	
	return my;
	
})());