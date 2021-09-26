import React, { Component } from 'react'
import Scanner from './Scanner'
import {Fab, TextareaAutosize, Paper} from '@material-ui/core'
import {ArrowBack} from '@material-ui/icons'
import { Link } from "react-router-dom";
import axios from 'axios';
import firebase from "firebase";

class BarcodeScanner extends Component {
  state = {
    results: [], scanned: true, studentsNames: [], attendanceRecord: [] 
  }

  componentDidMount(){
    firebase.database().ref('masterSheet/').on('value', (snapshot) => {
      this.setState({ studentsNames: snapshot.val() })
    });
    firebase.database().ref('students/').on('value', (snapshot) => {
      this.setState({ attendanceRecord: snapshot.val() })
    });
  }

  _scan = () => {
    this.setState({ scanning: !this.state.scanning })
  }

  _onDetected = result => {
    this.setState({ results: [] })
    this.setState({ results: this.state.results.concat([result]) })
    if(this.state.results !== "" && this.state.scanned){
      console.log("scanned");
      this.pushToFirebase(this.state.results[0].codeResult.code);
      this.setState({ scanned: false })
    }
  }

  pushToFirebase = (id) => {

    let newDate = new Date();
    let studentName = this.state.studentsNames.filter(x => x.barcode == id)[0].name;
    let presented = this.state.attendanceRecord.filter(x => x.day == newDate.getMonth()+1);
    console.log(presented);
    var doubleAttendance = false;
    presented.map((student) => {
      if(student.id === id ){
        doubleAttendance = true
      }
    });
    var records = this.state.attendanceRecord;
    if(!doubleAttendance){
      if(records){
        records.push({
          id: id,
          name: studentName,
          day: newDate.getDate(),
          month: newDate.getMonth() + 1,
          year: newDate.getFullYear(),
        });
        firebase.database().ref('students/').set(records);
      } else{
        firebase.database().ref('students/').set([{
          id: id,
          name: studentName,
          day: newDate.getDate(),
          month: newDate.getMonth() + 1,
          year: newDate.getFullYear(),
        }]);
      }
    }
    
    
  }


  sendSMS = () => {
    
    console.log("sending");
  
  }

  render() {
    return (
      <div>
        <Link to="/">
            <Fab style={{marginRight:10}} color="secondary">
                <ArrowBack/>
            </Fab>
        </Link>
        <span>Barcode Scanner</span>
        <br />
        <button onClick={this.sendSMS}>Send sms</button>

        
        <Paper variant="outlined" style={{marginTop:30, width:640, height:320}}>
          <Scanner onDetected={this._onDetected} />
        </Paper>

        <TextareaAutosize
            style={{fontSize:32, width:320, height:100, marginTop:30}}
            rowsMax={4}
            defaultValue={''}
            value={this.state.results[0] ? this.state.results[0].codeResult.code : ''}
        />


      </div>
    );
  }
}

export default BarcodeScanner
