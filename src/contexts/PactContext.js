import React from 'react';
import Pact from 'pact-lang-api';
import { Icon } from 'semantic-ui-react'

const Context = React.createContext();

const hosts = ["us1", "us2"]
const createAPIHost = (network, chainId) => `https://${network}.tn1.chainweb.com/chainweb/0.0/development/chain/${chainId}/pact`

export class PactStore extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reqKey: "",
      requestState: 0,
      response: "",
      error: ""
    };
  }

  renderRes = (res) => {
    if (res.result && res.result.status === "failure") {
      return {
        header: "Result: Failure",
        content: <div><br/>
                   <p><b>Request Key:</b> {res.reqKey}</p>
                   <p><b>Block Height:</b> {res.metaData.blockHeight}</p>
                   <p><b>Block Hash:</b> {res.metaData.blockHash}</p>
                   <p><b>Result:</b> {JSON.stringify(res.result.error.message)}</p>
                 </div>,
        hidden: false,
        warning: true
      }
    } else if (res.result && res.result.status === "success"){
      return {
        header: "Result: Success",
        content: <div><br/>
                   <p><b>Request Key:</b> {res.reqKey}</p>
                   <p><b>Block Height:</b> {res.metaData.blockHeight}</p>
                   <p><b>Block Hash:</b> {res.metaData.blockHash}</p>
                   <p><b>Result:</b> {JSON.stringify(res.result.data)}</p>
                   <p>Check Your Balance <a href="https://balance.chainweb.com"><b>here</b></a></p>
                 </div>,
        hidden: false,
        success: true
      }
    } else {
      return {
        header: "Result",
        content: JSON.stringify(res),
        hidden: false,
        warning: true
      }
    }
  }

  loading = (reqKey) => {
    return (
      <div>
        <p>
          <br/>
          {reqKey}
          <br/>
          <br/>
          Listening for result...
          <br/>
          <Icon loading name='circle notch'/>
        </p>
      </div>
    )
  }

  status = () => {
    const requestContent = {
      0: {header: "", content: "", hidden: true},
      1: {header: "Sign your Wallet", content: <p>
      1. In the Chainweaver popup, press 'Next'. <br/>2. ONLY check the box with the public key you provided to CoinList<br/> under the 'unrestrcited signing' section. (Leave GAS dropdown BLANK).<br/>3. Then press 'Next' and 'Submit'"</p>, hidden: false},
      2: {header: "Sign Completed", content: this.state.reqKey, hidden: false},
      3: {header: "Sending TX" , content: this.state.reqKey, hidden: false},
      4: {header: "Request Key", content: this.loading(this.state.reqKey), hidden: false},
      5: this.renderRes(this.state.response),
      6: {header: "Error", content: this.state.error, error:true, hidden: false}
    }
    return requestContent[this.state.requestState];
  }

  relAll = async (acct, chainId) => {
    try {
      const signCmd = {
          pactCode: `(coin.release-allocation ${JSON.stringify(acct)})`,
          caps: [
          ],
          sender: "allocation-gas",
          gasLimit: 430,
          gasPrice: 0.000000000001,
          chainId: chainId,
          ttl: 600,
          envData: {}
        }
        //Wallet Open
        this.setState({requestState: 1});
        Pact.wallet.sign(signCmd).then(cmd => {
          //Wallet Signed && request Sent
          this.setState({requestState: 2});
          return fetch(`${createAPIHost(hosts[0], chainId)}/api/v1/send`, {
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({"cmds": [cmd]})
          });
        }).then(async res => {
          let reqKey
          if (res.ok){
            reqKey = await res.json();
          } else {
             let resTEXT = await res.text()
             console.log(resTEXT)
            throw resTEXT;
          }
          return reqKey
        }).then(reqKey => {
          //RequestKey Fetched
          this.setState({reqKey: reqKey.requestKeys[0], requestState: 3})
          return reqKey.requestKeys[0]
        }).then(reqKey => {
          //Listening for result
          this.setState({requestState: 4})
          return Pact.fetch.listen({"listen": reqKey }, createAPIHost(hosts[0], chainId))
        }).then(res => {
          //Result came back
          console.log(res)
          this.setState({requestState: 5, response: res})
          console.log(this.state.response)
          return res
        }).then(res => {
          this.setState({requestState: 5, response: res})
          console.log("why are you reloading")
        }).catch(e => {
          //Error
          console.log(e)
          if (e=== "Error in $.cmds[0]: parsing Command failed, expected Object, but encountered Null"){
            this.setState({requestState: 6, error: "Signing was unsuccessful"})
          } else if (typeof e === "object"){
            this.setState({requestState: 6, error: "Open your wallet"})
            console.log("error" +  e)
          } else this.setState({requestState: 6, error: e})
        })

    } catch(err){
      console.log(err);
      alert("you cancelled the TX or you did not have the wallet app open")
      // window.location.reload();
    }
  }

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          relAll: this.relAll,
          status: this.status
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }

}

export default Context;
