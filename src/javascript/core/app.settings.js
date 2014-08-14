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


APP.settings = (function () {
	'use strict';

	var my = {};
	
	my.makeFunctions = {
	
		radio: function(setting, parent){
		
			dom.makeRadios(parent, setting.options, setting.radio_name, setting.radio_name + "_", "title", "value", setting.default_option, setting.onchange);
		
		},
		
		select: function(setting, parent){
		
			var select = dom.make("select",setting.id,"",parent);
			select.size = 1;
			select.name = setting.name;
			
			if (setting.onchange){
				select.addEventListener("change", setting.onchange, false);
			}
			
			dom.br(parent);
			
		},
		
		
		powerSwitch: function(setting, parent){
			
			var input = dom.input(parent, setting.id, "on_off_switch", setting.name, "button");
			input.on = false;
			input.addEventListener("click", function(){APP.GUI.onOffSwitch(this);}, false);
			
			APP.GUI.setOnOffSwitchValue(g(setting.id),setting.default_value);
			
			dom.br(parent);
			
		},
		
		file: function(setting, parent){
		
			var input = dom.input(parent,setting.file_input_id,"",setting.file_input_name,"file");
			input.addEventListener('change', setting.onchange, false);
			dom.br(parent);
		},
		
		text: function(setting, parent){
			
			var input = dom.input(parent,setting.id,"",setting.name, "text", setting.value);
			input.addEventListener('change', setting.onchange, false);
			dom.br(parent);
		},
		
		empty: function(setting, parent){
			
			dom.make("div",setting.id,"",parent);
		
		},
		
		link: function(){
			return;
		}
	
	
	};
	
	
	my.init = function (settings, parent){
	
		parent.innerHTML = "";
		
		forEach(settings, function(setting) { my.create(setting, parent); });
	
	};
	

	my.create = function(setting, parent){
		
		var h2 = dom.h2(parent);
		
		if ((setting.importance) && (setting.importance == "high")){
			h2.style.color = "red";
		}
		
		if (setting.onclick){
			var a = dom.a(h2,"","","#",setting.title, setting.onclick);
			
			if ((setting.importance) && (setting.importance == "high")){
				a.style.color = "red";
			}
		}
		
		else {
		
			h2.innerHTML = setting.title;
		
		}
		
		if (setting.description){
			dom.make("p","","",parent,setting.description);
		}

		if (my.makeFunctions[setting.type]) {
		
			my.makeFunctions[setting.type](setting, parent);
		
		}
		
		else {
		
			console.warn("Unknown setting type: " + setting.type);
			
		}
		
		dom.br(parent);
		
	};

	
	return my;
	
})();
