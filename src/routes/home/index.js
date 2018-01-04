import { h, Component } from 'preact';
import style from './style';

const tsvUrl = 'https://cu3po42.github.io/SVEx-Crawler/tsvs.json';

export default class Home extends Component {
	state = {
		tsvs: undefined,
		pkm: []
	};

	componentDidMount() {
		if (typeof window !== 'undefined' && window.localStorage) {
			const data = localStorage.getItem('tsvdata');
			if (data) {
				const tsvs = JSON.parse(data);
				if (tsvs && tsvs.last_updated_at && new Date().getTime() / 1000 - tsvs.last_updated_at < 60 * 60 * 3) {
					this.setState({ tsvs });
					return;
				}
			}
			fetch(tsvUrl).then(res => res.json()).then((tsvs) => {
				this.setState({ tsvs });
				localStorage.setItem('tsvdata', JSON.stringify(tsvs));
			});
		} else {
			fetch(tsvUrl).then(res => res.json()).then((tsvs) => {
				this.setState({ tsvs });
			});
		}
	}

	handleTextChanged = (e) => {
		const lines = e.target.value
			.split(/\r?\n/)
			.filter(e => /\b\d{4}\b/.test(e))
			.map(e => e.split(/(\b\d{4}\b)/));
		this.setState({ pkm: lines });
	}

	getMatchesForPkm(pkm) {
		if (!this.state.tsvs) return [];
		return this.state.tsvs.tsvs7[pkm[1]];
	}

	render() {
		return (
			<div class={style.home}>
				<div class={style.inputContainer}>
					<textarea wrap="soft" placeholder="Paste some Pokémon data here..." onInput={this.handleTextChanged} />
				</div>
				<table class={`${style.results} ${this.state.pkm.length ? '' : style.hidden }`}>
					<tr>
						<th>Pokémon</th>
						<th>Matches</th>
					</tr>
					{this.state.pkm.map(pkm => 
						<tr>
							<td>{pkm[0]}<span class={style.tsv}>{pkm[1]}</span>{pkm[2]}</td>
							<td>
								{this.getMatchesForPkm(pkm).map(e => <a href={`https://www.reddit.com/r/SVExchange/comments/${e.link}/${pkm[1]}/`} target="_blank">/u/{e.user}</a>)}
							</td>
						</tr>
					)}
				</table>
			</div>
		);
	}
}
