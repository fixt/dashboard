import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Card list</h1>
        <ul>
          {this.props.cards.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.title} (ID: {edge.node.id})</li>
          )}
        </ul>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        widgets(first: 10) {
          edges {
            node {
              id,
              name,
            },
          },
        },
      }
    `,
  },
});
