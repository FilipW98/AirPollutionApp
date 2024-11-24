
import React from 'react';
import cn from 'classnames';



const Card = ({ className, ...props }) => (
	<div
		className={cn(
			'rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 card ',
			className
		)}
		{...props}
	/>
);

const CardHeader = ({ className, ...props }) => (
	<div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
);

const CardTitle = ({ className, ...props }) => (
	<h3 className={cn('text-xl font-semibold leading-none tracking-tight', className)} {...props} />
);

const CardContent = ({ className, ...props }) => <div className={cn('xl:p-6 md:p-6 ', className)} {...props} />;

export { Card, CardHeader, CardTitle, CardContent };
