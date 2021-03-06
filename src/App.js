import Env from './Env';
import Monitoring from './Monitoring';
import React from 'react';

class QueryTooltip extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.query !== this.props.query;
  }

  render() {
    return (
      <div className="popover left">
        <div className="popover-content">
          {this.props.query}
        </div>

        <div className="arrow"/>
      </div>
    );
  }
}

class Query extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.elapsed !== this.props.elapsed || nextState.isHovered && !this.state.isHovered) {
      return true;
    } else {
      return false;
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      isHovered: false,
    };
  }

  _handleMouseOver() {
    this.setState({isHovered: true});
  }

  _handleMouseOut() {
    this.setState({isHovered: false});
  }

  render() {
    return (
      <td className="Query" onMouseOver={this._handleMouseOver.bind(this)} onMouseOut={this._handleMouseOut.bind(this)}>
        <span>
          {this.props.elapsed}
        </span>

        {this.state.isHovered &&
          <QueryTooltip
            query={this.props.query}
            isHovered={this.state.isHovered} />}
      </td>
    );
  }
}

class DatabaseName extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <td className="dbname">
        {this.props.name}
      </td>
    );
  }
}

class QueryCount extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.count !== this.props.count;
  }

  render() {
    let { count, className } = this.props;

    return (
      <td className="query-count">
        <span className={className}>
          {count}
        </span>
      </td>
    );
  }
}

class Database extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.lastMutationId !== this.props.lastMutationId;
  }

  render() {
    let { lastSample, name } = this.props;
    let { topFiveQueries, nbQueries: count } = lastSample;

    return (
      <tr>
        <DatabaseName name={name} />
        <QueryCount count={count} className={lastSample.countClassName} />

        { topFiveQueries.map((query, index) => (
          <Query
            key={index}
            query={query.query}
            elapsed={query.formatElapsed}
          />
        ))}
      </tr>
    );
  }
}


export default class DBMon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      databases: [],
    };
  }

  componentDidMount() {
    this.loadSamples();
  }

  render() {
    let { databases } = this.state;

    return (
      <table className="table table-striped latest-data">
        <tbody>
          { databases.map((database, i) => (
            <Database
              key={i}
              lastMutationId={database.lastMutationId}
              name={database.dbname}
              lastSample={database.lastSample}
            />
          )) }
        </tbody>
      </table>
    );
  }

  loadSamples() {
    this.setState({
      databases: Env.generateData(false).toArray()
    }, () => {
      Monitoring.renderRate.ping();
      setTimeout(() => this.loadSamples(), Env.timeout);
    });
  }
}
