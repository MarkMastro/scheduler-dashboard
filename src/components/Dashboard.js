import React, { Component } from "react";
import Loading from "./Loading";
import Panel from "./Panel";

import axios from "axios";

import classnames from "classnames";

import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
 } from "helpers/selectors";
 
 import { setInterview } from "helpers/reducers";

 const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  }
];

class Dashboard extends Component {

  state = {
    loading : true,
    focus : null,
    days : [],
    appointments : {},
    interviewers : {}
  }

    componentDidMount() {

      Promise.all([
        axios.get("/api/days"),
        axios.get("/api/appointments"),
        axios.get("/api/interviewers")
      ]).then((all)=>{
        this.setState(()=>({ 
          loading : false,
          focus : null,
          days : all[0].data, 
          appointments : all[1].data, 
          interviewers : all[2].data
        }))
      })

      this.socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

      const focused = JSON.parse(localStorage.getItem("focused"));
  
      if (focused) {
        this.setState({ focused });
      }

      this.socket.onmessage = event => {
        const data = JSON.parse(event.data);
      
        if (typeof data === "object" && data.type === "SET_INTERVIEW") {
          this.setState(previousState =>
            setInterview(previousState, data.id, data.interview)
          );
        }
      };


    }
  
    componentDidUpdate(previousProps, previousState) {

     

      if (previousState.focused !== this.state.focused) {
        localStorage.setItem("focused", JSON.stringify(this.state.focused));
      }
    }

    componentWillUnmount(){
      this.socket.close()
    }

  selectPanel(id) {
    this.setState(previousState => ({
      focused: previousState.focused !== null ? null : id
    }));
  }
   




  render() {  
    console.log(this.state)
  

    const dashboardClasses = classnames("dashboard", {"dashboard--focused": this.state.focused});

    const panels = data
                        .filter( panel=> this.state.focus === null || this.state.focus === panel.id)
                        .map( panel=> <Panel 
                          key= {panel.id} 
                          value = {panel.getValue(this.state)}
                          {...panel} 
                          onSelect={e=>this.selectPanel(panel.id)}/>)

                         
                       
    if(this.state.loading){

     return <Loading/>;
     
    }

    return  (
    
    <main className={dashboardClasses}>{panels}</main> 
    
    )
  }
}

export default Dashboard;
