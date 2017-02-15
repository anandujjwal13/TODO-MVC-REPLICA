module.exports = function (sequelize, res) {
  sequelize.query('SELECT id,description,status FROM tasks order by id',
    { type: sequelize.QueryTypes.SELECT })
    .then(function (tasks) {
      res.json(tasks)
    })
    .catch(function () {
      console.log('Error in reading todo list')
      res.send('Error in reading todo list')
    })
}
