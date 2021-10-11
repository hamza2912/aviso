import React from 'react';
import {Fab, TextareaAutosize, Paper} from '@material-ui/core'
import Header from '../components/header';
import Footer from '../components/footer';
import {ArrowBack} from '@material-ui/icons'
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import firebase from "firebase";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';



function BarcodeScanner() {

    var interval;
    var hitOneTime = true;
    // var smsOneTime = true;
    var barcode = '';
    var presentStudents = [];
    var attendanceLog = [];
    var students = [];
    var dayCount;
    var lastdays = [28,29,30,31];
    var lastday = false;
    let history = useHistory();
    var newDate = new Date();
    var date = newDate.getDate();
    var month =  newDate.getMonth() + 1;
    var year = newDate.getFullYear();

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    React.useEffect(() => {

      window.addEventListener('keydown', (event) => {
          if (interval){
            clearInterval(interval);
          }
          if (event.code == 'Enter'){
            if(interval && hitOneTime){
              handleBarcode(barcode);
              var student = students.filter(x => x.barcode == barcode);
              hitOneTime = false;
              if(student.length > 0){
                if(!checkifAlreadyPresent(presentStudents, barcode)){
                    markAttendance(student, attendanceLog);
                    sendSMS(student, true);
                } else{
                  aleadyPresent();
                  // alert("Already presented");
                  // window.location.reload();
                }
              }else{
                invalidBarcode();
                // alert("Wrong barcode");
              }
            }
            barcode = '';
            return;
          }
          if (event.key != 'Shift'){
              barcode = barcode + event.key;
          }
          interval = setInterval(() => barcode = '', 20);
        });
        
        firebase.database().ref('masterSheet/').on('value', (snapshot) => {
            students = snapshot.val();
        });

        firebase.database().ref('attendanceLog/').on('value', (snapshot) => {
            attendanceLog = snapshot.val();
        });

        firebase.database().ref('presentStudents/').on('value', (snapshot) => {
            presentStudents = snapshot.val();
        });

        firebase.database().ref('monthCount/count/').on('value', function(snapshot) {
            dayCount = snapshot.val();
        });

        if(lastdays.includes(newDate.getDate())){
          if(window.confirm("Is today the last working day of this month? Press Ok if yes.")){
            lastday = true;
          } 
        }

        }, []);

    function handleBarcode(scanned_barcode){
        document.querySelector('#last-barcode').innerHTML = scanned_barcode;
    }

    function checkifAlreadyPresent(presentStudents, stu_barcode){
      if(presentStudents){
        // var present = presentStudents; 
        if(presentStudents.includes(stu_barcode)){
          return true;
        } else{
          var present = presentStudents;
          present.push(stu_barcode);
          firebase.database().ref('presentStudents/').set(present);
          return false;
        }
      } else{
        firebase.database().ref('presentStudents/').set([stu_barcode]);
        return false;
      }
      
    }

    function checkifLogged(stu, attendanceLog){

      // var newDate = new Date();
      var studentLog= {};
      studentLog.name = stu[0].name;
      studentLog.barcode = stu[0].barcode;
      studentLog.phone_number = stu[0].phone_number;
      studentLog.present = 1;
      studentLog.month = newDate.getMonth() + 1;
      studentLog.year = newDate.getFullYear();

      if(attendanceLog){
        var logged = false;
        attendanceLog.map((x) =>{
          if(x.barcode == stu[0].barcode){
            logged = true;
          } 
        });
        if(logged){
          return true;
        } else{
          var attendance = attendanceLog;
          attendance.push(studentLog);
          firebase.database().ref('attendanceLog/').set(attendance);
          return false;
        }
      } else{
        firebase.database().ref('attendanceLog/').set([studentLog]);
        return false;
      } 

    }

    function markAttendance(student, attendanceLog){


      if(checkifLogged(student, attendanceLog)){
        console.log("Already logged")
        var attendance = attendanceLog;
        for(let i = 0; i <= attendance.length; i++){
          if(attendance[i].barcode == student[0].barcode){
            var present;
            firebase.database().ref(`attendanceLog/${i}/present/`).on('value', function(snapshot) {
              present = snapshot.val();
            });
            firebase.database().ref(`attendanceLog/${i}/present`).set(present+1);
            break;
          }
        }
        // window.location.reload();
      } else{
        console.log("Added");
        // window.location.reload();
      }

    }

    function sendSMS(stu, reload){

        var sms_message;
        var sender = "NS Collegiate";
        var reciepent = stu[0].phone_number;
        var url= "https://sendpk.com/api/sms.php?";

        if(!lastday){
          sms_message = `${stu[0].name} is ${reload? "present":"absent"} today. ${date}/${month}/${year}`;
          console.log(sms_message);
          axios.get(url, {
            params: {
              // api_key: "923362341421-5a895000-7398-4d64-bc3b-e3f98abb106a",
              sender: "Hamza",
              mobile: "923363924447",
              message: "Hello I am Hamza",
              format: "json",
            }
            // params: {
            //   api_key: "923362341421-5a895000-7398-4d64-bc3b-e3f98abb106a",
            //   sender: sender,
            //   mobile: reciepent,
            //   message: sms_message,
            //   format: "json",
            // }
          })
          .then((res) => {
              
              console.log(res.data);
              if(reload){
                attendanceMarked();
                // window.location.reload();
              }
          });
        } else{
            var stu_attendance = attendanceLog.filter(x=> x.barcode == stu[0].barcode);
            if(stu_attendance.length>0){
              
              var month_count = stu_attendance[0].present;
              sms_message = `${stu[0].name} was present ${month_count} days out of ${dayCount+1} days this month. ${date}/${month}/${year}`;
              console.log(sms_message);

              axios.get(url, {
                params: {
                  // api_key: "923362341421-5a895000-7398-4d64-bc3b-e3f98abb106a",
                  sender: "Hamza",
                  mobile: "923363924447",
                  message: "Hello I am Hamza",
                  format: "json",
                }
                // params: {
                //   api_key: "923362341421-5a895000-7398-4d64-bc3b-e3f98abb106a",
                //   sender: sender,
                //   mobile: reciepent,
                //   message: sms_message,
                //   format: "json",
                // }
              })
              .then((res) => {
                  
                  console.log(res.data);
                  if(reload){
                    attendanceMarked();
                    // window.location.reload();
                  }
              });
            }  
        }

        // if(smsOneTime){
          
          // if(reload){
          //   smsOneTime = false;
          // }
        // }
      
    }

    function findNotPresent(student){
      if(!presentStudents.includes(student.barcode.toString())){
        return student;
      }
    }

    function stopAttendance(){

      if(presentStudents){
         // send sms to non present
        var notPresent = students.filter(findNotPresent);
        // console.log(notPresent);
        notPresent.map((x) => {
          sendSMS([x], false);
        });
        if(dayCount){
          firebase.database().ref('monthCount/count').set(dayCount+1);
        } else {
          firebase.database().ref('monthCount/count').set(1);
        }
        firebase.database().ref('presentStudents/').set([]);
        if(lastday){
          firebase.database().ref(`attendanceLogs/${month}_${year}/`).set(attendanceLog);
          exportToCSV();
        }
        history.push("/");
      }
    }

    function aleadyPresent(){
      var player = document.getElementById('present');
      player.play();
      document.getElementById("alert").classList.remove('hidden');
      setTimeout(function(){ 
        document.getElementById("alert").classList.add('hidden');
        newAttendance(); 
      }, 2000);
    }

    function invalidBarcode(){
      var player = document.getElementById('wrong');
      player.play();
      document.getElementById("alert2").classList.remove('hidden');
      setTimeout(function(){ 
        document.getElementById("alert2").classList.add('hidden'); 
      }, 2000);
      newAttendance();
    }

    function attendanceMarked(){
      var player = document.getElementById('attendance');
      player.play();
      newAttendance();
    }

    function newAttendance(){
      hitOneTime = true;
      handleBarcode('');     
    }

    function exportToCSV() {

      const ws = XLSX.utils.json_to_sheet(attendanceLog);
      const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], {type: fileType});
      FileSaver.saveAs(data, `Attendance-${month}/${year}` + fileExtension);
      firebase.database().ref('attendanceLog/').set([]);
      firebase.database().ref('monthCount/').set([]);
    }

    function test(){
    
    }

    return (

      <div>
  
        <Header />

        <div id="alert" className="ui warning message alert-box z-10 w-auto mx-auto hidden">
          <div className="header">
            Already Present!
          </div>
        </div>

        <div id="alert2" className="ui warning message alert-box z-10 w-auto mx-auto hidden">
          <div className="header">
            Invalid Barcode!
          </div>
        </div>

        <audio src="audio/attendance.mp3" id="attendance" className="hidden" preload="none"></audio>
        <audio src="audio/present.mp3" id="present" className="hidden" preload="none"></audio>
        <audio src="audio/wrong.mp3" id="wrong" className="hidden" preload="none"></audio>

        <div className='w-full h-screen flex items-center'>

            <div className='w-1/3 mx-auto flex flex-col items-center'>
                <div className='w-full flex flex-row items-center justify-center'>
                  <Link to="/">
                      <Fab style={{marginRight:10}} color="secondary">
                          <ArrowBack/>
                      </Fab>
                  </Link>
                    <span>Barcode Scanner</span>
                </div>
                <p className='my-10'>Show your card to barcode scanner to mark your attendance.</p>
                <img className='w-4/5 h-auto' src="icons/show_card.svg" alt="" />
                <button onClick={sendSMS}>send sms</button>
                <div className='w-4/5 p-2 border border-black rounded-sm mt-8 h-12'>
                  <p id='last-barcode' className='text-center text-2xl'></p>
                </div>
                <button onClick={stopAttendance} className='bg-red p-2 mt-4 rounded-lg text-white text-xs'>
                    Stop Attendance
                </button>
                {/* <button onClick={test}>Test</button> */}
                
            </div>
        </div>

        <Footer />

      </div>
    );
  }
  
  export default BarcodeScanner;
  