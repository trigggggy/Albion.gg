import React, { Component } from 'react';
import {InputGroup, FormControl, Dropdown, DropdownButton} from 'react-bootstrap';
import './App.css';
import { Redirect } from 'react-router-dom';

class Home extends Component {
    constructor(props) { //props, state의 값이 변경되면 화면이 다시 호출된다.
    
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.enterkey = this.enterkey.bind(this);
        this.state = {
          searchmode: "플레이어",
          searchcode: "Players",
          mode: "welcome",
          value: "",
          redirect: null

        }
      }
      handleChange(event) {
        this.setState({value: event.target.value});
      }
    
      enterkey() {
        if (window.event.keyCode === 13) {
            this.setState({redirect: "/search/"+this.state.searchcode+"?id="+this.state.value});
        }
    }
    
    
      
      handleClick(a){
        if (a ==='player'){
        this.setState({searchmode:'플레이어'});
        this.setState({searchcode:'Players'});
        }
        if (a ==='guild'){
          this.setState({searchmode:'길드'});
          this.setState({searchcode:'Guilds'});
        }
        if (a ==='alliance'){
            this.setState({searchmode:'연합'});
            this.setState({searchcode:'Alliances'});
        }
        console.log('this is:', a);
      }
    
      render() { //rendor()함수는 어떤 HTML을 그릴것인가를 결정하는 함수
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
    
        return (
          <div className="App">
            <header className="App-header">
          
            <img className="logo" src={require('./logo.png')} alt="logo" />
          
          <InputGroup className="searchbox">
            <DropdownButton
              as={InputGroup.Prepend}
              variant="outline-secondary"
              title={this.state.searchmode}
              id="input-group-dropdown-1"
            >
              <Dropdown.Item onClick={this.handleClick.bind(this, 'player')}>플레이어</Dropdown.Item>
              <Dropdown.Item onClick={this.handleClick.bind(this, 'guild')}>길드</Dropdown.Item>
              <Dropdown.Item onClick={this.handleClick.bind(this, 'alliance')}>연합</Dropdown.Item>
            </DropdownButton>
            <FormControl value={this.state.value} onChange={this.handleChange} onKeyUp={this.enterkey} aria-describedby="basic-addon1" />
          </InputGroup>
          </header>
          </div>
        );
      }
    }

export default Home;