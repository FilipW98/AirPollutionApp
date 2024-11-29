import React from 'react';

const InfoTooltip = ({ pollutantInfo, pollutantType }) => {

	 const tooltipClass = pollutantType
			? `${pollutantType.toLowerCase()}-info`
			: '';
	return (
		<div className='relative inline-block group'>
			<span className='cursor-pointer'>ℹ</span>
			<div className={`  ${tooltipClass} absolute left-0 mt-2 w-52 p-4 text-white bg-slate-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10`}>
				{pollutantInfo}
			</div>
		</div>
	);
};

export default InfoTooltip;
