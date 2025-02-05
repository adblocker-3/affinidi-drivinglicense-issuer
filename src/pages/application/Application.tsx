import React, { useState, useContext } from 'react';
import AppContext from 'context/app';
import { Button, Form } from 'react-bootstrap';
import ApiService from 'utils/apiService';
import 'pages/application/Application.scss'
import firebase from 'utils/firebase/firebase';
import randomstring from 'randomstring';

interface IBaseVCData {
  givenName: string;
  familyName: string;
  issueDate: string;
}

interface IExtendVCData {
  patientID: string;
  country: string;
  medicalCondition: string;
  issuerOrganization: string;
  email: string;
}

const defaultBaseVCData: IBaseVCData = {
  givenName: '',
  familyName: '',
  issueDate: ''
}

const defaultExtendVCData: IExtendVCData = {
  patientID: '',
  country: 'Singapore',
  medicalCondition: '',
  issuerOrganization: 'Changi General Hospital',
  email: ''
}

interface IPayload extends IBaseVCData {
  idClass: string;
  holderDid: string
}

const Application: React.FC = (): React.ReactElement => {
  const { appState } = useContext(AppContext);
  const [inputDID, setinputDID] = useState(appState.didToken || '');

  const [baseVCData, setBaseVCData] = useState<IBaseVCData>(defaultBaseVCData);

  const [extendVCData, setExtendVCData] = useState<IExtendVCData>(defaultExtendVCData);
  const [validated, setValidated] = useState(false);

  /**
   * Function for issuing an unsigned employment VC.
   * */

  const issueDrivingLicensePersonVC = async () => {
    try {

      setValidated(true);

      const { givenName, familyName, issueDate } = baseVCData;

      // Generate a random Affinidi Driving License ID, which will double up as an application ID
      const applicationID: string = randomstring.generate(10);
      const vcToStringify = { ...extendVCData, affinidiDrivingLicenseID: applicationID }

      const payload: IPayload = {
        givenName,
        familyName,
        issueDate,
        idClass: JSON.stringify(vcToStringify),
        holderDid: inputDID || appState.didToken || '',
      }
      console.log("application:73")
      // Store unsignedVC into issuer's database
      const db = firebase.firestore();
      db.collection('pending-health-cert').add({ username: appState.username, payload, applicationID, approved: false })

      alert('You have successfully submitted your application.');
    } catch (error) {
      ApiService.alertWithBrowserConsole(error.message);
    }
  }

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      issueDrivingLicensePersonVC()
    }

    setValidated(true);
  };

  const resetToDefaults = () => {
    setinputDID(appState.didToken || '')

    setBaseVCData(defaultBaseVCData)
    setExtendVCData(defaultExtendVCData)
  }

  const updateBaseVC = (e: any) => {
    setBaseVCData({ ...baseVCData, [e.target.name]: e.target.value })
  }

  const updateExtendBaseVC = (e: any) => {
    setExtendVCData({ ...extendVCData, [e.target.name]: e.target.value })
  }

  return (
    <div className='tutorial'>
      <div className='tutorial__step'>
        <Button
          style={{ float: 'right' }}
          onClick={e => resetToDefaults()}
        >Clear all fields
        </Button>

        <p><strong>Step 1:</strong>Please fill in details</p>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId='email'>
            <Form.Label className='label' style={{ margin: '10px 0 0 0' }}>Email Address:</Form.Label>
            <Form.Control required name='email' type='text' value={extendVCData.email} onChange={e => updateExtendBaseVC(e)} />
            <Form.Control.Feedback type="invalid">Please provide a valid Email Address.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId='givenName'>
            <Form.Label className='label' style={{ margin: '10px 0 0 0' }}>Given Name:</Form.Label>
            <Form.Control required name='givenName' type='text' value={baseVCData.givenName} onChange={e => updateBaseVC(e)} />
            <Form.Control.Feedback type="invalid"> Please provide a Given Name. </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId='familyName'>
            <Form.Label style={{ margin: '10px 0 0 0' }}>Family Name:</Form.Label>
            <Form.Control required name='familyName' type='text' value={baseVCData.familyName} onChange={e => updateBaseVC(e)} />
            <Form.Control.Feedback type="invalid"> Please provide a Family Name. </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId='issueDate'>
            <Form.Label style={{ margin: '10px 0 0 0' }}>Date of Issuance:</Form.Label>
            <Form.Control required name='issueDate' type='text' value={baseVCData.issueDate} onChange={e => updateBaseVC(e)} />
            <Form.Control.Feedback type="invalid"> Please provide a Date. </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId='patientID'>
            <Form.Label style={{ margin: '10px 0 0 0' }}>Patient ID:</Form.Label>
            <Form.Control required name='patientID' type='text' value={extendVCData.patientID} onChange={e => updateExtendBaseVC(e)} />
            <Form.Control.Feedback type="invalid"> Please provide a valid Patient ID. </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId='medicalCondition'>
            <Form.Label style={{ margin: '10px 0 0 0' }}>Medical Condition:</Form.Label>
            <Form.Control required name='medicalCondition' type='text' value={extendVCData.medicalCondition} onChange={e => updateExtendBaseVC(e)} />
            <Form.Control.Feedback type="invalid"> Please provide a valid Patient ID. </Form.Control.Feedback>
          </Form.Group>


          <Button
            type="submit"
          >Submit
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default Application;