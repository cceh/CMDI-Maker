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


APP.GUI.FORMS = (function() {
	
	var l = APP.l;
	
	var my = {};

	
	my.fileDropZone = function(parent, id, onchange){
	
		var dropZone = dom.make("div", id, "fileDropZone", parent,"<h2>" + l("forms", "drag_and_drop_files_here") + "</h2>");
		
		var input = dom.input(parent,"files_input","","files_input", "file");
		input.multiple = true;
		
		dropZone.addEventListener('dragover', function(evt) {

			evt.stopPropagation();
			evt.preventDefault();
			evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
			
		}, false);
		
		dropZone.addEventListener('drop', function(evt){

			evt.stopPropagation();
			evt.preventDefault();
			onchange(evt.dataTransfer.files);
			
		}, false);

		g('files_input').addEventListener('change', function(evt){
	 
			onchange(evt.target.files);
		 
		}, false);
		
	};
	
	return my;
	
})();

