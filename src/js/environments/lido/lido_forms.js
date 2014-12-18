lido_environment.start_form = {

	title: "lido-start",
	type: "form",
	fields: [
		{
			heading: "Source",
			name: "source",
			type: "text",
			comment: "Source of the information given here. This is probably you or your institution.",
			default_value: "Theaterwissenschaftliche Sammlung Schloss Wahn"
		},
		{
			heading: "ID",
			name: "object_id",
			type: "text",
			comment: "Identifier of this object. Maybe something like DE-Wahn2014/lido-obj00154983"
		},
		{
			heading: "Legal Body",
			name: "legal_body",
			type: "textarea",
			default_value: "Theaterwissenschaftliche Sammlung, Universität zu Köln\nGrafikabteilung, Theaterwissenschaftliche Sammlung, Universität zu Köln\nSzenische Grafik ,Grafikabteilung, Theaterwissenschaftliche Sammlung, Universität zu Köln"
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
	]

};


lido_environment.object_form = {

	title: "lido-object",
	type: "form",
	fields: [
		{
			type: "column",
			heading: "Object Classification",
			fields: [
				{
					heading: "Titles (one value per line)",
					name: "title",
					type: "textarea",
				},
				{
					heading: "Legal Body",
					name: "legal_body",
					type: "textarea",
					default_value: "Theaterwissenschaftliche Sammlung, Universität zu Köln\nGrafikabteilung, Theaterwissenschaftliche Sammlung, Universität zu Köln\nSzenische Grafik ,Grafikabteilung, Theaterwissenschaftliche Sammlung, Universität zu Köln"
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
				}
			]
		},
		{
			type: "column",
			heading: "Object Relation",
			name: "object_relation",
			fields: [
				{
					heading: "Display Subject",
					name: "display_subject",
					type: "textarea",
					comment: "Kurzbeschreibung \"Worum gehts?\", \"Was/Wenn dokumentiert das Objekt?\"",				
				},
				{
					heading: "Actor Identifier",
					name: "actor_identifier",
					type: "text",
					comment: "Identifier assigned to a person, group of people.",				
				},
				{
					type: "subarea",
					heading: "Event",
					name: "event",
					fields: []
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
					name: "actor_name",
					type: "text",
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
			],
		}
	]
};
