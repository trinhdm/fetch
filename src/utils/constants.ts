import type { SidebarValues, SortField, User } from '@typings/shared'


export const USER_DEFAULTS: User = {
	name: '',
	email: '',
	isLoggedIn: false,
	favorites: [],
	match: {},
}

export const SIDEBAR_DEFAULTS: SidebarValues = {
	filter: {
		ages: [],
		breeds: [],
	},
	geolocation: {
		city: '',
		distance: '',
		state: '',
	},
	sort: {
		category: 'Breed',
		order: 'Ascending',
	},
	total: {
		items: 0,
		pages: 1,
	},
	view: {
		layout: 'Grid',
		size: 24,
	},
}

export const AGE_OPTIONS = [
	'Puppy (0-1)',
	'Adolescent (2-3)',
	'Adult (4-7)',
	'Senior (8+)',
]

export const SORT_OPTIONS: SortField[] = [
	'Age',
	'Breed',
	'Name',
]

export const SORT_ORDER = [
	'Ascending',
	'Descending',
]

export const VIEW_OPTIONS = [
	'Grid',
	'List',
]


export const MILE_RADIUSES = {
	'Anywhere': '\u00A0',
	'5 miles': 5,
	'10 miles': 10,
	'25 miles': 25,
	'50 miles': 50,
}

export const USA_STATES = {
	'State': '\u00A0',
	AK: 'Alaska' ,
	AL: 'Alabama',
	AR: 'Arkansas',
	AS: 'American Samoa',
	AZ: 'Arizona',
	CA: 'California',
	CO: 'Colorado',
	CT: 'Connecticut',
	DC: 'District of Columbia',
	DE: 'Delaware',
	FL: 'Florida',
	GA: 'Georgia',
	GU: 'Guam',
	HI: 'Hawaii',
	IA: 'Iowa',
	ID: 'Idaho',
	IL: 'Illinois',
	IN: 'Indiana',
	KS: 'Kansas',
	KY: 'Kentucky',
	LA: 'Louisiana',
	MA: 'Massachusetts',
	MD: 'Maryland',
	ME: 'Maine',
	MI: 'Michigan',
	MN: 'Minnesota',
	MO: 'Missouri',
	MP: 'Northern Mariana Islands',
	MS: 'Mississippi',
	MT: 'Montana',
	NC: 'North Carolina',
	ND: 'North Dakota',
	NE: 'Nebraska',
	NH: 'New Hampshire',
	NJ: 'New Jersey',
	NM: 'New Mexico',
	NV: 'Nevada',
	NY: 'New York',
	OH: 'Ohio',
	OK: 'Oklahoma',
	OR: 'Oregon',
	PA: 'Pennsylvania',
	PR: 'Puerto Rico',
	RI: 'Rhode Island',
	SC: 'South Carolina',
	SD: 'South Dakota',
	TN: 'Tennessee',
	TT: 'Trust Territories',
	TX: 'Texas',
	UT: 'Utah',
	VA: 'Virginia',
	VI: 'Virgin Islands',
	VT: 'Vermont',
	WA: 'Washington',
	WI: 'Wisconsin',
	WV: 'West Virginia',
	WY: 'Wyoming',
}
