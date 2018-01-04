import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from '../header';
import Footer from '../footer';
import Home from '../../routes/home';
import About from '../../routes/about';
import style from './style';
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app" className={style.main}>
				<Header />
				<div className={style.content}>
					<Router onChange={this.handleRoute} className={style.content}>
						<About path="/about" />
						{/*<Home path="/" />
						<Profile path="/profile/" user="me" />
			<Profile path="/profile/:user" />*/}
					</Router>
				</div>
				<Footer />
			</div>
		);
	}
}
