import { Client } from 'pg';
import "@babel/polyfill";

interface Connection {
  user:     string;
  host:     string;
  database: string;
  password: string;
  port:     number;
};

const devSetup: Connection = {
  user:     'postgres',
  host:     'localhost',
  database: 'dvds',
  password: 'postgres',
  port:     5432,
};

class PgDriver {

  public setupClient({ user, host, database, password, port }: Connection): Client {
    return new Client({
      user:     user,
      host:     host,
      database: database,
      password: password,
      port:     port
    });
  };

  public async query(queryParams: string, client?: Client) {
    if (!client) {
      client = this.setupClient(devSetup);
    }

    await client.connect();
    const result = await client.query({
      rowMode: 'array',
      text: queryParams
    });

    await client.end();
    return result.rows;
  };
}

export default PgDriver;