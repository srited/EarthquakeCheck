//// JavaScript source code

////API call is made inside useeffect()

////If you want to run an effect and clean it up only once, you can pass an empty array ([]) as a second argument.

////This tells React that your effect doesn’t depend on any values from props or state,

////so it never needs to re - run.



import React, { useState, useEffect } from 'react';



export default function UseSpaceDataHook(filterparams) {


    const [hookdata, sethookData] = useState(null);

    const [filtereddata, setFilteredData] = useState(null);



    useEffect(() => {





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

                sethookData(resultdata);



            })

            .catch((err) => {

            });

    }, [])



    useEffect(() => { debugger; if (hookdata != undefined && hookdata.length > 0 && hookdata != null) filterdata() }, [hookdata, filterparams.year, filterparams.customerName])





    function filterdata() {

        let tmpArray = [];







        for (var i in hookdata) {

            var valueToPush = new Array();





            valueToPush['year'] = hookdata[i].launch_year;



            var valueToPushnew = new Array();

            let isavailable = [];

            let payloadarray = [];

            for (var j in hookdata[i].rocket.second_stage.payloads) {



                valueToPush['payloadslength'] = hookdata[i].rocket.second_stage.payloads.length;

                valueToPushnew['customernames'] = (hookdata[i].rocket.second_stage.payloads[j].customers);

                valueToPush['isavailable'] = ((valueToPushnew['customernames']).toString()).toLowerCase().includes((filterparams.customerName).toLowerCase()) == true ? 1 : 0;

                isavailable.push(valueToPush['isavailable']);

                payloadarray.push(valueToPushnew['customernames']);



            }

            valueToPush['customernames'] = payloadarray;

            if ((valueToPush['year'] == filterparams.year) && isavailable.includes(1)) {

                valueToPush['flightnumber'] = hookdata[i].flight_number;

                valueToPush['missionname'] = hookdata[i].mission_name;

                valueToPush['date'] = new Date(hookdata[i].launch_date_local);

                tmpArray.push(valueToPush);

            }

        }

        debugger;

        setFilteredData(tmpArray.sort((a, b) => b.date - a.date).sort((a, b) => b.payloadslength - a.payloadslength));



        //console.log('filtereddata', filtereddata)





    }

}