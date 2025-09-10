import React from 'react';
import './Features.css';

const Features = () => {
  return (
    <div className='programs'>
      <div className="program">
        {/* <img src= {program_1} alt=''/> */}
        <div className="caption">
            {/* <img src={program_icon_1} alt=''/> */}
            <p>Graduation Degree</p>
        </div>
      </div>

      <div className="program">
        {/* <img src= {program_2} alt=''/> */}
        <div className="caption">
            {/* <img src={program_icon_2} alt=''/> */}
            <p>Masters Degree</p>
        </div>
      </div>

      <div className="program">
        {/* <img src= {program_3} alt=''/> */}
        <div className="caption">
            {/* <img src={program_icon_3} alt=''/> */}
            <p>Post Graduation Degree</p>
        </div>
      </div>
    </div>
  )
}

export default Features
