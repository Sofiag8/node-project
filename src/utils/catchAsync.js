// function to get rid of try catch blocks along the files
const catchAsync = (fn) => {
  return (request, response, next) => {
    fn(request, response, next).catch(next)
  }
}

module.exports = catchAsync
