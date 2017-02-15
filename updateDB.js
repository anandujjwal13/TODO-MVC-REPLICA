module.exports = function(sequelize, res, description, status, id) {
    let query = `UPDATE tasks SET description = :description_, status = :status_ where id = :id_;`
    if (description === '') {
        query = `UPDATE tasks SET status = :status_ where id = :id_;`
        if (status === '') {
            res.send('No content to update')
        }
    } else if (status === '') {
        query = `UPDATE tasks SET description = :description_ where id = :id_;`
    }
    sequelize.query(query, {
            replacements: { description_: description, status_: status, id_: id }
        })
        .then(function(task) {
            if (task[1].rowCount) {
                console.log('The task has been updated')
                res.send(`The task with id=${id} has been updated`)
            } else {
                console.log('The task doesnt exist to update')
                res.send(`The task with id=${id} doesnt exist to update`)
            }
        })
        .catch(function(error) {
            console.log('Error in Updating')
            res.send(error)
        })
}