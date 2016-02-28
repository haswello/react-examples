// ESLint can't detect when a variable is only used in JSX.
/* eslint no-unused-vars: 0 */

import autobind from './autobind';
import GiftList from './gift-list';
import NameSelect from './name-select';
import React from 'react'; //eslint-disable-line
import {Button, Modal} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import TextEntry from './text-entry';

// Styling
import 'bootstrap-loader';
import './app.scss';

class GiftApp extends React.Component {
  constructor() {
    super(); // must call this before accessing "this"

    this.state = {
      focusId: 'nameInput',
      gift: '',
      gifts: {},
      name: '',
      names: []
    };
    this.stateStack = [this.state];

    autobind(this, 'on');

    // Prebind event handling methods that need an argument.
    this.onChangeGift = this.onChange.bind(this, 'gift');
    this.onChangeName = this.onChange.bind(this, 'name');
    this.onChangeSelectedGift = this.onChange.bind(this, 'selectedGift');
    this.onChangeSelectedName = this.onChange.bind(this, 'selectedName');
  }

  componentDidMount() {
    this.focus();
  }

  componentDidUpdate() {
    this.focus();
  }

  focus() {
    const focusId = this.state.focusId;
    if (focusId) document.getElementById(focusId).focus();
  }

  onAddGift() {
    const {gift, gifts, selectedName} = this.state;
    const giftsForName = gifts[selectedName] || [];
    if (giftsForName.includes(gift)) return;

    const newGiftsForName = giftsForName.concat(gift).sort();
    const newGifts =
      Object.assign({}, gifts, {[selectedName]: newGiftsForName});
    this.pushState({
      gift: '',
      gifts: newGifts
    });
  }

  onAddName() {
    const {name, names} = this.state;
    if (names.includes(name)) return;

    this.pushState({
      focusId: 'giftInput',
      name: '',
      names: names.concat(name).sort(),
      selectedName: name
    });
  }

  onChange(name, event) {
    // Don't want this on stateStack.
    this.setState({
      focusId: name + 'Input',
      [name]: event.target.value
    });
  }

  onCloseModal() {
    // Don't want this on stateStack.
    this.setState({confirmDelete: false});
  }

  /**
   * Determines if the currently selected name has at least one gift.
   */
  selectedNameHasGifts() {
    const {gifts, selectedName} = this.state;
    const giftsForName = gifts[selectedName];
    return giftsForName && giftsForName.length;
  }

  onConfirmDeleteName() {
    if (this.selectedNameHasGifts()) {
      // Don't want this on stateStack.
      this.setState({confirmDelete: true});
    } else {
      this.onDeleteName();
    }
  }

  onDeleteGift() {
    const {gifts, selectedGift, selectedName} = this.state;
    const giftsForName = gifts[selectedName];
    const newGiftsForName = giftsForName.filter(g => g !== selectedGift);
    const newGifts =
      Object.assign({}, gifts, {[selectedName]: newGiftsForName});
    this.pushState({
      gifts: newGifts,
      selectedGift: newGiftsForName.length ? newGiftsForName[0] : null
    });
  }

  onDeleteName() {
    const {gifts, names, selectedName} = this.state;
    const newNames = names.filter(n => n !== selectedName);

    // Remove the gifts for the selected name.
    const newGifts = Object.assign({}, gifts);
    delete newGifts[selectedName];

    this.pushState({
      confirmDelete: false,
      names: newNames,
      gifts: newGifts,
      selectedName: newNames.length ? newNames[0] : null
    });
  }

  onSelectGift(event) {
    this.pushState({selectedGift: event.target.value});
  }

  onSelectName(event) {
    this.pushState({
      focusId: 'giftInput',
      selectedName: event.target.value
    });
  }

  onUndo() {
    const stack = this.stateStack;
    stack.pop();
    const prevState = stack[stack.length - 1];
    this.setState(prevState);
  }

  pushState(stateMods) {
    this.setState(stateMods, () => this.stateStack.push(this.state));
  }

  render() {
    // This is rendered every time, but subcomponents are not.
    const {gift, gifts, name, names, selectedGift, selectedName} = this.state;
    const giftsForName = gifts[selectedName] || [];

    return (
      <div className="form-inline">
        <Modal bsSize="small"
          show={this.state.confirmDelete}
          onHide={this.onCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete {selectedName} and
            his/her {giftsForName.length} gift ideas?
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onCloseModal}>Cancel</Button>
            <Button onClick={this.onDeleteName}>OK</Button>
          </Modal.Footer>
        </Modal>

        <h2>Gift App</h2>

        <TextEntry id="nameInput"
          label="New Name"
          value={name}
          onChange={this.onChangeName}
          onAdd={this.onAddName}/>

        <NameSelect names={names}
          selectedName={selectedName}
          onSelect={this.onSelectName}
          onDelete={this.onConfirmDeleteName}/>

        <TextEntry id="giftInput"
          label="New Gift"
          value={gift}
          onChange={this.onChangeGift}
          onAdd={this.onAddGift}/>

        <GiftList gifts={giftsForName}
          selectedGift={selectedGift}
          onSelect={this.onSelectGift}
          onDelete={this.onDeleteGift}/>

        <Button classNames="btn btn-default"
          disabled={this.stateStack.length < 2}
          onClick={this.onUndo}>Undo</Button>
      </div>
    );
  }
}

ReactDOM.render(<GiftApp/>, document.getElementById('content'));
