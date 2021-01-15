// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';

/**
 * Renders alert messages using Bootstrap classes.
 */
export class Alert extends Component {
  alerts: { text: React.Node, type: string }[] = [];

  render() {
    return (
      <>
        {this.alerts.map((alert, i) => (
          <div key={i} className={'alert alert-' + alert.type} role="alert">
            {alert.text}
            <button
              className="close"
              onClick={() => {
                this.alerts.splice(i, 1);
              }}
            >
              &times;
            </button>
          </div>
        ))}
      </>
    );
  }

  static success(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'success' });
    });
  }

  static info(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'info' });
    });
  }

  static warning(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'warning' });
    });
  }

  static danger(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'danger' });
    });
  }
}

class NavBarBrand extends Component<{ children?: React.Node }> {
  render() {
    if (!this.props.children) return null;
    return (
      <NavLink className="navbar-brand" activeClassName="active" exact to="/">
        {this.props.children}
      </NavLink>
    );
  }
}

class NavBarLink extends Component<{ to: string, exact?: boolean, children?: React.Node }> {
  render() {
    if (!this.props.children) return null;
    return (
      <NavLink className="nav-link" activeClassName="active" exact={this.props.exact} to={this.props.to}>
        {this.props.children}
      </NavLink>
    );
  }
}

/**
 * Renders a navigation bar using Bootstrap classes
 */
export class NavBar extends Component<{ children: React.Element<typeof NavBarBrand | typeof NavBarLink | typeof Button.Light>[] }> {
  static Brand = NavBarBrand;
  static Link = NavBarLink;

  render() {
    return (
      <nav className="navbar navbar-expand-sm sticky-top bg-dark navbar-dark">
        {this.props.children.filter(child => child.type === NavBarBrand)}
        <ul className="navbar-nav">{this.props.children.filter(child => child.type === NavBarLink)}</ul>
        <ul className="navbar-nav ml-auto">{this.props.children.filter(child => child.type === Button.Light)}</ul>
      </nav>
    );
  }
}

export class MutedText extends Component<{ floatRight?: boolean, children: React.Node }> {
  render() {
    return this.props.floatRight ? (
      <small className="text-muted float-right">{this.props.children}</small>
    ) : (
      <small className="text-muted">{this.props.children}</small>
    );
  }
}

class CardText extends Component<{ children: React.Node }> {
  render() {
    return (
      <p className="card-text">{this.props.children}</p>
    );

  }
}

class CardTitle extends Component<{ big?: boolean, children: React.Node }> {
  render() {
    return this.props.big ? (
      <h2 className="card-title">{this.props.children}</h2>
    ) : (
      <h5 className="card-title mt-3">{this.props.children}</h5>
    );
  }
}

/**
 * Renders an information card using Bootstrap classes
 */
export class Card extends Component<{ imgSrc?: string, children: React.Node }> {
  static Text = CardText;
  static Title = CardTitle;

  render() {
    return (
      <div className="card">
        {this.props.imgSrc ? (<img className="card-img-top" src={this.props.imgSrc}/>) : (<div/>)}
        <div className="card-body">
          {this.props.children}
        </div>
      </div>
    );
  }
}

class GridTop extends Component<{ children: React.Node[] }> {
  render() {
    return (
      <div className="row">
        {this.props.children.map(child => (
          <div className="col-sm-6 mb-4 d-flex align-items-stretch">
            {child}
          </div>
        ))}
      </div>
    );
  }
}

class GridMain extends Component<{ children: React.Node[] }> {
  render() {
    return (
      <div className="row">
        {this.props.children.map(child => (
          <div className="col-sm-4 mb-4 d-flex align-items-stretch">
            {child}
          </div>
        ))}
      </div>
    );
  }
}

export class Grid extends Component<{ children: React.Element<typeof GridTop | typeof GridMain>[] }> {
  static Top = GridTop;
  static Main = GridMain;

  render() {
    return (
      <div className="container-fluid mt-4">
        {this.props.children}
      </div>
    );
  }
}

