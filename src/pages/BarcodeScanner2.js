import React from 'react';
import {Fab, TextareaAutosize, Paper} from '@material-ui/core'
import Header from '../components/header';
import Footer from '../components/footer';
import {ArrowBack} from '@material-ui/icons'
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import firebase from "firebase";



function BarcodeScanner2() {

    var interval;
    var hitOneTime = true;
    var smsOneTime = true;
    let history = useHistory();

    var barcode = '';
    var presentStudents = [];
    var attendanceLog = [];
    var students = [];

    React.useEffect(() => {
        window.addEventListener('keydown', (event) => {
            if (interval){
              clearInterval(interval);
            }
            if (event.code == 'Enter'){
              if(interval && hitOneTime){
                handleBarcode(barcode);
                hitOneTime = false;
                var student = students.filter(x => x.barcode == barcode);
                if(student){
                  if(!checkifAlreadyPresent(presentStudents, barcode)){
                      markAttendance(student, attendanceLog);
                      sendSMS(student, true);
                  } else{
                    alert("Already presented");
                    window.location.reload();
                  }
                }else{
                  alert("Wrong barcode");
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

    function checkifLogged(student, attendanceLog){

      var newDate = new Date();
      var studentLog= {};
      studentLog.name = student[0].name;
      studentLog.barcode = student[0].barcode;
      studentLog.present = 1;
      studentLog.month = newDate.getMonth() + 1;
      studentLog.year = newDate.getFullYear();

      if(attendanceLog){
        var logged = false;
        attendanceLog.map((x) =>{
          if(x.barcode == student[0].barcode){
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

    function findNotPresent(student){
      if(!presentStudents.includes(student.barcode.toString())){
        return student;
      }
    }

    function stopAttendance(){

      if(presentStudents){
         // send sms to non present
        var notPresent = students.filter(findNotPresent);
        console.log(notPresent);
        notPresent.map((x) => {
          sendSMS([x], false);
        });
        firebase.database().ref('presentStudents/').set([]);
        history.push("/");
      }
    }

    function sendSMS(stu, reload){
      
      var newDate = new Date();
      var date = newDate.getDate();
      var month =  newDate.getMonth() + 1;
      var year = newDate.getFullYear();

      var message = `${stu[0].name} is ${reload? "present":"absent"} today. ${date}/${month}/${year}`;
      var sender = "NS Coaching Center";
      var reciepent = stu[0].barcode;
      var url= "https://sendpk.com/api/sms.php?";

      console.log(message);

      if(smsOneTime){
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
          //   message: message,
          //   format: "json",
          // }
        })
        .then((res) => {
            console.log(res.data);
            if(reload){
              // window.location.reload();
            }
        });
        smsOneTime = false;
      }
        
    }

    return (

      <div>
          
        <Header />

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
                
            </div>
        </div>

        <Footer />

      </div>
    );
  }
  
  export default BarcodeScanner2;
  