import React, { Component } from 'react';



class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            winnerdata: '',
            loserdata: ''

        }
      }

    componentDidMount() {
        this.callwinnerApi()
        .then(res => this.setState({winnerdata: res}))
        .catch(err => console.log(err));

        this.callloserApi()
        .then(res => this.setState({loserdata: res}))
        .catch(err => console.log(err));
    }
    callwinnerApi = async () => {
        const response = await fetch('/api/'+this.props.battleId+'/'+this.props.winnerG+'/'+this.props.winnerId);
        const body = await response.json();
        return body;
    }

    callloserApi = async () => {
        const response = await fetch('/api/'+this.props.battleId+'/'+this.props.loserG+'/'+this.props.loserId);
        const body = await response.json();
        return body;
    }
    render() {
        return(
        <div className="detail">
        <table>
            <thead>
              <tr>
                <th className="winning_group">{this.props.winner}</th>
                <th className="losing_group">{this.props.loser}</th>
              </tr>
            </thead>
            <tbody>
            <td className="winners">            
                      <table className="groups">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>K/D</th>
                            </tr>
                        </thead>
                        <tbody>
                        
        {this.state.winnerdata ? this.state.winnerdata.map(c => {return <tr><td>{c.name}</td><td>{c.kd}</td></tr>}) : ''}
                        </tbody>
                    </table>
                </td>
                <td className="winners">            
                      <table className="groups">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>K/D</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.loserdata ? this.state.loserdata.map(c => {return (<tr><td>{c.name}</td><td>{c.kd}</td></tr>)}) : ''}
                        </tbody>
                    </table>
                </td>
            </tbody>
            </table>
            </div>
        );
    }
}

class Box extends Component {

    constructor(props) {
        super(props)
        this.state = {
            toggle: false,
            customers: '',
            winner:'',
            loser:''

        }
        this.setToggle = this.setToggle.bind(this);
      }
    
      setToggle(){
        this.setState({
            toggle: !this.state.toggle
        })
      }

    render() {
        if(!this.props.data){
            return ''
        }

        
    //    var board = [];
        return (
            <React.Fragment>
                <div className="list_box">
                <div className="content">
                    <div className="battle_info">
                        {this.props.data.time}
                        <br />
                        {this.props.data.battleId}
                        <hr />
                        win
                    </div>
                <div className="divider"></div>
                <div className="winner_info">
                    <b>{this.props.data.winner}</b>
                    <br />
                    <span className="icon-running-solid"></span> : {this.props.data.winnerCount}
                    <br />
                    <span className="icon-fight"></span> : {this.props.data.winnerKills}
                    <br />
                    <span className="icon-skull"></span> : {this.props.data.winnerDeaths}

                </div>
                <div className="vs">
                    vs
                </div>
                <div className="loser_info">
                    <span>
                        <div className="group_name"><b>{this.props.data.loser}</b></div>
                        <span className="icon-running-solid"></span> : {this.props.data.loserCount}
                        <br />
                        <span className="icon-fight"></span> : {this.props.data.loserKills}
                        <br />
                        <span className="icon-skull"></span> : {this.props.data.loserDeaths}
                    </span>
                </div>
            </div>
            {this.state.toggle ? <Detail battleId={this.props.data.battleId} winner={this.props.data.winner} loser={this.props.data.loser} winnerG={this.props.data.winnerG} winnerId={this.props.data.winnerId} loserG={this.props.data.loserG} loserId ={this.props.data.loserId}/> : ''}
            
            <a className="expand" href="#" onClick={this.setToggle}>EXPAND</a>
        </div>
            </React.Fragment>
        );
    }
}

export default Box;