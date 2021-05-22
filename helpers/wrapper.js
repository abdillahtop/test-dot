const data = (res, status, data, description = '', code = 200) => {
  return res.status(code).send(
    {
      success: status,
      data,
      message: description,
      code: code
    });
}

const error = (res, status, description = '', code = 500) => {
  return res.status(code).send(
    {
      success: status,
      data: '',
      message: description,
      code: code
    });
}
module.exports = {
  data,
  error
}