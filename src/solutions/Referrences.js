import * as React from 'react';

const RefComponent = () => {
    return (
        <table style={{margin:20,textAlign:'center'}}>
            <tbody>
                <tr>
                    <th style={{ width: '20%' }}>Magnitude</th>
                </tr>
                <tr>
                    <td style={{ color: 'blue' }}>0-2 Low</td><td style={{ color: 'orange'  }}>2-4 Mid</td><td style={{ color: 'red'  }}>4+ High</td>
                </tr>
                 
            </tbody>
        </table>
        );
}

export default RefComponent;