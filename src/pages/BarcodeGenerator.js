import React, {useState} from 'react'
import {Fab, TextField, TextareaAutosize, Grid} from '@material-ui/core'
import Header from '../components/header';
import Footer from '../components/footer';
import {ArrowBack, GetApp} from '@material-ui/icons'
import { Link } from "react-router-dom";
import { useBarcode } from '@createnextapp/react-barcode';
import html2canvas from 'html2canvas';

function BarcodeGenerator() {
    const [barcode, setBarcode] = useState('92');
    const [name, setName] = useState('Name');
    const [fname, setFname] = useState('Father Name');
    const handleChange = (event) => {
        if(event.target.value.length < 3){
            setBarcode("92");
        } else {
            setBarcode(event.target.value ? event.target.value : '');
        }
    };
    const handleName = (event) => {
        setName(event.target.value ? event.target.value : 'Name');
    }
    const handleFname = (event) => {
        setFname(event.target.value ? event.target.value : 'Father Name');
    }
    const { inputRef } = useBarcode({
        value: barcode,
        options: {
          background: '#ffffff',
        }
    });
    const downloadBarcode = () => {
        html2canvas(document.querySelector("#mybarcode")).then(canvas => {;
            const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "mybarcode.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
        
    };

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
                    <span>Barcode Generator</span>
                </div>
                <div style={{marginTop:10, marginBottom:10}}>
                    <TextField onChange={handleChange} style={{width:320}}
                    value={barcode} label="Barcode content" size="large" variant="outlined" color="secondary" 
                    />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <div style={{marginTop:10, marginBottom:10}}>
                        <TextField onChange={handleName} style={{width:180}}
                        label="Student Name" size="large" variant="outlined" color="secondary" 
                        />
                    </div>
                    <div style={{marginTop:10, marginBottom:10}}>
                        <TextField onChange={handleFname} style={{width:180}}
                        label="Student's Father Name" size="large" variant="outlined" color="secondary" 
                        />
                    </div>
                </div>
                <div className='w-full flex flex-row justify-center'>
                    <div id="mybarcode"  className='card-dim border border-black py-2 px-4 overflow-hidden'>
                        <div className='flex flex-row justify-between items-center'>
                            <h2 className='text-2xl mb-0'>NS Collegiate</h2>
                            <img className='w-10 h-auto' src="NS.png" alt="" />
                        </div>
                        <form class="ui form  w-full mt-3">
                            <div class="field">
                                <label>Name:</label>
                                <p className='font-semibold'>{name}</p>
                            </div>
                            <div class="field -mt-1">
                                <label>Father Name:</label>
                                <p className='font-semibold'>{fname}</p>
                            </div>
                        </form>
                        <div className='flex w-full justify-center mt-5'> 
                            {   barcode !== '' ?
                                <canvas className='barcodeDim' ref={inputRef} />
                                : <p>No barcode preview</p>
                            }
                        </div>
                    </div>
                    <div>
                        {   barcode ? 
                            <Fab onClick={downloadBarcode} style={{marginLeft:10}} color="secondary">
                                    <GetApp/>
                            </Fab>
                            :''
                        }
                    </div>
                </div>
            </div>
        </div>

        <Footer />

      </div>
    );
  }
  
  export default BarcodeGenerator;





















  // const canvas = document.getElementById("mybarcode");
        // const pngUrl = canvas
        //   .toDataURL("image/png")
        //   .replace("image/png", "image/octet-stream");
        // let downloadLink = document.createElement("a");
        // downloadLink.href = pngUrl;
        // downloadLink.download = "mybarcode.png";
        // document.body.appendChild(downloadLink);
        // downloadLink.click();
        // document.body.removeChild(downloadLink);
  