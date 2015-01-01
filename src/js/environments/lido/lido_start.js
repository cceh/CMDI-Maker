lido_environment.workflow.push((function(){
	'use strict';

	var my = {};
	var bundle;
	
	my.parent = lido_environment;
	my.l = my.parent.l;

	my.identity = {
		id: "lido_start",
		title: "Start",
		icon: "right",
	};

	my.view_id = "VIEW_start";
	
	my.init = function(view){
		
		dom.h3(view, "Hey there! You want to create a LIDO document of your object? That's great! Let's begin by giving information for basic record identification.");
		dom.br(view);
		APP.forms.make(view, my.parent.start_form, "start_", "start_", undefined);
		
	};
	
	
	my.view = function(){
	
		APP.GUI.scrollTop();
	
	};
	
	
	my.recall = function(data){
	
		APP.forms.fill(my.parent.start_form, "start_", data, undefined);
	
	};
	
	
	my.getSaveData = function(){
	
		return APP.forms.makeObjectWithFormData(my.parent.start_form, "start_");
	
	};
	
	
	my.functions = function(){
		return [];
	};


	my.reset = function(){

		my.refresh();

	};
	
	return my;

})());
  
