import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UseEarthquakeDataHook(filterparams)
{
    const [earthquakedata, setearthquakeData] = useState(null);

    const getData = async () => {
        try {
            debugger;
            const usgsdata = await axios.get("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")

            setearthquakeData(usgsdata.data);  // set State
            console.log(earthquakedata);

        } catch (err) {
            console.error(err.message);
        }
    };
    //useEffect(() => { debugger; if (earthquakedata != undefined && earthquakedata.length > 0 && earthquakedata != null) filterdata() }, [earthquakedata, filterparams.magnitude])

    useEffect(() => {
        getData()
        const interval = setInterval(() => {
            getData()
        }, 90000)


        return () => clearInterval(interval)
    })
        }


         
 