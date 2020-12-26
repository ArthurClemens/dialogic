// import { Component } from 'solid-js';
import { render } from 'solid-js/web';
import './styles.css';

const App = () => {
  return <div>Hello</div>;
};

const rootNode = document.getElementById('root');

if (rootNode) {
  render(() => <App />, rootNode);
}
