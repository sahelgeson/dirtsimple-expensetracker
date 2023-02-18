import { ChangeEvent, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import ReactModalStyles from "../../components/modals/ReactModalStyles.js";

ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(80, 80, 80, 0.69)';
ReactModal.setAppElement('#root');

// TODO need to sort out typescript for react-modal before converting this to ts
export const ImportData = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importedData, setImportedData] = useState();
  const [parsedData, setParsedData] = useState();
  const [error, setError] = useState();

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const fileReader = new FileReader();

  const handleUpload = (e) => {
    e.preventDefault();

    const file = (e?.currentTarget?.files[0]);
    if (file) {
      fileReader.onload = function (event) {
        // TODO add "are you sure" validation for filename
        const text = event.currentTarget.result;
        // save the data, check for malformed data on submit
        setImportedData(text);
        setIsModalOpen(true);
      };

      fileReader.onerror = function (event) {
        setError(true);
      }

      // after this executes the load event is fired and is handled by above
      fileReader.readAsText(file);
    }
  };

  // updates global state
  useEffect(() => {
    if (parsedData) {
      try {
        // This is hacky, just updating localStorage and then reloading the page to trigger onmount
        const serializedState = JSON.stringify(parsedData);
        localStorage.setItem('state', serializedState);
        window.location.reload();
      } catch (e) {
        setError(true);
      }
    }
  }, [parsedData]);

  const submitData = () => {
    try {
      /* TODO check that data matches data structure of state, here we're just checking for JSON.parse errs */
      const parsedData = JSON.parse(importedData);
      setParsedData(parsedData);
    } catch (e) {
      setError(true);
    }
  }

  return(
    <>
      <label className="gray-777 font-14 bold block mtl mbm">Import data (from .json)</label>
      <input
        className="btn btn--outline gray-777 font-14 phm pvm mrxs block center full-width" 
        type="file" 
        accept=".json"
        onChange={handleUpload}
      />
      {error && (
        <div>
          Oops, there was an error, please double check the file and try again.
        </div>
      )}

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={ReactModalStyles}
        contentLabel="Import Modal"
      >
        <div>Importing this file will completely replace all existing data. Data added since last export will be lost. This can't be undone.</div>
        <div className="pvl">
          <button 
            className="btn btn--red capitalize phm pvm mrxs left"
            onClick={submitData}
          >
            Yes, Import
          </button>
          <button 
            className="btn btn--outline capitalize phm pvm mrxs right"
            onClick={closeModal}
          >
            No, Cancel
          </button>
        </div>
      </ReactModal>
    </>
  );
}
