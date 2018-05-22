import dva from 'dva';
import 'babel-polyfill';
import './index.css';
import { browserHistory } from 'dva/router';
// const app = dva({
//   history: browserHistory,
// });

import { createBrowserHistory as createHistory } from 'history';

const app = dva({
  history: createHistory()
});

// 1. Initialize
//const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/eos'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
