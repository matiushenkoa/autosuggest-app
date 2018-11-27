// @flow

import injectSheet from 'react-jss';
import React from 'react';
import styles from './Autosuggest.jss';

const KEYS = {
  DOWN: 40,
  ENTER: 13,
  UP: 38,
};

type Props = {
  classes: Object,
  items: Array<string>,
  placeholder: string,
};

type State = {
  activeItem: number,
  value: string,
};

type RefObject = {
  current: any,
};

class Autosuggest extends React.PureComponent<Props, State> {
  static styleRoot = 'Autosuggest';

  state = {
    activeItem: -1,
    value: '',
  }

  dropdownSize: number = 0;
  inputRef: RefObject = React.createRef();
  itemsListRef: Array<?HTMLElement> = [];
  searchBarDropdownRef: RefObject = React.createRef();

  preventEvent = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
  }

  onChange = (changeEvent: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ value: changeEvent.currentTarget.value });
  }

  onClick = (event: SyntheticEvent<HTMLElement>) => {
    this.setState({ value: event.currentTarget.textContent });
    this.inputRef.current.blur();
  }

  onKeyDown = (event: SyntheticKeyboardEvent<>) => {
    const { activeItem } = this.state;
    let activeIndex: number = activeItem;

    if (event.keyCode === KEYS.UP || event.keyCode === KEYS.DOWN || event.keyCode === KEYS.ENTER) {
      if (event.keyCode === KEYS.UP) {
        if (activeIndex < 1) {
          activeIndex = this.dropdownSize - 1;
        } else {
          activeIndex = activeIndex - 1;
        }

        this.setState({ activeItem: activeIndex });
      } else if (event.keyCode === KEYS.DOWN) {
        if (activeIndex === this.dropdownSize - 1) {
          activeIndex = 0;
        } else {
          activeIndex = activeIndex + 1;
        }

        this.setState({ activeItem: activeIndex });
      }

      const dropdownNode: ?HTMLElement = this.searchBarDropdownRef.current;

      if (!dropdownNode) {
        return null;
      }

      const focusedOptionNode = this.itemsListRef[activeIndex];

      if (!focusedOptionNode) {
        return null;
      }

      const scrollTop: number = dropdownNode.scrollTop;
      const scrollBottom: number = scrollTop + dropdownNode.offsetHeight;
      const optionTop: number = focusedOptionNode.offsetTop;
      const optionBottom: number = optionTop + focusedOptionNode.offsetHeight;

      if (scrollTop > optionTop || scrollBottom < optionBottom) {
        dropdownNode.scrollTop = focusedOptionNode.offsetTop;
      }

      if (event.keyCode === KEYS.ENTER) {
        this.setState({ value: focusedOptionNode.textContent });
        this.inputRef.current.blur();
      }

      event.preventDefault();
    } else {
      this.setState({ activeItem: -1 });
    }
  }

  renderItem(item: string, index: number) {
    const { classes } = this.props;
    const isActive: boolean = index === this.state.activeItem;

    return (
      <li
        className={isActive ? classes.itemActive : classes.item}
        key={`listItem)_${index}`}
        onMouseDown={this.preventEvent}
        onClick={this.onClick}
        // TODO: refactor with new refs API
        ref={ref => this.itemsListRef[index] = ref}
      >
        {item}
      </li>
    );
  }

  renderList = () => {
    const inputValue: string = this.state.value.toLowerCase();

    if (!inputValue) {
      return null;
    }

    const { items, classes } = this.props;
    const inputLength: number = inputValue.length;
    const filteredList: Array<string> = items.filter(item =>
      item.toLowerCase().slice(0, inputLength) === inputValue
    );
    const dropdownSize: number = filteredList.length;

    this.dropdownSize = dropdownSize;

    return (
      <ul ref={this.searchBarDropdownRef} className={classes.list}>
        {filteredList.map((item, index) => this.renderItem(item, index))}
      </ul>
    );
  }

  render() {
    const { classes, placeholder } = this.props;

    return (
      <div className={classes.inputWrapper}>
        <input
          ref={this.inputRef}
          autoComplete="off"
          className={classes.input}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          placeholder={placeholder}
          type="text"
          value={this.state.value}
        />
        {this.renderList()}
      </div>
    );
  }
}

export default injectSheet(styles)(Autosuggest);
