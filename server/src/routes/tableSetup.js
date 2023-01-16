module.exports = function (app, pool, bcrypt) {

    app.post('/api/tableSetup', async (request, response) => {

        const populateTags = async () => {

            var sql = `SELECT * FROM tags;`
            const result = await pool.query(sql)
            if (result.rows.length < 1) {
                sql = `
                INSERT INTO tags (tag_content) VALUES ('Dogs');
                INSERT INTO tags (tag_content) VALUES ('Cinema');
                INSERT INTO tags (tag_content) VALUES ('Sports');
                INSERT INTO tags (tag_content) VALUES ('Video games');
                INSERT INTO tags (tag_content) VALUES ('Baking');
                INSERT INTO tags (tag_content) VALUES ('Long walks on the beach');
                `
                await pool.query(sql)
                console.log('Table \'tags\' was empty. The table is now populated.')
            } else {
                console.log('Table \'tags\' is already populated. Proceeding without adding rows.')
                return
            }

        }

        const createTables = async () => {
            // With params: const execute = async (query, params = []) => {
            const execute = async (query, tableName) => {
                try {
                    const res = await pool.query(query)
                    if (res) {
                        console.log(`Table creation query for the table ${tableName} has run without errors.`)
                        // console.log('res here: ', res)
                        // console.log('query here: ', query)
                    }
                } catch (error) {
                    console.error(`An error occurred when creating table ${tableName}: `, error, 'END OF ERROR MESSAGE')
                }
            }

            return Promise.all([
                execute(`
                CREATE TABLE IF NOT EXISTS test_users (
                users_id SERIAL PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL
                );
                `, 'test_users'),

                execute(`
                CREATE TABLE IF NOT EXISTS users (
                id SERIAL NOT NULL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                firstname VARCHAR(255) NOT NULL,
                lastname VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                last_connection TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                verified BOOLEAN NOT NULL DEFAULT false
                );
                `, 'users'),

                execute(`
                CREATE TABLE IF NOT EXISTS user_settings (
                running_id SERIAL NOT NULL PRIMARY KEY,
                user_id INT NOT NULL,
                gender VARCHAR(255) NOT NULL,
                age INT NOT NULL,
                sexual_pref VARCHAR(255) NOT NULL,
                biography VARCHAR(65535) NOT NULL,
                fame_rating INT NOT NULL DEFAULT 0,
                user_location VARCHAR(255) NOT NULL,
                IP_location POINT NOT NULL
                );
                `, 'user_settings'),

                execute(`
                CREATE TABLE IF NOT EXISTS tags (
                    tag_id SERIAL NOT NULL PRIMARY KEY,
                    tag_content VARCHAR(255) NOT NULL,
                    tagged_users INT[] DEFAULT array[]::INT[]
                );
                `, 'tags'),

                execute(`
                CREATE TABLE IF NOT EXISTS verification_codes (
                    running_id SERIAL NOT NULL PRIMARY KEY,
                    user_id INT NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    code VARCHAR(255) NOT NULL
                );
                `, 'verification_codes'),
            ])
        }

        createTables()
        .then(() => {
            populateTags()
        }).catch ((error) => {
            console.log('Something went wrong in tableSetup.js: ', error)
        })
        
    })
}