export const fontFaces = {
	body: `'Roboto', sans-serif`,
	header: `'Merriweather', serif`
};

export const fontSizes = {
	xsmall: '14px',
	small: '14px',
	medium: '15px',
	large: '16px',
	xlarge: '17px',
	xxlarge: '18px',
	lowheight: '14px'
};

export const headerSizesMobile = {
	h1: '50px',
	h2: '44px',
	h3: '26px',
	h4: '22px',
	h5: '20px',
	h6: '18px'
};

export const headerSizes = {
	h1: '50px',
	h2: '54px',
	h3: '38px',
	h4: '30px',
	h5: '26px',
	h6: '22px',
	h7: '20px',
	h8: '18px'
};

export const fontWeights = {
	light: 300,
	normal: 400,
	medium: 500,
	bold: 700,
	extrabold: 800
};

export const colors = {
	primary: '#bd9b60', // gold
	secondary: '#00292e', // dark (green)
	tertiary: '#00292e', // green
	accent: '#a76e5e', // red/pink/brown-ish
	fadedPrimary: '#204038',
	fadedSecondary: '#214549',
	fadedX2Secondary: '#4D6A6D',

	header: '#000000', // prev: 00292e
	text: '#000000',
	success: 'green',
	warning: 'yellow',
	error: 'red',

	dark: '#000000', // prev: 00292e
	medium: '#656565', // psd
	grey: '#bbbcbc', // profile
	light: '#d9d9d6', // profile
	white: '#ffffff', // profile

	facebook: '#3b5998',
	messenger: '#0084ff',
	twitter: '#1da1f2',
	youtube: '#bb0000',

	darkLogo: '#002a31',
	darkLink: '#003338',
	darkHover: '#002a31'
};

export const mediaSizes = {
	xsmall: 300, // small phones
	small: 360, // phablets
	medium: 768, // ipad portrait
	large: 1024, // ipad landscape and small laptops
	xlarge: 1441, // laptops
	xxlarge: 1921, // high res screens and monitors

	lowheight: 760 // small laptops
};

export const metrics = {
	// mainTop: 50,
	navigationHeight: 47,
	wrapper: 1470,
	innerWrapper: 1200,
	moduleSpacer: {
		small: 30,
		large: 45
	},
	margin: {
		small: 10,
		medium: 25,
		large: 30
	},
	icons: {
		small: 16,
		medium: 22,
		large: 28
	},
	close: {
		size: 50,
		x: 20,
		y: 20
	},
	sideModule: 425,
	footerHeight: 70
};

export const images = {
	sharing: {
		small: '/static/images/sharing.jpg',
		medium: '/static/images/sharing.jpg',
		large: '/static/images/sharing.jpg'
	},
	details: {
		small: '/static/images/details.jpg',
		medium: '/static/images/details.jpg',
		large: '/static/images/details.jpg'
	},
	marbel: {
		small: '/static/images/marbel.jpg',
		medium: '/static/images/marbel.jpg',
		large: '/static/images/marbel.jpg'
	}
};

export default {
	fontFaces,
	fontSizes,
	headerSizesMobile,
	headerSizes,
	fontWeights,
	colors,
	mediaSizes,
	metrics,
	images
};
