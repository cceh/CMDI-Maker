lido_environment.start_form = {

	title: "lido-start",
	type: "form",
	fields: [
		{
			type: "column",
			fields: [
				{
					heading: "Source",
					name: "source",
					type: "text",
					comment: "Source of the information given here. This is probably you or your institution.",
					default_value: "Theaterwissenschaftliche Sammlung Schloss Wahn"
				},
				{
					heading: "RecID",
					name: "object_id",
					type: "text",
					comment: "Identifier of this object. Maybe something like DE-Wahn2014/lido-obj00154983"
				},
				{
					heading: "Concept ID",
					name: "concept_id",
					type: "text"
				},
				{
					heading: "Legal Body",
					name: "legal_body",
					type: "text",
					default_value: "Theaterwissenschaftliche Sammlung, Universität zu Köln"
				},
				{
					heading: "Type",
					name: "type",
					type: "select",
					comment: "This is an easy one! Just select the type of the object.",
					vocabulary: ["Programmhefte", "Kritiken", "Noten", "Libretti", "Szenische Grafik", "Porträtgrafik",
					"Theaterbaugrafik", "Papiertheater", "Gemälde", "Theaterplakate", "Inszenierungsfotografien",
					"Personenfotografien", "Theaterbaufotografien", "Tanzfotografien", "Glasplattennegative", "Fotoalben",
					"Bühnenmodelle", "Masken", "Puppen", "Schattenspielfiguren", "Marionetten", "Plastiken", "Filmfotos",
					"Filmplakate"],
				},
				{
					heading: "Classification",
					name: "classification",
					type: "text",
					//comment: ""
				},	
				{
					heading: "Rights Work",
					type: "subarea",
					name: "rights",
					fields: [
						{
							heading: "Rights Type",
							type: "text",
							name: "type"
						},
						{
							heading: "Earliest Date",
							type: "year",
							name: "earliest_date"
						},
						{
							heading: "Latest Date",
							type: "year",
							name: "latest_date"
						},
						{
							heading: "Legal Body Name of Rights Holder",
							type: "text",
							name: "legal_body",
							default_value: "Theaterwissenschaftliche Sammlung, Universität zu Köln"
						}
					]
				}
			],
		},
		{
			type: "column",
			title: "Record",
			name: "record",
			fields: [
				{
					heading: "Record ID",
					name: "id",
					type: "text",
					comment: "Source of the information given here. This is probably you or your institution.",
					default_value: "Theaterwissenschaftliche Sammlung Schloss Wahn"
				},
				{
					heading: "Record Type",
					name: "type",
					type: "text",
					comment: "Source of the information given here. This is probably you or your institution.",
					default_value: "Theaterwissenschaftliche Sammlung Schloss Wahn"
				},
				{
					heading: "Record Source",
					name: "source",
					type: "text",
				},
				{
					heading: "Record Rights",
					type: "subarea",
					name: "rights",
					fields: [
						{
							heading: "Rights Type",
							name: "type",
							type: "text",
							comment: "Definition: The specific type of right being recorded.",
						},
						{
							heading: "Rights Date",
							name: "date",
							type: "text",
							comment: "Definition: The date on which a right is or was current.",
						},
						{
							heading: "Rights Holder",
							name: "holder",
							type: "text",
							comment: "Definition: The holder of the right.",
						},	
						{
							heading: "Credit Line",
							name: "credit_line",
							type: "text",
							comment: "Definition: Acknowledgement of the rights associated with the physical and/or digital object as requested.",
						},	
					]
				}
			]
		},
		{
			type: "column",
			title: "Resource",
			name: "resource",
			fields: [
				{
					heading: "Resource ID",
					name: "id",
					type: "text"
				},
				{
					heading: "Link Resource",
					name: "link",
					type: "text"
				},
				{
					heading: "Representation Type",
					name: "representation_type",
					type: "text"
				},				
				{
					heading: "Resource Type",
					name: "type",
					type: "text"
				},
{
					heading: "Resource Source",
					name: "source",
					type: "text",
					comment: "Source of the information given here. This is probably you or your institution.",
					default_value: "Theaterwissenschaftliche Sammlung, Universität zu Köln"
				},				
				{
					heading: "Rights Resource",
					type: "subarea",
					name: "rights",
					fields: [
						{
							heading: "Rights Type",
							name: "type",
							type: "text",
							comment: "Definition: The specific type of right being recorded.",
						},
						{
							heading: "Rights Date",
							name: "date",
							type: "text",
							comment: "Definition: The date on which a right is or was current.",
						},
						{
							heading: "Rights Holder",
							name: "holder",
							type: "text",
							comment: "Definition: The holder of the right.",
						},	
						{
							heading: "Credit Line",
							name: "credit_line",
							type: "text",
							comment: "Definition: Acknowledgement of the rights associated with the physical and/or digital object as requested.",
						},	
					]
				}
			]
		}		
	]

};


