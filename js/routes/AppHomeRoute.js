import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    cards: () => Relay.QL`
      query {
        cards(first: 10)
      }
    `,
  };
  static routeName = 'AppHomeRoute';
}
