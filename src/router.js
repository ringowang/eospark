import React from 'react';
import dynamic from 'dva/dynamic';
import { Router, Switch } from 'dva/router';
import EosBasicLayout from './routes/layouts/EosBasicLayout';

function RouterConfig({ history , app}) {

  const IndexComponent = dynamic({
    app,
    component: () => import('./routes/Eos/Index'),
  });

  const BlockComponent = dynamic({
    app,
    component: () => import('./routes/Eos/Block'),
  });

  const AddressComponent = dynamic({
    app,
    component: () => import('./routes/Eos/Address'),
  });

  const BlockProducerComponent = dynamic({
    app,
    component: () => import('./routes/Eos/BlockProducer'),
  });

  const TradeComponent = dynamic({
    app,
    component: () => import('./routes/Eos/Trade'),
  });

  const AccountComponent = dynamic({
    app,
    component: () => import('./routes/Eos/Account'),
  });

  return (
    <Router history={history}>
      <Switch>
        <EosBasicLayout path="/" exact component={IndexComponent} />
        <EosBasicLayout path="/mainnet" exact component={IndexComponent} />
        <EosBasicLayout path="/testnet" exact component={IndexComponent} />

        <EosBasicLayout path="/mainnet/block/:id" exact component={BlockComponent} />
        <EosBasicLayout path="/testnet/block/:id" exact component={BlockComponent} />

        <EosBasicLayout path="/mainnet/address/:id" exact component={AddressComponent} />
        <EosBasicLayout path="/testnet/address/:id" exact component={AddressComponent} />

        <EosBasicLayout path="/mainnet/bp/:id" exact component={BlockProducerComponent} />
        <EosBasicLayout path="/testnet/bp/:id" exact component={BlockProducerComponent} />

        <EosBasicLayout path="/mainnet/tx/:id" exact component={TradeComponent} />
        <EosBasicLayout path="/testnet/tx/:id" exact component={TradeComponent} />

        <EosBasicLayout path="/mainnet/account/:id" exact component={AccountComponent} />
        <EosBasicLayout path="/testnet/account/:id" exact component={AccountComponent} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