lido_environment.object_form = {

	title: "lido-object",
	type: "form",
	heading: "Object Identification",
	fields: [
		{
			type: "column",
			title: "Object Classification",
			fields: [
				{
					heading: "Title",
					name: "title",
					type: "text",
				},
				{
					heading: "Legal Body",
					name: "legal_body",
					type: "text",
					default_value: "Theaterwissenschaftliche Sammlung, Universität zu Köln"
				},
				{
					heading: "Inventory Number",
					name: "inventory_number",
					type: "text",
				},
				{
					heading: "Descriptive Note",
					name: "descriptive_note",
					type: "textarea",
					comment: "Kurze Objektbescreibung: Material, Technik, Beschädigung, Beschriftung, Retuschen, ... Inhalt. Beschr. folgt unter Objectrelation",
				},		
				{
					heading: "Display Object Measurements",
					name: "display_object_measurements",
					type: "text"
				},
				{
					heading: "Measurement Unit",
					name: "measurements_unit",
					type: "text",
					default_value: "cm"
				},
				{
					heading: "Measurement Type",
					name: "measurements_type",
					type: "text",
					default_value: "H x B x T",
				},				
			]
		}
	]
};


lido_environment.object_relation_form = {
	name: "object_relation",
	type: "form",
	heading: "Object Relation",
	fields: [
		{
			type: "column",
			fields: [
				{
					heading: "Display Subject",
					name: "display_subject",
					type: "textarea",
					comment: "Kurzbeschreibung \"Worum gehts?\", \"Was/Wenn dokumentiert das Objekt?\"",				
				},
				{
					heading: "Subject Concept",
					name: "subject_concept",
					type: "textarea",
					comment: "How to record: May include iconography, themes from literature, or generic terms describing the material world, or topics (e.g., concepts, themes, or issues). However, references to people, dates, events, places, objects are indicated in the the respective sub-elements Subject Actor Set, Subject Date Set, Subject Event Set, Subject Place Set, and Subject Object Set.Preferably taken from a published controlled vocabulary.",				
				},	
				/*
				{
					heading: "Actor Identifier",
					name: "actor_identifier",
					type: "text",
					comment: "Identifier assigned to a person, group of people.",				
				},
				*/
				{
					heading: "Subject Date",
					name: "subject_date",
					type: "text",
					comment: "Datum (JJJJ-MM-TT) oder nur Jahr",				
				},	
				{
					heading: "Subject Place",
					name: "subject_place",
					type: "text",
					comment: "Z. B. \"Bayreuth, Festspielhaus\""
				}
			],
		},
		{
			type: "column",
			title: "Event",
			name: "event",
			fields: [
				{
					heading: "Event Name",
					name: "title",
					type: "text",
					comment: "The nature of the event associated with an object / work."
				},
				{
					heading: "Event Type",
					name: "type",
					type: "text",
					//comment: "The nature of the event associated with an object / work."
				},		
				{
					heading: "Earliest Date",
					name: "earliest_date",
					type: "year"
				},
				{
					heading: "Latest Date",
					name: "latest_date",
					type: "year"
				},
				{
					heading: "Culture",
					name: "culture",
					type: "text",
					comment: "Wichtig z.B. bei Masken, Figuren"
				},
				{
					type: "subarea",
					heading: "Actor",
					name: "actor",
					fields: [
						{
							heading: "Name",
							name: "name",
							type: "text",
						},
						{
							name: "actor_id",
							type: "text",
							comment: "Actor ID taken from http://d-nb.info/gnd/",
							heading: "Actor ID (DNB File ID)"
						},
						{
							heading: "Earliest Date",
							name: "earliest_date",
							type: "year",
						},
						{
							heading: "Latest Date",
							name: "latest_date",
							type: "year",
						},
						{
							heading: "Role",
							name: "role",
							type: "text",
						},
						{
							heading: "Gender",
							name: "gender",
							type: "select",
							vocabulary: ["male", "female", "other"]
						},
					],
				}
			]
		}
	]

	
};



lido_environment.event_form = {
	name: "event",
	title: "lido-event",
	type: "form",
	fields: [
		{
			heading: "Event Name",
			name: "title",
			type: "text",
			comment: "The nature of the event associated with an object / work."
		},
		{
			heading: "Event Type",
			name: "type",
			type: "text",
			//comment: "The nature of the event associated with an object / work."
		},		
		{
			heading: "Earliest Date",
			name: "earliest_date",
			type: "year"
		},
		{
			heading: "Latest Date",
			name: "latest_date",
			type: "year"
		},
		{
			heading: "Culture",
			name: "culture",
			type: "text",
			comment: "Wichtig z.B. bei Masken, Figuren"
		},
		{
			type: "subarea",
			heading: "Actor",
			name: "actor",
			fields: [
				{
					heading: "Name",
					name: "name",
					type: "text",
				},
				{
					name: "actor_id",
					type: "text",
					comment: "Actor ID taken from http://d-nb.info/gnd/",
					heading: "Actor ID (DNB File ID)"
				},
				{
					heading: "Earliest Date",
					name: "earliest_date",
					type: "year",
				},
				{
					heading: "Latest Date",
					name: "latest_date",
					type: "year",
				},
				{
					heading: "Role",
					name: "role",
					type: "text",
				},
				{
					heading: "Gender",
					name: "gender",
					type: "select",
					vocabulary: ["male", "female", "other"]
				},				
			],
		}
	]
};
