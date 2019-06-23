import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Tasks from "components/Tasks/Tasks.jsx";
import CustomTabs from "components/CustomTabs/CustomTabs.jsx";
import Danger from "components/Typography/Danger.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import { bugs, website, server } from "variables/general.jsx";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.jsx";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import { Map, GoogleApiWrapper } from 'google-maps-react';

import TheMap from "components/TheMap/TheMap.jsx";
import AgoraRTC from 'agora-rtc-sdk';

// var client = AgoraRTC.createClient({mode: 'live', codec: "h264"});

let root_url = '';


const diseaseName = {
  fontSize: '16px',
  paddingTop: '5px',
  paddingBottom: '5px',
  color: 'grey'
};

const mapStyles = {
  width: '100%',
  height: '100%',
};

const b500 = {
  fontWeight: '500'
}

function sort_by_key(array, key)
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
 });
}

class Dashboard extends React.Component {
  state = {
    value: 0,
    total_sick: 0,
    total_leptospirosis: 0,
    total_dengue_fever: 0,
    total_cholera: 0,
    graphDataCholera: {
      // labels: ["6:00AM", "9:00AM", "12:00PM", "3:00PM", "6:00PM", "9:00PM"],
      // series: [[1561269600, 1561280400, 1561291200, 1561302000, 1561312800, 1561323600]]
      // labels: ["6:00AM", "9:00AM", "12:00PM", "3:00PM", "6:00PM", "9:00PM",
      //           "12:00AM", "3:00AM", "6:00AM", "9:00AM", "12:00PM", "3:00PM"],
      // series: [[5, 10, 30, 17, 23, 18, 5, 10, 30, 17, 23, 18]]
      labels: [],
      series: []
    },
    graphDataLepto: {
      labels: [],
      series: []
    },
    graphDataDengue: {
      labels: [],
      series: []
    }
    
  };

  componentDidMount() {
    this.fetchInitialData();
  }



