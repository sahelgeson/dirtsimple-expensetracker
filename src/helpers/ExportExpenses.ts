export const exportExpenses = () => {}
/*
export const exportExpenses = (categories) => {

 
  const data: any = localStorage.get('state');

  // get date for filename


  /*
  exportLink.setAttribute('href', 'data:text/csv;base64,' + window.btoa(data));
  exportLink.appendChild(document.createTextNode('test.csv'));
  document.getElementById('results').appendChild(exportLink);

  data:text/csv;charset=utf-8,content_encoded_as_url to avoid dependency on window.btoa 
  & also on the link add download="test.csv", using exportLink.setAttribute('download', 'test.csv');, t
*/


/*
  function download(filename: string, text: any) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
  }
  download('test.txt', 'Hello world!');

}
*/
