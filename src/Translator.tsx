import * as React from "react";
import PgDriver from "./db/pg-driver";

class Translator extends React.Component {

  public state = {
    data: new Array(),
  };

  public fetchData: Promise<void>;

  public pg: PgDriver;

  constructor(props: object) {
    super(props);

    this.pg = new PgDriver();
  }

  componentDidMount() {
    const result = this.pg.query('SELECT * FROM category');
    result.then(res => {
      console.log(res);
      this.setState({
        data: res
      });
    })
    // .then(
    //   res => {
    //     this.setState({ data: (res.map(item => {
    //       delete item[2]
    //       return item
    //     })) })
    //   }
    // ).catch(err => console.error(err));
  }

  componentWillUnmount() {
    if (this.fetchData) {
      delete this.fetchData;
    }
  }


  render(): JSX.Element {
    const element = (!this.state.data) 
    ? (
      <span>
        Nothing to show
      </span>
    ) 
    : (
      <ul>
          {this.state.data.map(([i, c, d]) => 
            <li key={i}>{i}: {c}</li>
          )}
      </ul>
    );

    return element;
  }
}

export default Translator;
