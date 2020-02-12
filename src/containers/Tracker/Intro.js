import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { rem } from 'polished';

// import P from 'components/P';
import { fontFaces, fontSizes, colors } from 'styles/index';
import appConfig from 'app.config';

gsap.registerPlugin(SplitText);

const Container = styled.div`

`;

const Text = styled.p`
	font-family: ${fontFaces.header};
	font-size: ${rem(fontSizes.large)};
	color: ${colors.text};
	line-height: 1.8;

	padding: 0 ${rem('25px')};
	margin: 0;
	display: none;
`;

export default class Intro extends PureComponent {
	constructor (props) {
		super(props);

		this.state = {
			sdkLoaded: false
		};

		this.$text1 = React.createRef();
		this.$text2 = React.createRef();
		this.$text3 = React.createRef();
		this.$text4 = React.createRef();
		this.$text5 = React.createRef();

		// this._loaded = this._loaded.bind(this);
	}

	componentDidMount () {
		this._tl([this.$text1.current, this.$text2.current, this.$text3.current, this.$text4.current, this.$text5.current]);
	}

	componentDidUpdate ({ sdkLoaded }) {
		if (sdkLoaded !== this.props.sdkLoaded && this.props.sdkLoaded === true) {
			this.introTimeline.play();
		}
	}

	_tl ($elements) {
		this.introTimeline = gsap.timeline({
			paused: true,
			onComplete: this.props.onComplete
		});

		this.introTimeline.timeScale(30);

		for (let i = 0; i < $elements.length; i++) {
			const $element = $elements[i];

			const splitText = new SplitText($element, { type: 'words', wordsClass: 'word word++' });
			// const wordsCount = splitText.words.length;

			const tl = gsap.timeline()
			.set($element, { display: 'block' })
			.from(splitText.words, { duration: 3, opacity: 0, y: 3, ease: 'power2', stagger: 0.1 }, 'words')
			.to(splitText.words, { duration: 0.2, opacity: 0, ease: 'power2', stagger: 0.1 }) // , 'words+=2'
			.set($element, { display: 'none' });

			this.introTimeline.add(tl);
		}
	}

	// render () {
	// 	return (
	// 		<Container>
	// 			<Text ref={this.$text1}>In a world where <strong>our attention span constantly get shorter</strong>, and the fight for it gets bigger.</Text>
	// 			<Text ref={this.$text2}>We don’t take the time to <strong>listen to music</strong> as we used to.</Text>
	// 			<Text ref={this.$text3}>So <strong>{appConfig.ARTIST_NAME}</strong> would like you to get the full experience of the new song <strong>{appConfig.SONG_TITLE}</strong>.</Text>
	// 			<Text ref={this.$text4}>But there is <strong>one catch</strong>...</Text>
	// 			<Text ref={this.$text5}>You need to <strong>close your eyes</strong> to listen.</Text>
	// 		</Container>
	// 	);
	// }

	render () {
		return (
			<Container>
				<Text ref={this.$text1}>I en verden hvor <strong>kampen om vår oppmerksomhet</strong> bare blir større.</Text>
				<Text ref={this.$text2}>Så tar vi oss ikke tid til <strong>å faktisk lytte til musikk</strong>.</Text>
				<Text ref={this.$text3}><strong>{appConfig.ARTIST_NAME}</strong> vil at du skal få en fullverdig opplevelse av det nye albumet <strong>{appConfig.SONG_TITLE}</strong>.</Text>
				<Text ref={this.$text4}>Men det er <strong>en hake</strong>...</Text>
				<Text ref={this.$text5}>Du må <strong>lukke øyene</strong> for å lytte til musikken.</Text>
				{/* <Text ref={this.$text5}>Du må <strong>være på Festiviteten og lukke øyene</strong> for å lytte til musikken.</Text> */}
			</Container>
		);
	}
}
