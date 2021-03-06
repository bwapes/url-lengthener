const pool = require('./utils/pool');
const generateUrl = require('./utils/generateUrl');

class Url {
  id;
  userUrl;
  generatedUrl;

  constructor(url) {
    this.id = url.id;
    this.userUrl = url.user_url;
    this.generatedUrl = url.generated_url;

  }

  static async insert(url) {
    const generatedUrl = await generateUrl();
    const { rows } = await pool.query(
      'INSERT INTO urls (user_url, generated_url) VALUES ($1, $2) RETURNING *',
      [url.userUrl, generatedUrl]

    );
    return rows[0];
  }

  static async findByUrl(string) {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM urls WHERE user_url=$1', [string]
      );
      return rows[0];
    } catch(e) {
      return `${string} is an invalid url`;
    }
  }

  static async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM urls'
    );

    return rows;
  }

  static async findByGeneratedUrl(random) {
    const { rows } = await pool.query(
      'SELECT * FROM urls WHERE generated_url=$1', [random]
    );

    return new Url(rows[0]);
  }

  static async update(id, newUrl) {
    const { rows } = await pool.query(
      `UPDATE urls
      SET user_url=$1
      WHERE id=$2
      RETURNING *
      `, [newUrl.userUrl, id]
    );
    return new Url(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM urls WHERE id=$1 RETURNING *', [id]
    );

    return new Url(rows[0]);
  }

  

}

module.exports = Url;
