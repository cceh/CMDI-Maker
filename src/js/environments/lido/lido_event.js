lido_environment.workflow.push((function(){
	'use strict';
	
	
	//PUBLIC
	
	var my = {};
	my.parent = lido_environment;
	var event_form = my.parent.event_form;
	var bundle;

	my.element_id_prefix = "event_";
	
	my.identity = {
		id: "event",
		title: "Event",
		icon: "clock"
	};
	
	my.module_view;
	
	my.init = function(view){
	
		dom.h3(view, "The LIDO event");
		dom.br(view);
		APP.forms.make(view, my.parent.event_form, "event_", "event_", undefined);
		
		my.module_view = view;
		
	};
	

	my.getSaveData = function(){
	
		return APP.forms.makeObjectWithFormData(my.parent.event_form, "event_");
	
	};
	
	
	my.recall = function(data){
	
		return;
		
	};
	
	
	my.functions = function(){
		return [];
	};
	

	return my;
	
})());