  fetchInitialData = () => {
    // https://api.myjson.com/bins/fbb2t'
    // https://api.myjson.com/bins/12z2np
    // https://api.myjson.com/bins/ptlwl
    // https://getstartednode-fluent-kangaroo.eu-gb.mybluemix.net/data/dashboard
    fetch('https://getstartednode-fluent-kangaroo.eu-gb.mybluemix.net/data/dashboard', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    
    }).then((response) => response.json())
          .then( (responseJson) => {

            responseJson = sort_by_key(responseJson, 'unique id');
      
            console.log(responseJson);
            // console.log(responseJson.data);

            let total_sick = 0;
            let total_leptospirosis = 0;
            let total_dengue_fever = 0;
            let total_cholera = 0;
            let cholera_data = [];
            let lepto_data = [];
            let dengue_data = [];
            let hours_data = [];
            // let total_other_diseases = 0;
            responseJson.map((d, i) => {
              // console.log(d["no. of sick people"]);
              total_sick += parseInt(d["no. of sick people"]);
              
              var date = new Date(d["timestamp"]*1000);
              var hours = date.getHours();
              hours_data.push(hours + ' HRS');

              d["suspected diseases"].map((s, j) => {
                // console.log(s['Leptospirosis']);
                if(s['Leptospirosis']) {
                  // console.log(s['Leptospirosis']);
                  total_leptospirosis += parseInt(s['Leptospirosis']);
                  lepto_data.push(parseInt(s['Leptospirosis']));
                } else if(s['Dengue Fever']) {
                  // console.log(s['Dengue Fever']);
                  total_dengue_fever += parseInt(s['Dengue Fever']);
                  dengue_data.push(parseInt(s['Dengue Fever']));
                } else if(s['Acute Diarrhoea/Cholera']) {
                  total_cholera += parseInt(s['Acute Diarrhoea/Cholera']);
                  cholera_data.push(parseInt(s['Acute Diarrhoea/Cholera']));

                }
              });

            });

            console.log(hours_data);

            this.setState({
              total_sick,
              total_leptospirosis,
              total_dengue_fever,
              total_cholera,
              graphDataCholera: {
                // labels: ["6:00AM", "9:00AM", "12:00PM", "3:00PM", "6:00PM", "9:00PM",
                //           "12:00AM", "3:00AM", "6:00AM", "9:00AM", "12:00PM", "3:00PM"],
                labels: hours_data,
                series: [cholera_data]
              },
              graphDataLepto: {
                labels: hours_data,
                series: [lepto_data]
              },
              graphDataDengue: {
                labels: hours_data,
                series: [dengue_data]
              }
            });
  
          }).catch((error) => {
            console.error(error);
          });

  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  render() {
    const { classes } = this.props;
    return (
      <div>

        {/* START | ADDED BY ABHILASH */}

        <h3>Dashboard for Medical Supervisor</h3>

        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Accessibility />
                </CardIcon>
                <p className={classes.cardCategory}>Reported</p>
                <h3 className={classes.cardTitle}>{this.state.total_sick}</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <DateRange />
                  23 June, 2019
                </div>
              </CardFooter>
            </Card>
          </GridItem>

          <GridItem xs={12} sm={6} md={6}>
            <Card>
              <CardBody>
                <div style={diseaseName}><span style={b500}>Leptospirosis - </span> {this.state.total_leptospirosis} suspected</div>
                <div style={diseaseName}><span style={b500}>Dengue Fever - </span> {this.state.total_dengue_fever} suspected</div>
                <div style={diseaseName}><span style={b500}>Acute Diarrhoea/Cholera - </span> {this.state.total_cholera} suspected</div>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

        <iframe height="450" frameBorder="0" style={{border: 0, marginTop: 50, width: '100%'}}
          src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJxYw0NJfO5zsR7ABk4Kqrdx8&key=
          AIzaSyCpNV97PE8xtDMPme8yg0E6u-Roqos7Kqc
          " allowFullScreen>

        </iframe>

        <div style={{marginTop: '50px'}}></div>

        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card chart>
              <CardHeader color="danger">
                <ChartistGraph
                  className="ct-chart"
                  // data={dailySalesChart.data}
                  data={this.state.graphDataCholera}
                  type="Line"
                  options={dailySalesChart.options}
                  listener={dailySalesChart.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Cholera Report Over Time Period of 36 Hours</h4>
                {/* <p className={classes.cardCategory}>
                  <span className={classes.dangerText}>
                    <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                  </span>{" "}
                  increase in suspects.
                </p> */}
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> updated recently
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>  


        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card chart>
              <CardHeader color="success">
                <ChartistGraph
                  className="ct-chart"
                  // data={dailySalesChart.data}
                  data={this.state.graphDataLepto}
                  type="Line"
                  options={dailySalesChart.options}
                  listener={dailySalesChart.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Leptospirosis Report Over Time Period of 36 Hours</h4>
                {/* <p className={classes.cardCategory}>
                  <span className={classes.dangerText}>
                    <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                  </span>{" "}
                  increase in suspects.
                </p> */}
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> updated recently
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>



        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card chart>
              <CardHeader color="success">
                <ChartistGraph
                  className="ct-chart"
                  // data={dailySalesChart.data}
                  data={this.state.graphDataDengue}
                  type="Line"
                  options={dailySalesChart.options}
                  listener={dailySalesChart.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Dengue Fever Report Over Time Period of 36 Hours</h4>
                {/* <p className={classes.cardCategory}>
                  <span className={classes.dangerText}>
                    <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                  </span>{" "}
                  increase in suspects.
                </p> */}
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> updated recently
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>




        {/* <GridContainer>
          <GridItem xs={12} sm={6} md={12}>
            <TheMap style={{width: '80%', height: '300px', marginBottom: '500px'}} />
          </GridItem>
        </GridContainer>

        <div style={{marginBottom: '600px'}}></div> */}


        <div style={{height: 1, backgroundColor: '#e1e1e1', marginTop: 100, marginBottom: 100}}></div>

        {/* END | ADDED BY ABHILASH */}



      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);