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
            const execute = async (query, taskDescription) => {
                try {
                    const res = await pool.query(query)
                    if (res) {
                        console.log(`Query '${taskDescription}' has run without errors.`)
                        // console.log('res here: ', res)
                        // console.log('query here: ', query)
                    }
                } catch (error) {
                    console.error(`An error occurred when running the query ${taskDescription}: `, error, 'END OF ERROR MESSAGE')
                }
            }

            return Promise.all([
                execute(`
                CREATE TABLE IF NOT EXISTS test_users (
                users_id SERIAL PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL
                );
                `, "Creation of the table 'test_users'"),

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
                `, "Creation of the table 'users'"),

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
                ip_location POINT NOT NULL
                );
                `, "Creation of the table 'user_settings'"),

                execute(`
                CREATE TABLE IF NOT EXISTS tags (
                    tag_id SERIAL NOT NULL PRIMARY KEY,
                    tag_content VARCHAR(255) NOT NULL,
                    tagged_users INT[] DEFAULT array[]::INT[]
                );
                `, "Creation of the table 'tags'"),

                execute(`
                CREATE TABLE IF NOT EXISTS verification_codes (
                    running_id SERIAL NOT NULL PRIMARY KEY,
                    user_id INT NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    code VARCHAR(255) NOT NULL
                );
                `, "Creation of the table 'verification_codes'"),

                execute(`
                CREATE TABLE IF NOT EXISTS user_images (
                    picture_id SERIAL NOT NULL PRIMARY KEY,
                    user_id INT NOT NULL,
                    picture_data TEXT NOT NULL,
                    profile_pic BOOLEAN NOT NULL DEFAULT false
                );
                `, "Creation of the table 'user_images'"),

                execute(`
                CREATE TABLE IF NOT EXISTS fame_rates (
                    famerate_id SERIAL NOT NULL PRIMARY KEY,
                    user_id INT NOT NULL,
                    setup_pts INT NOT NULL DEFAULT 0,
                    picture_pts INT NOT NULL DEFAULT 0,
                    tag_pts INT NOT NULL DEFAULT 0,
                    like_pts INT NOT NULL DEFAULT 0,
                    connection_pts INT NOT NULL DEFAULT 0,
                    total_pts INT NOT NULL DEFAULT 0
                );
                `, "Creation of the table 'fame_rates'"),

                execute(`
                CREATE TABLE IF NOT EXISTS notifications (
                    notification_id SERIAL NOT NULL PRIMARY KEY,
                    user_id INT NOT NULL,
                    sender_id INT NOT NULL,
                    notification_text VARCHAR(255) NOT NULL,
                    redirect_path VARCHAR(255),
                    read BOOLEAN NOT NULL DEFAULT false,
                    time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                `, "Creation of the table 'notifications'"),

                execute(`
                CREATE TABLE IF NOT EXISTS watches (
                    watch_id SERIAL NOT NULL PRIMARY KEY,
                    watcher_id INT NOT NULL,
                    target_id INT NOT NULL,
                    time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                `, "Creation of the table 'watches'"),

                execute(`
                CREATE TABLE IF NOT EXISTS reports (
                    report_id SERIAL NOT NULL PRIMARY KEY,
                    sender_id INT NOT NULL,
                    target_id INT NOT NULL,
                    time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                `, "Creation of the table 'reports'"),

                execute(`
                CREATE TABLE IF NOT EXISTS likes (
                    running_id SERIAL NOT NULL PRIMARY KEY,
                    liker_id INT NOT NULL,
                    target_id INT NOT NULL,
                    liketime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                `, "Creation of the table 'likes'"),

                execute(`
                CREATE TABLE IF NOT EXISTS connections (
                    connection_id SERIAL NOT NULL PRIMARY KEY,
                    user1_id INT NOT NULL,
                    user2_id INT NOT NULL
                );
                `, "Creation of the table 'connections'"),

                execute(`
                CREATE TABLE IF NOT EXISTS blocks (
                    block_id SERIAL NOT NULL PRIMARY KEY,
                    blocker_id INT NOT NULL,
                    target_id INT NOT NULL
                );
                `, "Creation of the table 'blocks'"),

                execute(`
                CREATE TABLE IF NOT EXISTS chat (
                    chat_id SERIAL NOT NULL PRIMARY KEY,
                    connection_id INT NOT NULL,
                    sender_id INT NOT NULL,
                    message TEXT NOT NULL,
                    read BOOLEAN NOT NULL DEFAULT false,
                    time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                `, "Creation of the table 'chat'"),

                execute(`
                CREATE TABLE IF NOT EXISTS password_resets (
                    running_id SERIAL NOT NULL PRIMARY KEY,
                    user_id INT NOT NULL,
                    reset_code VARCHAR(255) NOT NULL,
                    expire_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                `, "Creation of the table 'password_resets'"),

                execute(`
                SET TIME ZONE 'Europe/Helsinki';
                `, 'Setting the timezone to Europe/Helsinki'),

                execute(`
                CREATE OR REPLACE FUNCTION calculate_distance(lat1 float, lon1 float, lat2 float, lon2 float, units varchar)
                RETURNS float AS $distance$
                	DECLARE
                		distance float = 0;
                		radlat1 float;
                		radlat2 float;
                		theta float;
                		radtheta float;
                	BEGIN
                		IF lat1 = lat2 AND lon1 = lon2
                			THEN RETURN distance;
                		ELSE
                			radlat1 = pi() * lat1 / 180;
                			radlat2 = pi() * lat2 / 180;
                			theta = lon1 - lon2;
                			radtheta = pi() * theta / 180;
                			distance = (sin(radlat1) * sin(radlat2)) + (cos(radlat1) * cos(radlat2) * cos(radtheta));
                                
                			IF distance > 1 THEN distance = 1; END IF;
                                
                			distance = acos(distance);
                			distance = distance * 180 / pi();
                			distance = distance * 60 * 1.1515;
                                
                			IF units = 'K' THEN distance = distance * 1.609344; END IF;
                			IF units = 'N' THEN distance = distance * 0.8684; END IF;
                                
                			RETURN distance;
                		END IF;
                	END;
                $distance$ LANGUAGE plpgsql;
                `, "Creation of the GPS distance function"),
            ])
        }

        createTables()
            .then(() => {
                populateTags()
            }).catch((error) => {
                console.log('Something went wrong in tableSetup.js: ', error)
            })

    })
}