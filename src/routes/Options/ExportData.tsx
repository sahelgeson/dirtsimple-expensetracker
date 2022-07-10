import { format } from 'date-fns';
import { EXPORT_DATETIME_FORMAT } from 'lib/constants';

export const ExportData = (): JSX.Element => {
  const currentState = localStorage.getItem('state');
  const encodedData = currentState && encodeURIComponent(currentState);

  const dataUrl = 'data:application/json;charset=utf-8,' + encodedData;

  const filename = format(new Date(), EXPORT_DATETIME_FORMAT)  + '_expensetracker.json';

  return(
    <>
      <div className="gray-777 font-14 bold block mts mbs">Export data (downloads as .json)</div>
      <a
        className="btn btn--outline gray-777 font-12 phm pvm mrxs block center full-width" 
        download={filename}
        href={dataUrl}
      >
        Export data
      </a>
    </>
  );
}
