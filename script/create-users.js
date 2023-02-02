const { faker } = require('@faker-js/faker')
const Pool = require('pg').Pool
const axios = require('axios')

const users = []
const gender_list = ["male", "female", "other"]
const tags = []
const tag_names = ["dogs", "cinema", "travel", "books", "astrology", "islam",
    "food", "hiking", "sports", "gaming", "art", "fitness", "judaism",
    "nature", "animals", "cars", "tech", "fashion", "beauty", "buddhism",
    "health", "science", "history", "politics", "philosophy", "christianity",
    "psychology", "cats", "baking", "long walks on the beach", "hinduism"]

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'db',
    database: 'matcha',
    port: 5432
})

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

const connectToDatabase = () => {
    pool.connect((err, client, release) => {
        if (err) {
            console.log('Error acquiring client', err.stack)
            console.log('Retrying in 5 seconds...')
            setTimeout(connectToDatabase, 5000)
        } else {
            console.log('Connected to database')
            initTags()
            initUsers()
                .then(() => {
                    console.log("User creation finished without errors.")
                })
        }
    })
}
connectToDatabase()

const initTags = async () => {
    for (let i = 0; i < tag_names.length; i++) {
        let sql = `SELECT * FROM tags WHERE tag_content = LOWER($1)`
        let values = [tag_names[i]]
        let result = await pool.query(sql, values)
        if (result.rows.length === 0) {
            sql = `INSERT INTO tags (tag_content) VALUES (LOWER($1))`
            values = [tag_names[i]]
            await pool.query(sql, values)
        }
        let tag = {
            tag_content: tag_names[i],
            tagged_user: []
        }
        tags.push(tag)
    }
}

const createUser = async (gender) => {
    let firstname, lastname
    if (gender === "man") {
        firstname = faker.name.firstName('male')
        lastname = faker.name.lastName('male')
    } else if (gender === "female") {
        firstname = faker.name.firstName('female')
        lastname = faker.name.firstName("female")
    } else {
        firstname = faker.name.firstName()
        lastname = faker.name.lastName()
    }
    let username = faker.internet.userName(firstname, lastname)
    let email = faker.internet.email(firstname, lastname)
    let user = {
        username,
        firstname,
        lastname,
        email,
        password: "$2b$10$7yu6NkhTEk/uCAsXjlAS2OqpDQ2mSP0WQCNtKK97hCDDC12xB/PPa", // password: Matcha1!
        verified: "YES"
    }
    users.push(user)
    let sql = `INSERT INTO users (username, firstname, lastname, email, password, verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`
    let values = [user.username, user.firstname, user.lastname, user.email, user.password, user.verified]
    let res = await pool.query(sql, values)
    return (res.rows[0].id)
}

const createUserSettings = async (id, gender) => {
    let age = getRandomInt(18, 120)
    let sexual_pref = ["bisexual", "male", "female"].random()
    let biography = faker.lorem.paragraph()
        var coordinates = faker.address.nearbyGPSCoordinate([60.179700, 24.934400], 50, true)
        // var city_data = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coordinates[0]}&longitude=${coordinates[1]}&localityLanguage=en`)
        // var city_data = await axios.get(`https://api.tomtom.com/search/2/reverseGeocode/crossStreet/${coordinates[0]}-${coordinates[1]}.json?limit=0&spatialKeys=false&radius=10000&allowFreeformNewLine=false&view=Unified&key=${process.env.GEO_API}`)
        // var city_data = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${coordinates[0]}&lon=${coordinates[1]}&type=city&lang=en&limit=1&format=json&apiKey=${process.env.GEO_API}`)
        // console.log("CITY_DATA", city_data)
        // console.log("CITY_DATA.DATA.RESULTS[0].formatted", city_data.data.results[0].formatted)
        // var user_location = city_data.data.results[0].formatted
        var user_location = "Finland" 
        // if (!user_location) {
        //     user_location = "World"
        // }

    let ip_location = `(${coordinates[0]}, ${coordinates[1]})`
    let sql = `INSERT INTO user_settings (user_id, gender, age, sexual_pref, biography, user_location, ip_location)
				VALUES ($1, $2, $3, $4, $5, $6, $7)`
    let values = [id, gender, age, sexual_pref, biography, user_location, ip_location]
    await pool.query(sql, values)
}

const createFameRating = async (id, tag_count) => {
    let sql = `INSERT INTO fame_rates (user_id, setup_pts, picture_pts, tag_pts, like_pts, connection_pts, total_pts)
				VALUES ($1, $2, $3, $4, $5, $6, $7)`
    let values = [id, 5, 2, tag_count, 0, 0, 7 + tag_count]
    await pool.query(sql, values)
}

const createTags = async (id) => {
    // Let's assign each user between 1 and 5 tags.
    let tag_count = getRandomInt(1, 5)
    let user_tags = []
    for (let i = 0; i < tag_count; i++) {
        let tag = tags.random()
        while (user_tags.includes(tag)) {
            tag = tags.random()
        }
        user_tags.push(tag)
        tag.tagged_user.push(id)
    }
    for (let i = 0; i < tags.length; i++) {
        for (let j = 0; j < tags[i].tagged_user.length; j++) {
            let sql = `UPDATE tags SET tagged_users = array_append(tagged_users, $1)
						WHERE LOWER(tag_content) = LOWER($2)
						AND (tagged_users @> array[$1]::INT[]) IS NOT TRUE`
            let values = [tags[i].tagged_user[j], tags[i].tag_content]
            await pool.query(sql, values)
        }
    }
    return tag_count
}

const getImageUrl = async (picture) => {
    const image = await axios.get(picture)
    const image_url = image.request.res.responseUrl
    return (image_url)
}

const createPicture = async (id) => {
    // Replace 'people' with what we want the user pics to be about.
    let picture = faker.image.people(640, 640)
    let image = await getImageUrl(picture)
    let sql = `INSERT INTO user_pictures (user_id, picture_data, profile_pic)
				VALUES ($1, $2, $3)`
    let values = [id, image, 'YES']
    await pool.query(sql, values)
}

const initUsers = async () => {
    console.log("User creation started")

    for (let i = 0; i < 500; i++) {
        console.log("Creating user: " + i)
        let gender = gender_list.random()
        let id = await createUser(gender)
        await createUserSettings(id, gender)
        let tag_count = await createTags(id)
        await createFameRating(id, tag_count)
        await createPicture(id)
    }
}