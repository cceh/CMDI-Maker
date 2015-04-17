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


/**
 * A sub module of APP.GUI that offers some GUI forms that help shape the UI.
 *
 * @class APP.GUI.FORMS
 */
APP.GUI.FORMS = (function() {
	
	var l = APP.l;
	
	var my = {};

	
/**
 * Creates a drop zone on screen, where the user can drag files into. They are made available as File Object then. Under the drop zone, a usual file upload form element is added.
 * @method fileDropZone
 * @param {Object} parent Parent element in DOM
 * @param {String} id ID of the input element
 * @param {Function} onchange Callback function to be called, when one or more files are dropped.
 */	
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
	
	
/**
 * Creates a simple red box with a delete icon in the upper right corner.
 * @method redBox
 * @param {Object} parent Parent element in DOM
 * @param {String} element_id ID of the input element
 * @param {String} additionalClassName Additional class name that is added to the red box. By default, it has the class name 'redBox'
 * @param {Mixed} content Content to be inserted in the box. Can be string, strings, a DOM node or several DOM nodes.
 * @param {Function} on_delete Function that is called when the user clicks on the delete icon.
 * @param {String} width Width of the box in pixel.
 * @return {Object} Object that contains DOM nodes of the box itself and of the box content. Keys are "box" and "content".
 */	
	my.redBox = function(parent, element_id, additionalClassName, content, on_delete, width){
	
		var box = dom.div(parent, element_id, "redBox");
		
		if (typeof additionalClassName != "undefined"){
			box.className += " ";
			box.className += additionalClassName;			
		}
		
		APP.GUI.icon(box,"","delete_lang_icon", "reset", on_delete);
		
		var box_content = dom.div(box, "", "redBox_content");
		
		forEach(content, function(content_for_line){
			var span = dom.spanBR(box_content, "", "", "");
			dom.appendHTMLContent(span, content_for_line);
		});
		
		box.style.width = width + "px";
		
		return {
			box: box,
			content: box_content
		};

	};
	
	
/**
 * Creates a form on screen that the user can expand and collapse/minimize. When minimized, the user sees only the header.
 * @method expandableForm
 * @param {Object} parent Parent element in DOM
 * @param {String} element_prefix Prefix of the IDs of all DOM nodes created here.
 * @param {Boolean} Shall the form be expanded or not at the beginning.
 * @param {Function} on_expand_collapse Callback function that is called, when the user expands or collapses the form. Parameter is "true" when expanding and "false" when collapsing.
 * @param {Function} on_delete Callback function to be called, when the user clicks on the delete icon. Parameter "id" is passed.
 * @param {String} id Custom id that can be appended to the form. This ID is passed to on_delete when the user clicks on the delete icon.
 * @return {Object} Object with several created DOM nodes. Keys are "form", "header", "label", "content", "delete_icon", "display_icon"
 */	
	my.expandableForm = function(parent, element_prefix, expanded, on_expand_collapse, on_delete, id){
	
		var form = dom.make('div', element_prefix, 'expandable_form', parent); 
		
		var header = dom.make('div', element_prefix + '_header','expandable_form_header', form);
		header.addEventListener('click', function(num, num2) { 
			return function(){
				my.expandableFormViewChange(num, on_expand_collapse, num2);
			};
		}(element_prefix, id));

		var label = dom.make('h1', element_prefix + '_label','expandable_form_heading', header);

		//create icon for deleting the expandable form
		var delete_link = APP.GUI.icon(header, element_prefix+'_delete_link','expandable_form_delete_link', "reset", 
		function(num) {

			return function(event){	//only event must be a parameter of the return function because event is to be looked up when the event is fired, not when calling the wrapper function
				event.stopPropagation();
				on_delete(num);
			};
			
		}(id) );
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
	

/**
 * Collapses/minimizes an expandableForm, so that only its header is shown. (This function is not to be used from outside. Maybe it should go to PRIVATE.)
 * @method collapseExpandableForm
 * @param {String} element_prefix Element prefix of the form to be collapsed.
 */	
	my.collapseExpandableForm = function (element_prefix){

		dom.hideElement(g(element_prefix + "_content"));
		APP.GUI.setIcon(g(element_prefix + "_display_link"), "up");

	};
	

/**
 * Changes the view of an expandable form. If it was expanded, it will be collapsed, or the other way around.
 * @method expandableFormViewChange
 * @param {String} element_prefix Element prefix of the form to be collapsed.
 * @param {Function} on_expand_collapse Function that is to be called in addition. An event object is passed that contains the keys "id" and "expanded" (set to true or false)
 */	
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
	
	
/**
 * Creates a thin list (width = approx. 230px) in the DOM that consists of small blue boxes and one highlighted purple box.
 * @method clickableListSmall
 * @param {Object} parent Parent element in DOM
 * @param {Array} titles Array with title strings of the items.
 * @param {Array} subtitles Array with subtitle strings of the items.
 * @param {Function} action Callback function that is called, when the user clicks on one item. Item index is passed to the function.
 * @param {String} id DOM element ID
 * @return {Number} highlighted_index Index of item to highlight
 */	
	my.clickableListSmall = function(parent, titles, subtitles, action, id, highlighted_index){
	
		var self = this;
		
		this.parent = parent;
		this.titles = titles;
		this.subtitles = subtitles;
		this.action = action;
		this.id = id;
		this.highlighted_index = highlighted_index;
		
		this.scrollTop;
	
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
				
				self.list_div.addEventListener("scroll", function(event){
				
					self.scrollTop = self.list_div.scrollTop;
				
				}, false);
				
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
			
			self.list_div.scrollTop = self.scrollTop;
			
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

