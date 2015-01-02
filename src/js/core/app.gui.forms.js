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
	
	
	my.redBox = function(parent, element_id, additionalClassName, content, on_delete, width){
	
		var box = dom.div(parent, element_id, "redBox");
		
		if (typeof additionalClassName != "undefined"){
			box.className += " ";
			box.className += additionalClassName;			
		}
		
		APP.GUI.icon(box,"","delete_lang_icon", "reset", on_delete);
		
		forEach(content, function(content_for_line){
			var span = dom.spanBR(box,"","","");
			dom.appendHTMLContent(span, content_for_line);
		});
		
		box.style.width = width + "px";
		
		return box;

	};
	
	
	my.expandableForm = function(parent, element_prefix, expanded, on_expand_collapse, on_delete, id){
	
		var form = dom.make('div', element_prefix, 'expandable_form', parent); 
		
		var header = dom.make('div', element_prefix + '_header','expandable_form_header', form);
		header.addEventListener('click', function(num, num2) { 
			return function(){
				my.expandableFormViewChange(num, on_expand_collapse, num2);
			};
		}(element_prefix, id) );

		var label = dom.make('h1', element_prefix + '_label','expandable_form_heading', header);

		//create icon for deleting the expandable form
		var delete_link = APP.GUI.icon(header, element_prefix+'_delete_link','expandable_form_delete_link', "reset", 
		function(num) {

			return function(event){	//only event must be a parameter of the return function because event is to be looked up when the event is fired, not when calling the wrapper function
				event.stopPropagation();
				on_delete(num);
			};
			
		}(element_prefix) );
		delete_link.innerHTML = "<img id=\"" + element_prefix + "_delete_img\" class=\"delete_img\" src=\""+APP.CONF.path_to_icons+"reset.png\" alt=\"Delete Bundle\">";
		
		//create icon to expand/collapse the expandable form, it will do nothing, just indicate status
		var display_link = APP.GUI.icon(header,element_prefix+'_display_link','expandable_form_display_link', "down");
		APP.GUI.icon(display_link, element_prefix+"_expand_img", "expand_img", "down");

		var content = dom.make('div', element_prefix+'_content', 'expandable_form_content', form);

		if (expanded == false){
			my.collapseExpandableForm(element_prefix);
		}
		
		return {
			form: form,
			header: header,
			label: label,
			content: content,
			delete_icon: delete_link,
			display_icon: display_link
		};
	
	};
	
	
	my.collapseExpandableForm = function (element_prefix){

		dom.hideElement(g(element_prefix + "_content"));
		APP.GUI.setIcon(g(element_prefix + "_display_link"), "up");

	};
	

	my.expandableFormViewChange = function(element_prefix, on_expand_collapse, id){
	
		var content = g(element_prefix + "_content");
	
		if (content.style.display != "none"){
		
			my.collapseExpandableForm(element_prefix);
			
			var event = {
				id: id,
				expanded: false
			};
			

		}
		
		else {
		
			dom.unhideElement(content);
			APP.GUI.setIcon(g(element_prefix + "_display_link"), "down");
			
			var event = {
				id: id,
				expanded: true
			};
			
		}
		
		on_expand_collapse(event);
		
	};
	
	
	my.clickableListSmall = function(parent, titles, subtitles, action, id, highlighted_index){
	
		var self = this;
		
		this.parent = parent;
		this.titles = titles;
		this.subtitles = subtitles;
		this.action = action;
		this.id = id;
		this.highlighted_index = highlighted_index;
	
		this.list_div;

		
		var renderItem = function(parent, title, subtitle, action, highlighted){
		
			var div = dom.make('div', "", "clickable_list_entry", self.list_div);
			
			if (highlighted){
				div.className += " clickable_list_entry_highlighted";
			}
			
			dom.h2(div, title);
			dom.p(div, subtitle);
			
			div.addEventListener('click', action, false);	
			
			return div;
		
		};
		
		
		var render = function(){
		
			if (!g(id)){
				self.list_div = dom.make("div", id, "clickable_list_small", parent);
			}
		
			var elements = [];
		
			self.list_div.innerHTML = "";
			
			for (var i = 0; i < self.titles.length; i++){
				
				if (typeof self.subtitles !== "undefined"){
					var subtitle = self.subtitles[i];
				}
				
				else {
					subtitle = "";
				}
				
				var div = renderItem(
					self.list_div,
					self.titles[i],
					subtitle,
					function(num) { 
						return function(){ self.action(num); }; 
					}(i),
					(self.highlighted_index == i)
				);
				
				elements.push(div);	
				
			}
			
			return elements;
			
		};
		
		
		this.elements = render(parent, titles, subtitles, action, highlighted_index);
		
		
		this.changeHighlight = function(new_index){
			self.highlighted_index = new_index;
			render();
		};
		
		this.refresh = function(titles, subtitles){
			self.titles = titles;
			self.subtitles = subtitles;
			render();
		};
	
	}
	
	return my;
	
})();

