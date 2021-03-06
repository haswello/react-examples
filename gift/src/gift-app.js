// ESLint can't detect when a variable is only used in JSX.
/* eslint no-unused-vars: 0 */

import GiftList from './gift-list';
import NameSelect from './name-select';
import React from 'react'; //eslint-disable-line
import {Button, Modal} from 'react-bootstrap';
import TextEntry from './text-entry';

class GiftApp extends React.Component {
  componentDidMount() {
    this.focus();
  }

  componentDidUpdate() {
    this.focus();
  }

  focus() {
    document.getElementById(this.focusId).focus();
  }

  render() {
    const {app} = this.props;
    const {state} = app; // the data for the app
    this.focusId = state.focusId || 'nameInput';
    const {selectedName} = state;
    const giftsForName = state.gifts[selectedName] || [];

    return (
      <div className="form-inline">
        <Modal bsSize="small"
          show={state.confirmDelete}
          onHide={app.onCloseConfirmDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete {selectedName} and
            his/her {giftsForName.length} gift ideas?
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={app.onCloseConfirmDeleteModal}>Cancel</Button>
            <Button onClick={app.onDeleteName}>OK</Button>
          </Modal.Footer>
        </Modal>

        <h2>Gift App</h2>

        <TextEntry id="nameInput"
          label="New Name"
          value={state.name}
          onChange={app.onChangeName}
          onAdd={app.onAddName}/>

        <NameSelect names={state.names}
          selectedName={selectedName}
          onSelect={app.onSelectName}
          onDelete={app.onConfirmDeleteName}/>

        <TextEntry id="giftInput"
          label="New Gift"
          value={state.gift}
          onChange={app.onChangeGift}
          onAdd={app.onAddGift}/>

        <GiftList gifts={giftsForName}
          selectedGift={state.selectedGift}
          onSelect={app.onSelectGift}
          onDelete={app.onDeleteGift}/>

        <Button className="btn btn-default"
          disabled={app.stateStack.length < 2}
          onClick={app.onUndo}>Undo</Button>
      </div>
    );
  }
}

export default GiftApp;
