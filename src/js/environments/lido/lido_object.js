lido_environment.workflow[1] = (function(){
	'use strict';
	

	var my = {};
	my.parent = lido_environment;
	var bundle;

	my.element_id_prefix = "actor_";
	
	my.identity = {
		id: "object",
		title: "Object",
		icon: "user"
	};
	
	my.module_view;
	
	my.init = function(view){
	
		dom.h3(view, "Now it's all about the object!");
		dom.br(view);
		
		APP.forms.make(view, my.parent.object_form, "object_", "object_", undefined);
		
	};
	
	
	my.getSaveData = function(){
	
		return;
	
	};
	
	
	my.recall = function(data){
	
		return;
		
	};
	
	
	my.functions = function(){
		return [];
	};


	return my;
	
})();