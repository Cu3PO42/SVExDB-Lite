import { h, Component } from 'preact';
import style from './style';

const tsvUrl = 'https://cu3po42.github.io/SVEx-Crawler/tsvs.json';

export default class Home extends Component {
	state = {
		tsvs: undefined,
		pkm: [],
		filteredPkm: [],
		showWoMatch: false,
		gen7: true,
		filterUser: ""
	};

	componentDidMount() {
		if (typeof window !== 'undefined' && window.localStorage) {
			const data = localStorage.getItem('tsvdata');
			if (data) {
				const tsvs = JSON.parse(data);
				this.setState({ tsvs });
				if (tsvs && tsvs.last_updated_at && new Date().getTime() / 1000 - tsvs.last_updated_at < 60 * 60 * 3) {
					return;
				}
			}
			fetch(tsvUrl).then(res => res.json()).then((tsvs) => {
				this.setState({ tsvs });
				localStorage.setItem('tsvdata', JSON.stringify(tsvs));
			}).catch(() => null);
		} else {
			fetch(tsvUrl).then(res => res.json()).then((tsvs) => {
				this.setState({ tsvs });
			});
		}
	}

	updatePkm(text) {
		const lines = text
			.split(/\r?\n/)
			.filter(e => /\b\d{4}\b/.test(e))
			.map(e => e.split(/(\b\d{4}\b)/));
		this.setState({
			pkm: lines,
			filteredPkm: this.calculateFilteredPkm(lines, this.state.gen7, this.state.filterUser)
		 });
	}

	calculateFilteredPkm(pkm, gen7, filterUser) {
		return pkm.filter(e => {
			const matches = this.getMatchesForPkm(e, gen7);
			return (filterUser ? matches.filter(e => e.user === filterUser) : matches).length;
		});
	}

	handleTextChanged = (e) => {
		this.updatePkm(e.target.value);
	}

	handleShowChange = (e) => {
		this.setState({ showWoMatch: e.target.checked })
	}

	handleGen6Change = (e) => {
		this.setState({ gen7: false });
		this.setState({ filteredPkm: this.calculateFilteredPkm(this.state.pkm, false, this.state.filterUser) })
	}

	handleGen7Change = (e) => {
		this.setState({ gen7: true });
		this.setState({ filteredPkm: this.calculateFilteredPkm(this.state.pkm, true, this.state.filterUser) })
	}

	handleUsernameChange = (e) => {
		const name = e.target.value.match(/^(?:\/?u\/)?(.*)$/)[1];
		if (name === '' && e.target.value.match(/^\/?u\/$/)) {
			this.setState({
				filteredUser: '',
				filteredPkm: []
			});
		} else {
			this.setState({ 
				filterUser: name,
				filteredPkm: this.calculateFilteredPkm(this.state.pkm, this.state.gen7, name)
			});
		}
	}

	handleDrop = (e) => {
		e.stopPropagation();
		e.preventDefault();
		console.log(e);
		if (e.dataTransfer.files[0]) {
			const file = e.dataTransfer.files[0];
			const fileReader = new FileReader();
			fileReader.onload = (ev) => { 
				const text = ev.target.result;
				e.target.value = text;
				this.updatePkm(text);
			};
			fileReader.readAsText(file);
		}
		console.log(e);
	}

	getMatchesForPkm(pkm, gen7) {
		if (!this.state.tsvs) return [];
		return (gen7 ? this.state.tsvs.tsvs7 : this.state.tsvs.tsvs6)[+pkm[1]];
	}

	getPkm() {
		return this.state.showWoMatch ? this.state.pkm : this.state.filteredPkm;
	}

	render() {
		const tsv6Count = this.state.tsvs ? this.state.tsvs.tsvs6.filter(e => e.length && e.some(f => !f.archived)).length : 0;
		const tsv7Count = this.state.tsvs ? this.state.tsvs.tsvs7.filter(e => e.length && e.some(f => !f.archived)).length : 0;
		return (
			<div class={style.home}>
				<div class={style.topWrapper}>
					<div class={style.settings}>
						<h3>Settings</h3>
						<label>
							<input type="checkbox" onChange={this.handleShowChange} />
							Show Pokémon without matches
						</label>
						<br />
						<label>
							<input type="radio" name="gen" onChange={this.handleGen6Change} />
							Generation 6
						</label>
						<label>
							<input type="radio" name="gen" defaultChecked onChange={this.handleGen7Change} />
							Generation 7
						</label>
						<br />
						<input type="text" name="username" placeholder="Limit results to this username" onInput={this.handleUsernameChange} />
					</div>
					<div class={style.statistics}>
						<h3>Statistics</h3>
						TSV6: <span class={style.invisible}>{'0000'.slice((""+tsv6Count).length)}</span>{tsv6Count} / 4096
						<br />
						TSV7: <span class={style.invisible}>{'0000'.slice((""+tsv7Count).length)}</span>{tsv7Count} / 4096
					</div>
				</div>
				<div class={style.inputContainer}>
					<textarea wrap="soft" placeholder="Paste some Pokémon data here or drag & drop a dump..." onInput={this.handleTextChanged} onDrop={this.handleDrop} />
				</div>
				<table class={`${style.results} ${this.state.pkm.length ? '' : style.hidden }`}>
					<tr>
						<th>Pokémon</th>
						<th>Matches</th>
					</tr>
					{this.getPkm().map(pkm => 
						<tr class>
							<td>{pkm[0]}<span class={style.tsv}>{pkm[1]}</span>{pkm[2]}</td>
							<td>
								{this.getMatchesForPkm(pkm, this.state.gen7).map(e =>
									<div>
										<a href={`https://www.reddit.com/r/SVExchange/comments/${e.link}/${pkm[1]}/`} target="_blank">/u/{e.user}</a>
										{e.archived ? ' (recently archived)' : null}
									</div>
								)}
							</td>
						</tr>
					)}
				</table>
			</div>
		);
	}
}
