import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';

export default class Header extends Component {
	render() {
		return (
			<header class={style.header}>
				<nav>
					<Link href={PUBLIC_PATH}>Database</Link>
					<Link href={PUBLIC_PATH + 'about'}>About</Link>
				</nav>
				<h1>SVEx DB Lite</h1>
			</header>
		);
	}
}
