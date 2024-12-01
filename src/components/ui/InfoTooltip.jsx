import React from 'react';
import infoIcon from '../../img/info-solid(1).svg';


const InfoTooltip = ({ pollutantInfo, pollutantType }) => {

	 const tooltipClass = pollutantType
			? `${pollutantType.toLowerCase()}-info`
			: '';
	return (
		<div className='relative inline-block group info-icon-box'>
			<img src={infoIcon} alt='Info icon' className='info-icon cursor-pointer' />
			<div
				className={`  ${tooltipClass} absolute left-0 mt-2 w-52 p-4 text-white bg-slate-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10`}
			>
				{pollutantInfo}
			</div>
		</div>
	);
};

export default InfoTooltip;
