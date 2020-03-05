import React from 'react';
import Pact from 'pact-lang-api';

const Context = React.createContext();

const hosts = ["us-e1", "us-e2"]
const createAPIHost = (network, chainId) => `https://${network}.chainweb.com/chainweb/0.0/mainnet01/chain/${chainId}/pact`

export class PactStore extends React.Component {

  relAll = async (acct) => {
    try {
      const signCmd = {
          pactCode: `(coin.release-allocation ${JSON.stringify(acct)})`,
          caps: [
          ],
          sender: acct,
          gasLimit: 5000,
          gasPrice: 0.000000001,
          chainId: "0",
          ttl: 28800,
          envData: {}
        }
      const cmd = await Pact.wallet.sign(signCmd)
      const reqKey = await Pact.wallet.sendSigned(cmd, createAPIHost(hosts[0], "0"))
    } catch(err){
      console.log(err);
      alert("you cancelled the TX or you did not have the wallet app open")
      window.location.reload();
    }
  }

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          relAll: this.relAll
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }

}

export default Context;
