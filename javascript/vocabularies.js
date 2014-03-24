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

var vocabularies = {

	continent: ["Unknown","Unspecified","Africa","Asia","Europe","Australia","Oceania","North-America","Middle-America","South-America"],
	
	genre: ["Unknown","Unspecified","Discourse","Ritual/religious texts","Fiction","Newspaper article",
	"Radio/TV feature","Drama","Singing","Instrumental music","Poetry","Literature","Secondary document","Personal notes","Stimuli"],

	task: ["Unknown","Unspecified","info-kiosk","travel-planning","room reservation","frog story","pear story"],
	
	event_structure: ["Unknown","Unspecified","Monologue","Dialogue","Conversation","Not a natural format"],
	
	planning_type: ["Unknown","Unspecified","spontaneous","semi-spontaneous","planned"],

	interactivity: ["Unknown","Unspecified","interactive","non-interactive","semi-interactive"],
	
	social_context: ["Unknown","Unspecified","Family","Private","Public","Controlled environment"],

	involvement: ["Unknown","Unspecified","elicited","non-elicited","no-observer"],
	
	actor: {
	
		sex: ["Unknown","Unspecified","NAP","Female","Male"],
	
		role: ["Unknown","Unspecified","Annotator","Author","Collector","Consultant","Computer","Depositor","Editor","Filmer",
		"Illustrator","Interviewer","Musician","Photographer","Publisher","Recorder","Referent","Researcher","Singer","Speaker/Signer","Translator"],
		
		family_social_role: ["Unknown","Unspecified","Father","Mother","Sibling","Boss","Partner","Student","Teacher","Shaman/Priest","Mayor","Doctor"]
	
	}

	
};