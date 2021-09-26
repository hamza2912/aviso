import React, {useState} from 'react'
import {Fab, TextField, TextareaAutosize, Grid} from '@material-ui/core'
import Header from '../components/header';
import Footer from '../components/footer';
import {ArrowBack, GetApp} from '@material-ui/icons'
import { Link } from "react-router-dom";
import { useBarcode } from '@createnextapp/react-barcode'

function BarcodeGenerator() {
    const [barcode, setBarcode] = useState('92');
    const handleChange = (event) => {
        if(event.target.value.length < 3){
            setBarcode("92");
        } else {
            setBarcode(event.target.value ? event.target.value : '');
        }
    };
    const { inputRef } = useBarcode({
        value: barcode,
        options: {
          background: '#ffffff',
        }
    });
    const downloadBarcode = () => {
        const canvas = document.getElementById("mybarcode");
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "mybarcode.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
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
            
                <div style={{marginTop:30, marginBottom:30}}>
                    <TextField onChange={handleChange} style={{width:320}}
                    value={barcode} label="Barcode content" size="large" variant="outlined" color="secondary" 
                    />
                </div>

                <div>
                    {
                        barcode !== ''
                        ?
                        <canvas id="mybarcode" ref={inputRef} />
                        :
                        <p>No barcode preview</p>
                    }
                </div>
                <div>
                    {
                        barcode ? 
                        <Grid container style={{marginTop:30}}>
                            <Grid item xs={10}>
                            <TextareaAutosize
                                style={{fontSize:18, width:250, height:100, borderWidth:"1px", borderColor:"gray", padding:"5px", borderRadius:"5px"}}
                                rowsMax={4}
                                defaultValue={barcode}
                                value={barcode}
                            />
                            </Grid>
                            <Grid item xs={2}>
                            <Fab onClick={downloadBarcode} style={{marginLeft:10}} color="secondary">
                                <GetApp/>
                            </Fab>
                            </Grid>
                        </Grid> :
                        ''
                    }
                </div>
            </div>
        </div>

        <Footer />

      </div>
    );
  }
  
  export default BarcodeGenerator;
  