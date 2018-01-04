import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';

export default class Header extends Component {
	render() {
		return (
			<header class={style.header}>
				<nav>
					<Link href="/">Database</Link>
					<Link href="/about">About</Link>
				</nav>
				<h1>SVEx DB Lite</h1>
			</header>
		);
	}
}
