import { h } from 'preact';
import style from './style';

export default () => (
    <article className={style.about}>
        <h3>About SVEx DB Lite</h3>
        This is a small replacement for the now disfunct SVExDB.
        <br />
        The data used is updated every three hours and is available <a href="https://cu3po42.github.io/SVEx-Crawler/tsvs.json" target="_blank">here</a> if you want tou use it yourself.
        <h3>Reporting issues</h3>
        If you notice an issue or have questions, please open an issue on <a href="https://github.com/Cu3PO42/SVExDB-Lite/issues" target="_blank">GitHub</a>.
        <br />
        Please consider leaving a <a href="https://github.com/Cu3PO42/SVExDB-Lite/stargazers" target="_blank">star</a> as well, I would greatly appreciate it.
    </article>
);