import React, { Component } from "react";
import Loading from "./Loading";
import Panel from "./Panel";

import classnames from "classnames";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];

class Dashboard extends Component {

  constructor(){
    super()
    this.onPanelClick = this.onPanelClick.bind(this)

  }

  state = {
    loading : false,
    focus : null
  }

  onPanelClick(id){
    console.log(id)
    this.setState(previousState=> ({focus : id})); 
  }


  render() {


    const dashboardClasses = classnames("dashboard", {"dashboard--focused": this.state.focused});

    const panels = data
                        .filter( panel=> this.state.focus === null || this.state.focus === panel.id)
                        .map( panel=> <Panel key= {panel.id} {...panel} onClick={this.onPanelClick}/>)

                         
    
    if(this.state.loading){

     return <Loading/>;
     
    }

    return  (
    
    <main className={dashboardClasses}>{panels}</main> 
    
    )
  }
}

export default Dashboard;
