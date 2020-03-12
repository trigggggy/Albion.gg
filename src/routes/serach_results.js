import React, { Component } from 'react';
import './search_result.css';
import './box.css';
import './style.css';
import Box from './Box.js'


class Result extends Component {
    state = {
        customers: ''
    }
        
    componentDidMount() {
        this.callApi()
        .then(res => this.setState({customers: res}))
        .catch(err => console.log(err));
    }
    callApi = async () => {
        const response = await fetch('/api/'+this.props.match.params.type+'/'+new URLSearchParams(this.props.location.search).get('id'));
        const body = await response.json();
        return body;
    }
            

    search(){

    }

    render() {
        return (
            <React.Fragment>
                <div className="info">
                    asdasd
                </div>
                <div className="list">
                    <p>type: {this.props.match.params.type}</p>
                    <p>value: {new URLSearchParams(this.props.location.search).get('id')}</p>
                        {this.state.customers ? this.state.customers.map(c => {return <Box key={c.battleId} battle_id={c.battleId} data={c}/>}) : ''}

                </div>
            </React.Fragment>
        )
    }
}

export default Result;