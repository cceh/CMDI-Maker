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

var save_and_recall = (function(){

	var my = {};
	
	my.interval;
	my.interval_time = 60;

	my.getRecallData = function(){

		var form = localStorage.getItem(local_storage_key);

		if (!form){
			console.log("No recall data found");
			my.set_autosave_interval(my.interval_time);
			APP.view("default");
			return;
		}
		
		var form_object = JSON.parse(form);
		
		console.log("Recall object: ");
		console.log(form_object);
		
		my.fill_form(form_object);	
		
	}


	my.set_autosave_interval = function(time){

		window.clearInterval(my.interval);
		
		if (time == -1){

			console.log("Auto Save off");
			return;
			//nothing to do here because interval is already cleared. just return
		
		}
		
		console.log("Auto Save Time in seconds: " + time);
		
		my.interval_time = time;
		
		// if not switched off
		my.interval = window.setInterval(function() {
			my.save_form();
		}, my.interval_time*1000);

	}


	my.fill_form = function(recall_object){

		console.log("Filling the form with recalled data");
		
		g("metadata_language_select").selectedIndex = recall_object.settings.metadata_language;
		g("metadata_creator").value = recall_object.settings.metadata_creator;
		dom.setRadioIndex(document.metadata_form.output_format, recall_object.settings.output_format);
		
		if (recall_object.settings.calc_actors_age == true){
		
			document.metadata_form.radio_age_calc[0].checked = true;
		
		}
		
		else {
		
			document.metadata_form.radio_age_calc[1].checked = true;	
		
		}
		
		var workflow = APP.active_environment.workflow;
		
		//for every workflow module, recall its save data
		for (var m=0; m<workflow.length; m++){
		
			if (workflow[m].recall){
				workflow[m].recall(recall_object[workflow[m].identity.id]);
			}
			
		}
		
		my.set_autosave_interval(recall_object.settings.save_interval_time);

		APP.view(recall_object.active_view);	
		
	}
	
	
	my.deleteAllData = function(){
	
		localStorage.removeItem("actors");
		localStorage.removeItem("actor_id_counter");
		localStorage.removeItem(local_storage_key);
		
	}


	my.delete_recall_data = function(){

		localStorage.removeItem(local_storage_key);
		alertify.log("Recall data deleted","",5000);

	}

	
	my.save_form = function(){
		
		var form_object = my.retrieveDataToSave();
		
		localStorage.setItem(local_storage_key, JSON.stringify(form_object));

	}

	
	my.retrieveDataToSave = function(){

		var object = {
		
			settings: {
				save_interval_time: 0,
				output_format: dom.getSelectedRadioIndex(document.metadata_form.output_format),
				calc_actors_age: (document.getElementsByName("radio_age_calc")[0].checked ? true : false),
				metadata_creator: get("metadata_creator"),
				metadata_language: g("metadata_language_select").selectedIndex,
				save_interval_time: document.metadata_form.radio_auto_save.value
			}
			
		};
		
		object.active_view = APP.active_view;
		
		var workflow = APP.active_environment.workflow;
		
		for (var m=0; m<workflow.length; m++){
			
			if (workflow[m].getSaveData){
				object[workflow[m].identity.id] = workflow[m].getSaveData();
			}
			
		}
		
		return object;

	}

	
	return my;
	
})();