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

var corpus = (function(){

	var my = {};
	
	my.corpus = {
	
		name: "",
		title: "",
		description: ""
	
	};
	
	//Auto Save my.corpus (not yet implemented!)
	my.save = my.corpus;
	
	my.view_id = "VIEW_corpus";
	
	my.init = function(){
	
		var view = dom.newElement("div","VIEW_corpus","content",g("content_wrapper"));
		
		var corpus_form = dom.newElement("div","corpus_form","",view,

			'<h1>Corpus</h1>'+
			'<p><span title="A short archivable name of your corpus">Name</span><br>'+
			'<input title="A short archivable name of your corpus" type="text" name="corpus_name" id="corpus_name" value=""><br> '+
	
			'<span title="The complete and extensive title of your corpus">Title</span><br>'+
			'<input title="The complete and extensive title of your corpus" type="text" name="corpus_title" id="corpus_title" value=""><br> '+

			'Description<br>'+
			'<textarea name="corpus_description" id="corpus_description" cols="19" rows="5"></textarea>'+
			'</p>'
		);
		
		g("corpus_name").onkeypress = function(e) {
			var chr = String.fromCharCode(e.which);
			
			if (not_allowed_chars.indexOf(chr) >= 0){
				alertify.log("This character is not allowed here.","error",5000);
				return false;
			}
		};

		my.content_languages.init();
		
	}
	
	
	my.functions = [
		{
			label: "Save Form",
			icon: "save.png",
			id: "link_save_form",
			onclick: function() {
				save_and_recall.save_form();
				alertify.log("Form saved","",5000);
			}
		},
		{
			label: "Reset Form",
			icon: "reset.png",
			id: "link_reset_form",
			onclick: function() {       

				alertify.set({ labels: {
					ok     : "No",
					cancel : "Yes, delete form"
				} });
				
				alertify.confirm("Really?<br>You want to reset the form and delete corpus and all sessions?", function (e) {
					if (e) {
						// user clicked "ok"
					}
			
					else {
						// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button=
						APP.reset_form();
						alertify.log("Form reset","",5000);
						
					}
				});
			}
		}
	];


	return my;
	
})();