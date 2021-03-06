import React, {useState} from 'react'
import {Fab, TextField, TextareaAutosize, Select, MenuItem, Grid} from '@material-ui/core'
import Header from '../components/header';
import Footer from '../components/footer';
import {ArrowBack, GetApp} from '@material-ui/icons'
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import firebase from "firebase";


import { useBarcode } from '@createnextapp/react-barcode'

function Announcements() {

    let history = useHistory();

    const [grade, setGrade] = useState('IX');
    const [message, setMessage] = useState('');
    const [students, setStudents] = useState([]);

    React.useEffect(() => {
        
        firebase.database().ref('masterSheet/').on('value', (snapshot) => {
            setStudents(snapshot.val());
        });
    }, []);
    
    const handleChange = (event) => {
        setGrade(event.target.value ? event.target.value : '');
    };

    const handleTextChange = (event) => {
        setMessage(event.target.value ? event.target.value : '');
    };

    const submit = () => {
        console.log(grade);
        if(message != '' &&  grade != ''){

            var classes = [];
            if(grade !== "All"){
                var group = students.filter(x=> x.class == grade);
                group.map(x=>{
                    classes.push(x.phone_number);
                })
            } else{
                var group = students
                group.map(x=>{
                    classes.push(x.phone_number);
                })
            } 
            // console.log(classes);
            classes.map((student) => {
                var sender = "NS Coaching Center";
                var url= "https://sendpk.com/api/sms.php?";
                axios.get(url, {
                    params: {
                        api_key: "923158455249-785b60a2-ada0-4733-9b3c-cc2674cd4361",
                    sender: sender,
                    mobile: student,
                    message: message,
                    format: "json", }
                })
                .then((res) => {
                    console.log(res.data);
                })
            });
            history.push("/");
        }else{
            document.querySelector('.error').style.display = 'block';
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
                    <span>Custom Announcement</span>
                </div>

                <div className="ui form mt-8 w-4/5">
                    <div className="field">
                        <label>Announcement for</label>

                        <select onChange={handleChange} value={grade} className="ui fluid dropdown">
                            <option className='item' value="IX">9th Class</option>
                            <option className='item' value="X">10th Class</option>
                            <option className='item' value="XI">First Year</option>
                            <option className='item' value="XII">Second Year</option>
                            <option className='item' value="All">All</option>
                        </select>                        
                    </div>
                    <div className="field">
                        <label>Message</label>
                        <textarea onChange={handleTextChange} value={message} placeholder="Enter your message here"></textarea>
                    </div>
                    <div className="ui error message">
                        <div className="header">Action Forbidden</div>
                        <p>Please fill the required fields.</p>
                    </div>
                    <div onClick={submit} className="ui submit button">Submit</div>
                </div>
            </div>
        </div>

        <Footer />

      </div>
    );
  }
  
  export default Announcements;
  