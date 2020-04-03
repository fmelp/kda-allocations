import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import { Button, Grid, Input, Icon, Form, List,
   Modal, Header, Message, Popup, Select, Radio,
   Tab, TextArea, Loader } from 'semantic-ui-react';
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

  return (
    <div className="App">
      <header className="App-header">
        <img src={require("../kadena.png")} style={{height:100, marginBottom: 10}}/>
        <p>
          Investor Allocation Release Platform
        </p>
        <Form success={result().success}
              error={result().error}
              warning={result().warning}>
          <Form.Field  style={{marginTop: "0px", marginBottom: 10, width: "360px", marginLeft: "auto", marginRight: "auto"}} >
            <label style={{color: "#18A33C", textAlign: "left" }}>1. Enter Your Allocation Account Name
              <Popup
                trigger={
                  <Icon name='help circle' style={{"marginLeft": "2px"}}/>
                }
                position='top center'
              >
              <Popup.Header>What is an Allocation Account Name? </Popup.Header>
              <Popup.Content>Kadena provides an account for each month of vesting named similarly to "SA &lt;1&gt;_2" —each month has a unique identifier. Please make sure there’s a space before the "&lt;"</Popup.Content>
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
          </Form.Field>
          <Form.Field  style={{marginTop: "0px", marginBottom: 10, width: "360px", marginLeft: "auto", marginRight: "auto"}} >
            <label style={{color: "#18A33C", textAlign: "left" }}>2. Have Chainweaver wallet app open
              <Popup
                trigger={
                  <Icon name='help circle' style={{"marginLeft": "2px"}}/>
                }
                position='top center'
              >
              <Popup.Header>What is Chainweaver? </Popup.Header>
              <Popup.Content>You should already have our Chainweaver wallet downloaded as you used it to generate a public key to provide to CoinList</Popup.Content>
              </Popup>
            </label>
          </Form.Field>
          <Form.Field  style={{marginTop: "0px", marginBottom: 10, width: "360px", marginLeft: "auto", marginRight: "auto"}} >
            <label style={{color: "#18A33C", textAlign: "left", marginBottom: 10 }}>3. Press 'Release Allocation'
              <Popup
                trigger={
                  <Icon name='help circle' style={{"marginLeft": "2px"}}/>
                }
                position='top center'
              >
              <Popup.Header>What does this button do? </Popup.Header>
              <Popup.Content>It will popup Chainweaver and ask you to sign for your allocation with the key you provided to CoinList</Popup.Content>
              </Popup>
            </label>
            <Button
              disabled={acct === ""}
              style={{
              backgroundColor: "#18A33C",
              color: "white",
              width: 360,
              }}
              onClick={() => pactContext.relAll(acct)}
            >
              Release Allocation
            </Button>
          </Form.Field>
          <Form.Field  style={{marginTop: "0px", marginBottom: 10, width: "360px", marginLeft: "auto", marginRight: "auto"}} >
            <label style={{color: "#18A33C", textAlign: "left" }}>4. Sign Transaction as "Unrestricted Signing Keys"
              <Popup
                trigger={
                  <Icon name='help circle' style={{"marginLeft": "2px"}}/>
                }
                position='top center'
              >
              <Popup.Header>How do I sign for this transaction?</Popup.Header>
              <Popup.Content>In the Chainweaver popup, press 'Next' then ONLY check the box with the public key you provided to CoinList under the 'unrestrcited signing' section (leave the GAS dropdown blank). Then press 'Next' and 'Submit'</Popup.Content>
              </Popup>
            </label>
          </Form.Field>
          <Form.Field  style={{marginTop: "0px", marginBottom: 10, width: "360px", marginLeft: "auto", marginRight: "auto"}} >
            <label style={{color: "#18A33C", textAlign: "left"}}>5. Wait for funds to reach the account
              <Popup
                trigger={
                  <Icon name='help circle' style={{"marginLeft": "2px"}}/>
                }
                position='top center'
              >
              <Popup.Header>Why do I need to wait?</Popup.Header>
              <Popup.Content>The block must be mined in order for the funds to transfer. This will take 30 seconds to 2 minutes</Popup.Content>
              </Popup>
            </label>
          </Form.Field>
          <Form.Field>
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
