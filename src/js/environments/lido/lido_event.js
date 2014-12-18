lido_environment.workflow[2] = (function(){
	'use strict';
	

	var my = {};
	my.parent = lido_environment;
	var bundle;

	my.element_id_prefix = "actor_";
	
	my.identity = {
		id: "event",
		title: "Event",
		icon: "box"
	};
	
	my.module_view;
	
	my.init = function(view){
	
		dom.h3(view, "Now it's all about the event!");
		dom.br(view);
		APP.forms.make(view, my.parent.event_form, "event_", "event_", undefined);
		
		
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