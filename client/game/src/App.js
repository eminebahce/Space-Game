import React, { Component } from 'react'
import Game from "./components/Game";
import { Stage } from "react-konva";
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
  Visibility,
} from 'semantic-ui-react'

const menuStyle = {
  border: 'none',
  borderRadius: 0,
  boxShadow: 'none',
  marginBottom: '1em',
  marginTop: '1em',
  transition: 'box-shadow 0.5s ease, padding 0.5s ease',
}

const fixedMenuStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
}

const overlayStyle = {
  float: 'left',
  margin: '0em 3em 1em 0em',
}

class App extends Component {

  state = {
    menuFixed: false,
    overlayFixed: false,
  }

  stickOverlay = () => this.setState({ overlayFixed: true })
  stickTopMenu = () => this.setState({ menuFixed: true })
  unStickOverlay = () => this.setState({ overlayFixed: false })
  unStickTopMenu = () => this.setState({ menuFixed: false })

  render() {

    const { menuFixed, overlayFixed, overlayRect } = this.state

    return (
      <div className="App">

        <Visibility
          onBottomPassed={this.stickTopMenu}
          onBottomVisible={this.unStickTopMenu}
          once={false}
        >
          <Menu
            borderless
            fixed={menuFixed ? 'top' : undefined}
            style={menuFixed ? fixedMenuStyle : menuStyle}
          >
            <Container text>
              <Menu.Item>
                <Image size='mini' src='http://www.myiconfinder.com/uploads/iconsets/48-48-c1fd454e6f2511f8db1b2b906b916750.png' />
              </Menu.Item>
              <Menu.Item header>Space Battle Game</Menu.Item>
              <Menu.Item as='a'>About</Menu.Item>

              <Menu.Menu position='right'>
                <Dropdown text='Settings' pointing className='link item'>
                  <Dropdown.Menu>
                    <Dropdown.Item>Game Rules</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Header>Game</Dropdown.Header>
                    <Dropdown.Item>Start</Dropdown.Item>
                    <Dropdown.Item>Stop</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Menu>
            </Container>
          </Menu>
        </Visibility>

        <Container text>
          <Visibility
            offset={80}
            once={false}
            onTopPassed={this.stickOverlay}
            onTopVisible={this.unStickOverlay}
            style={overlayFixed ? { ...overlayStyle, ...overlayRect } : {}}
          />
        </Container>

        <div className='inner'>
          <Stage
            // className="App"
            width={window.innerWidth}
            height={window.innerHeight}
          >
            <Game />
          </Stage>
        </div>

        <Segment inverted style={{ margin: '1em 0em 0em', padding: '1em 0em' }} vertical>
          <Container textAlign='center'>
            <Grid columns={1} divided stackable inverted>
              <Grid.Row>
                <Grid.Column>
                  <Header inverted as='h4' content='Happy Team' />
                  <p>
                    This fantastic space battle game is created by Robert, Emine and Ari.
                  </p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Divider inverted section />
            <Image src='http://www.myiconfinder.com/uploads/iconsets/48-48-c1fd454e6f2511f8db1b2b906b916750.png' centered size='mini' />
            <List horizontal inverted divided link size='small'>
              <List.Item as='a' href='#'>
                Site Map
              </List.Item>
              <List.Item as='a' href='#'>
                Contact Us
              </List.Item>
              <List.Item as='a' href='#'>
                Terms and Conditions
              </List.Item>
              <List.Item as='a' href='#'>
                Privacy Policy
              </List.Item>
            </List>
          </Container>
        </Segment>
      </div>
    );
  }
}

export default App;