class ButtonDark extends Component<{
  onClick: () => mixed, // Any function
  children: React.Node
}> {
  render() {
    return (
      <button type="button" className="btn btn-dark mt-2 mr-2" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

class ButtonLight extends Component<{
  onClick: () => mixed, // Any function
  children: React.Node
}> {
  render() {
    return (
      <button type="button" className="btn btn-outline-light" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

class ButtonPrimary extends Component<{
  onClick: () => mixed, // Any function
  children: React.Node
}> {
  render() {
    return (
      <button type="button" className="btn btn-outline-primary mt-2 mr-2" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

class ButtonDanger extends Component<{
  onClick: () => mixed, // Any function
  children: React.Node
}> {
  render() {
    return (
      <button type="button" className="btn btn-danger mt-2 mr-2" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

export class Button {
  static Dark = ButtonDark;
  static Light = ButtonLight;
  static Primary = ButtonPrimary;
  static Danger = ButtonDanger;
}

class FormGroupRadioButton extends Component<{ name: string, id: string, value: string, children: React.Node}> {
  render() {
    return (
      <div className="form-check form-check-inline">
        <input className="form-check-input" type="radio" name={this.props.name} id={this.props.id} value={this.props.value}/>
        <label className="form-check-label" htmlFor={this.props.id}>
          {this.props.children}
        </label>
      </div>
    );
  }
}

class FormGroupTextArea extends Component<{id: string, title: string, rows: string, placeholder: string, value?: string, onChange: (event: SyntheticInputEvent<HTMLInputElement>) => mixed}> {
  render() {
    return (
      <div>
        <label htmlFor={this.props.id}>{this.props.title}</label>
        <textarea className="form-control" id={this.props.id} rows={this.props.rows} placeholder={this.props.placeholder} value={this.props.value} onChange={this.props.onChange}/>
      </div>
    );
  }
}

class FormGroupInput extends Component<{id: string, title: string, type: string, placeholder: string, value?: string, onChange: (event: SyntheticInputEvent<HTMLInputElement>) => mixed}> {
  render() {
    return (
      <div>
        <label htmlFor={this.props.id}>{this.props.title}</label>
        <input className="form-control" id={this.props.id} type={this.props.type} placeholder={this.props.placeholder} value={this.props.value} onChange={this.props.onChange}/>
      </div>
    );
  }
}

class FormGroupSelect extends Component<{id: string, title: string, defaultValue?: string, onChange: (event: SyntheticInputEvent<HTMLInputElement>) => mixed, children: React.Node}> {
  render() {
    return (
      <div>
        <label htmlFor={this.props.id}>{this.props.title}</label>
        <select className="form-control" id={this.props.id} defaultValue={this.props.defaultValue} onChange={this.props.onChange}>
          {this.props.children}
        </select>
      </div>
    );
  }
}

export class FormGroup extends Component<{ onChange?: (event: SyntheticInputEvent<HTMLInputElement>) => mixed, children: React.Node }> {
  static RadioButton = FormGroupRadioButton;
  static TextArea = FormGroupTextArea;
  static Input = FormGroupInput;
  static Select = FormGroupSelect;

  render() {
    return (
      <div className="form-group" onChange={this.props.onChange}>
        {this.props.children}
      </div>
    );
  }
}


class ListGroupItem extends Component<{ to?: string, children: React.Node }> {
  render() {
    return this.props.to ? (
      <NavLink className="list-group-item" activeClassName="active" to={this.props.to}>
        {this.props.children}
      </NavLink>
    ) : (
      <li className="list-group-item">{this.props.children}</li>
    );
  }
}

/**
 * Renders a list group using Bootstrap classes
 */
export class ListGroup extends Component<{
  children: React.Element<typeof ListGroupItem> | (React.Element<typeof ListGroupItem> | null)[] | null
}> {
  static Item = ListGroupItem;

  render() {
    return <ul className="list-group">{this.props.children}</ul>;
  }
}

