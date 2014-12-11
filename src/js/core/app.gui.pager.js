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


APP.GUI.pager = function(config){

	var self = this;
	
	this.current_page = (config.start_page || 0);
	this.items_per_page = (config.items_per_page || 20);
	this.view = config.view;
	this.items_list = config.items_list;
	this.on_page_change = config.on_page_change;
	
	//if show_always is activated, the pager renders, even if all items fit on one page
	this.show_always = (config.show_always || false);
	
	this.before_page_change = config.before_page_change;
	
	
	var refreshVars = function(){
	
		self.items_count = self.items_list.length;
	
		//how many pages will there be
		self.page_count = Math.ceil(self.items_count / self.items_per_page);
		
		/*
		console.log(
			"items_count / items_per_page = " + self.items_count + " / "+
			self.items_per_page
		);
		*/
		
		
		//if there are 0 items, page_count should not be 0, but 1
		if (self.page_count == 0){
			//console.log("page count was 0 but should be 1");
			self.page_count = 1;
		}
		
		self.start_item = self.current_page * self.items_per_page;
		
		//if the page if full of items
		self.end_item = self.start_item + self.items_per_page - 1;
		
		//if page is last page and not full of items
		if (self.items_list.length < (self.end_item + 1)){
			self.end_item = self.items_list.length - 1;
		}
		
		//if there are no items at all
		if (self.items_list.length == 0){
			self.end_item = 0;
		}
		
		/*******************************************/
		//if the page is full of items
		self.visible_items = self.items_list.slice(
			self.start_item,
			self.start_item + self.items_per_page
		);
		
		
		
		//if page is last page
		if (self.current_page == self.page_count - 1){

			self.visible_items = self.items_list.slice(
				self.start_item
			);
			
			/*
			console.log("page is last page. showing all items from "+
				self.start_item + ". page is " + self.current_page + 
				". page_count = " + self.page_count
			);
			*/
			
			
		}
		
		//console.log("PAGER ITEMS LIST:");
		//console.log(self.items_list);
		
		//if page is last page but no items there because no items at all
		if (self.items_list.length == 0){
			self.visible_items = [];
		}
	
	
		// if current page is higher than page_count, reset current_page to
		// the highest possible 
		if (self.current_page >= self.page_count){
		
			/*
			console.log(
				"current page " + self.current_page + 
				"higher than page_count " + self.page_count + "! Set it to " + (self.page_count - 1)
			);
			*/
			
			self.changePage(self.page_count - 1);
			return;
		}
		
	
	};
	
	
	this.refresh = function(items){
	
		//console.log("got items: ");
		//console.log(items);
		
		self.items_list = items;
		
		refreshVars();

		/*
		console.log(
			"rendering page " + self.current_page + "\n" + 
			"page_count " + self.page_count + "\n" + 
			"start " + self.start_item + "\n" + 
			"end " + self.end_item + "\n" + 
			"items count " + self.items_count + "\n" + 
			"visible items length " + self.visible_items.length + "\n" 				
		);
		*/
		
		self.hide();
		
		if ((self.items_count > self.items_per_page || self.show_always == true) && (g(APP.active_view) == self.view)){
		
			var div = dom.div(g("environment_view"), "pager", "pager", "Page: ");
			g("content_wrapper").style.bottom = "84px";

		}
		
		else {
		
			return;
		
		}
		
		for (var i = 0; i < self.page_count; i++){
		
			var span = dom.span(div, "page_link_"+i, "page_link", i+1);
			
			if (i == self.current_page){
			
				span.className += " page_link_active";
			
			}
			
			span.addEventListener("click", function(num){
			
				return function(){
					self.changePage(num);
					self.refresh(self.items_list);
				};
			
			}(i), false);
		
		}
		
		if (self.items_count != 0){
			
			var pager_info = "Showing items " + (self.start_item+1) + "-" + 
			(self.end_item+1) + " of " + self.items_list.length;
		
		}
		
		else {
		
			pager_info = "";
			
		}
		
		dom.span(div, "pager_info_span", "", pager_info);
	
	};
	
	
	this.changePage = function(p){
	
		if (typeof self.before_page_change == "function"){
		
			self.before_page_change();
		
		}
	
		self.current_page = p;
		
		self.on_page_change(self.items_list);
		
		APP.GUI.scrollTop();

	};
	
	
	this.hide = function(){
	
		if (g("pager")){
			dom.remove("pager");
			g("content_wrapper").style.bottom = "";
			
		}
		
		//console.log("pager HIDDEN");
	
	};
	
	refreshVars();
	//this.render();
	
};