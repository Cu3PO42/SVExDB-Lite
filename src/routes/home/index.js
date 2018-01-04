import { h, Component } from 'preact';
import style from './style';

export default class Home extends Component {
	render() {
		return (
			<div class={style.home}>
				<div class={style.inputContainer}>
					<textarea wrap="soft" placeholder="Paste some Pokémon data here..." />
				</div>
			</div>
		);
	}
}
