lido_environment.workflow.push((function(){
	'use strict';
	

	var my = {};
	my.parent = lido_environment;
	var bundle;

	my.element_id_prefix = "actor_";
	
	my.identity = {
		id: "object_identification",
		title: "Object Identification",
		icon: "blocks"
	};
	
	my.module_view;
	
	my.init = function(view){
	
		dom.h1(view, "Object Identification");
		dom.br(view);
		
		APP.forms.make(view, my.parent.object_form, "object_identification_", "object_identification_", undefined);
		
	};
	
	
	my.getSaveData = function(){
	
		return APP.forms.makeObjectWithFormData(my.parent.object_form, "object_identification_");
	
	};
	
	
	my.recall = function(data){
	
		return;
		
	};
	
	
	my.functions = function(){
		return [];
	};


	return my;
	
})());