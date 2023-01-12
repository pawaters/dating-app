module.exports = (app, pool) => {
    app.get('/api/browsing/tags', async (request, response) => {
        try {
            var sql = `SELECT tag_content FROM tags ORDER BY tag_id ASC;`
            const result = await pool.query(sql)
            console.log('result.rows: ', result.rows);
            response.send(result.rows)
        } catch (error) {
            console.log('catching error from browsing.js')
            response.send(false)
        }
    })
}

