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
	
	
var xml = (function () {

	var my = {};
	my.header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";

	my.last_mode = 0;
	
	my.tab = 0;
	

	my.tag = function(name,mode,keys){   //keys as array
		//mode 0 = opening tag
		//mode 1 = closing tag
		//mode 2 = self-closing tag
		
		if (!keys){
			var keys = [];
		}
    
		var return_string = "";
    
		if (mode==1){
			my.tab-=1;
		}
		
		if ((mode!=1) || (my.last_mode!=0)){  
			return_string+="\n";

			for (var x=0;x<my.tab;x++){
				return_string+="   ";
			}
		}	
		
		return_string+="<";
    
		if (mode==1){
			return_string+="/";
		}
		
		return_string+=name;
		
		if ((mode==0) || (mode==2)){  //insert keys/arguments
			
			for (var i=0;i<keys.length;i++){
				
				if (i!=0){
					return_string+="\n";
					
					for (var y=0;y<my.tab;y++){
						return_string+="   ";
					}
                
					for (var j=0;j<name.length;j++){
						return_string+=" ";
					}
					
					return_string += "  ";  // because of < and space next to name
					
				}
		
				if (i==0){
					return_string+=" ";
				}
		
				return_string+=keys[i][0];
				return_string+="=\"";
				return_string+=keys[i][1];
				return_string+="\"";
				
			}
		}
		
		if (mode==2){
			return_string+="/";
		}
	
		return_string+=">";
		
		if (mode==0){
			my.tab+=1;
		}
	
		my.last_mode = mode;
		
		return return_string;
		
	}

	my.element = function (name,value,keys){
		
		var return_string="";
	
		if (value != ""){
		
			return_string+=my.tag(name,0,keys);
			return_string+=value;
			return_string+=my.tag(name,1);
		
		}
	
		else {
			return_string+=my.tag(name,2,keys);
		}
		
		return return_string;
		
	}
	
	return my;
	
}());