import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import { Button, Grid, Input, Icon, Form, List,
   Modal, Header, Message, Popup, Select, Radio,
   Tab, TextArea, Loader, Step } from 'semantic-ui-react';

import PactContext from "../contexts/PactContext";

function Home() {

  const chainOptions = [
    { value: '0', text: '0' },
    { value: '1', text: '1' },
    { value: '2', text: '2' },
    { value: '3', text: '3' },
    { value: '4', text: '4' },
    { value: '5', text: '5' },
    { value: '6', text: '6' },
    { value: '7', text: '7' },
    { value: '8', text: '8' },
    { value: '9', text: '9' },
  ]

  const pactContext = useContext(PactContext);
  const result = pactContext.status
  const [acct, setAcct] = useState("");
  const [chain, setChain] = useState("");

  return (
    <div className="App">
      <header className="App-header">
        <img src={require("../kadena.png")} style={{height:100, marginBottom: 10}}/>
        <h1>
          Investor Allocation Release Tool
        </h1>
        <h5>This is a simplified method for investors to release their monthly vesting token allocations.
        </h5>
        <h5 style={{marginTop: -5, fontWeight: "normal", fontStyle: "italic"}}>
        *In order to use this tool, the keypair associated with your allocation accounts must have been generated within Chainweaver.
        </h5>
        <Form success={result().success}
              error={result().error}
              warning={result().warning}>

          <Form.Field  style={{marginTop: "0px", marginBottom: 10, width: "360px", marginLeft: "auto", marginRight: "auto"}} >
            <label style={{color: "#18A33C", textAlign: "left" }}>1. Enter the Account Name and Chain ID for the month’s allocation
              <Popup
                trigger={
                  <Icon name='help circle' style={{"marginLeft": "2px"}}/>
                }
                position='top center'
              >
                <Popup.Header>What is an Allocation Account Name? </Popup.Header>
                <Popup.Content>{`Investors have a unique account name for each month that allocations vest. The account name format is similar to “SA <1>_2” and please note there is a space before the “<” character.`}</Popup.Content>
              </Popup>
            </label>
            <Form.Input
              style={{width: "360px"}}
              icon='user'
              iconPosition='left'
              placeholder='Account Name'
              value={acct}
              onChange={(e) => setAcct(e.target.value)}
            />
            <Select
             // iconPosition='left'
             // icon='chain'
             style={{width: "360px"}}
             placeholder='Chain ID'
             value={chain}
             options={chainOptions}
             onChange = {(e, v) => setChain(v.value)}
           />
          </Form.Field>

          <Form.Field  style={{marginTop: "0px", width: "360px", marginLeft: "auto", marginRight: "auto"}} >
            <label style={{color: "#18A33C", textAlign: "left" }}>2. Open and unlock your Chainweaver wallet (must be on version 1.3 or greater, upgrade <a href="https://www.kadena.io/chainweaver"><b>here</b></a>
            </label>
          </Form.Field>
          <Form.Field  style={{ width: "360px", marginLeft: "auto", marginRight: "auto"}} >
            <label style={{color: "#18A33C", textAlign: "left", marginBottom: 10 }}>3. Select the “Release Allocation” button below </label>
          </Form.Field>
          <Form.Field style={{marginTop: 10, marginBottom: 10, width: "360px", marginLeft: "auto", marginRight: "auto"}}  >
            <Button
              disabled={acct === ""}
              style={{
              backgroundColor: "#18A33C",
              color: "white",
              width: 360,
              }}
              onClick={() => pactContext.relAll(acct, chain)}
            >
              Release Allocation
            </Button>
          </Form.Field>
          <Form.Field>
          <p style={{marginBottom:-10}}>
          Once pressed, Chainweaver should pop up with a transaction Signing Request:
          </p>
            <Step.Group>
              <Step style={{width:320}}>
                <Step.Content>
                  <Step.Description>On the <b>Configuration</b> tab: <br/>In the Settings section, change the Gas Price to 0.00001. Do not change any other transaction settings. Press "Next"</Step.Description>
                </Step.Content>
              </Step>

              <Step  style={{width:320}}>
                <Step.Content>
                  <Step.Description>On the <b>Sign</b> tab: <br/>In the Grant Capabilities section, leave the Account dropdown field blank. In the Unrestricted Signing Keys section, check the box beside your allocation account’s public key. Press “Next”</Step.Description>
                </Step.Content>
              </Step>

              <Step  style={{width:320}}>
                <Step.Content>
                  <Step.Description>On the <b>Preview</b> tab:<br/> Scroll down to the Raw Response section. If you see "Allocation successfully released to main ledger" then press “Submit.” If you see an error message then reach out to <a href = "mailto: gtm-ops@kadena.io">gtm-ops@kadena.io</a> for support.</Step.Description>
                </Step.Content>
              </Step>
            </Step.Group>
            </Form.Field>
          <Form.Field  style={{marginTop: "0px", marginBottom: 10, width: "360px", marginLeft: "auto", marginRight: "auto"}} >
            <label style={{color: "#18A33C", textAlign: "left"}}>4. Refresh your Account balance in Chainweaver to verify completion
              <Popup
                trigger={
                  <Icon name='help circle' style={{"marginLeft": "2px"}}/>
                }
                position='top center'
              >
              <Popup.Header>Why do I need to wait?</Popup.Header>
              <Popup.Content>Upon signing and submitting the allocation release transaction, wait up to 2 minutes for the transaction to be mined in a block. Then press the “Refresh” button in Chainweaver to see your updated account balance.</Popup.Content>
              </Popup>
            </label>
          </Form.Field>
          <Form.Field style={{width: 500, margin: "auto"}}>
            <Message
              success={result().success}
              warning={result().warning}
              error={result().error}
              hidden={result().hidden}
            >
              <Message.Header>{result().header}</Message.Header>
              <div>{result().content}</div>
            </Message>
          </Form.Field>
        </Form>
      </header>
    </div>
  );
}

export default Home;
