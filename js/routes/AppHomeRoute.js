import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    cards: () => Relay.QL`
      query {
        cards
      }
    `,
  };
  static routeName = 'AppHomeRoute';
}
