import React, { useState, useEffect } from 'react';
import Dropdown from '../solutions/DropDownComponent';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import "../solutions/StyleSheet.css"
import clsx from "clsx";
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@material-ui/core/IconButton';
import RefComponent from '../solutions/Referrences';
import ResponsiveAppBar from '../solutions/Menu';
import Marquee from "react-fast-marquee";

const redtext = "redtext";
const bluetext = "bluetext";
const orangetext = "orangetext";
 

//GridData Column Definition
const columns = [
   
    { field: 'place', headerName: 'Place', width: 300, headerClassName: 'headerstyle',headerAlign: 'center',},
    { field: 'status', headerName: 'Status', width: 200, headerClassName: 'headerstyle', headerAlign: 'center', },
    { field: 'magnitude', headerName: 'Magnitude', width: 150, headerClassName: 'headerstyle', headerAlign: 'center',
        cellClassName: (params) => {
            if (params.value == null) {
                return '';
            }

            return clsx(bluetext, {
                orangetext: params.value >= 2 && params.value <= 4,
                redtext: params.value >4 ,
            });
        }
    },
    { field: 'time', headerName: 'Time', width: 300, headerClassName: 'headerstyle', headerAlign: 'center' },
    { field: 'tsunami', headerName: 'Tsunami', width: 200, headerClassName: 'headerstyle', headerAlign: 'center',}
     
];
const tmpArray = [];



const Dropdowncomp = () => {
    const [magnitude, setMagnitude] = useState(0);
    const [earthquakedata, setearthquakeData] = useState([]);
    const [filtereddata, setFilteredData] = useState([]);
    const [datetime, setdatetime] = useState(null);
    const [todaycount, settodaycount] = useState(0);
    const [magcount, setmagcount] = useState(null);
    const [weekcount, setweekcount] = useState(0);

    const handleMagChange = (event) => {
        setMagnitude(event.target.value)
        if (earthquakedata !== undefined && earthquakedata !== null && event.target.value !== 0)
            filterOnMag(event.target.value)
        else if (event.target.value === 0)
            getData();
    };

    const pagerefreshcall = (event) => {
        getData();
        setFilteredData([]);
    };

    const getData = async () => {
        //try {
        //    //debugger;
        //    const usgsdata = await axios.get("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")

        //    //setearthquakeData(usgsdata.data);
        //    setdata(usgsdata.data);// set State
        //    calculatedatetime();
        //    //console.log(earthquakedata);

        //} catch (err) {
        //    console.error(err.message);
        //}

        fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }
                return response.json();
            })
            .then(resultdata => {
                calculatedatetime();                
                setdata(resultdata);                
            })
            .catch((err) => {
            });
    };
    //useEffect(() => { debugger; if (earthquakedata != undefined && earthquakedata.length > 0 && earthquakedata != null) filterdata() }, [earthquakedata,magnitude])
    function caluculateearthquakecount(tmpArray1) {         
        let todate = new Date();
        settodaycount((tmpArray1.filter(item => isToday(item.time, 0)).length));
        setweekcount((tmpArray1.filter(item => isToday(item.time, 7)).length));       
        let low = (tmpArray1.filter(item => item.magnitude < 2).length).toString();
        let mid = (tmpArray1.filter(item => item.magnitude >= 2 && item.magnitude < 4).length).toString();
        let high = (tmpArray1.filter(item => item.magnitude >= 4).length).toString();
        setmagcount(low + " : " + mid + " : " + high);
        
    }

    const isToday = (someDate,offset) => {
        const today = new Date()
        if (offset === 0) {
            return someDate.getDate() == today.getDate() &&
                someDate.getMonth() == today.getMonth() &&
                someDate.getFullYear() == today.getFullYear()
        }
        else {
            return someDate.getDate() >= today.getDate() - offset &&
                someDate.getMonth() == today.getMonth() &&
                someDate.getFullYear() == today.getFullYear()
        }
    }

    function calculatedatetime()
    {
        setdatetime(null);
    const currentdate = new Date();
        const datetime1 = "Last Sync: " + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        setdatetime(datetime1);

    }
    useEffect(() => {
        getData()
            const interval = setInterval(() => {
                getData()
            }, 10000)
            return () => clearInterval(interval)
    }, [])

    function filterOnMag(magnitude) {
        setFilteredData(earthquakedata.filter(item => item.magnitude <= magnitude && item.magnitude >= (magnitude - 2)));
    }

    function setdata(data) {
        for (var j in data.features) {
                var valueToPush = new Array();

            valueToPush['ids'] = data.features[j].properties['ids'];
            valueToPush['magnitude'] = data.features[j].properties['mag'];
            valueToPush['place'] = data.features[j].properties['place'];
            valueToPush['status'] = data.features[j].properties['status'];
            valueToPush['time'] = new Date(data.features[j].properties['time']);
            valueToPush['tsunami'] = data.features[j].properties['tsunami'];
            tmpArray.push(valueToPush);

            }
        setearthquakeData(tmpArray)
        caluculateearthquakecount(tmpArray);
    }
 

    return (
        <div>
      
            <ResponsiveAppBar />
            <div style={{ height: 30, margin:20 }}>
                <Dropdown
                    label="Magnitude : "
                    options={[
                        {label: 'All', value: '0' },
                        {label: 'Low', value: '2' },
                        {label: 'Medium', value: '4' },
                        { label: 'High', value: '6' },                    
                ]}
                    value={magnitude}
                    onChange={handleMagChange} />

                <IconButton style={{ float: 'right', marginRight: 50 }} onClick={pagerefreshcall}>
                    <RefreshIcon />
                </IconButton>
            </div>

            <div style={{ height: 300, width: 'auto', margin: 20}}>
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                        <DataGrid sx={{ boxShadow:2 }}
                            rows={filtereddata.length!=0 ? filtereddata : earthquakedata}
                            columns={columns}
                            pageSize={5}
                            getRowId={(row) => row.ids}
                            rowsPerPageOptions={[5]}    />
                </div>
             </div>
            </div>
            <div>
                <RefComponent />
                <p style={{ margin:20 }}>{datetime}</p>
                <Marquee>Today's Earthquake Count - {todaycount} . Past 7 days - {weekcount} , MagnitudeLevel Count (Low:Mid:High) - { magcount}</Marquee>
                </div>
            </div>
    );
};
 

export default Dropdowncomp;