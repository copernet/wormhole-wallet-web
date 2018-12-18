/**
** @Description: Author Message
** @author Rick
** @date 2018/9/17
**/

const timefunc = {
  getNow (valid) {
    let today = new Date()
    return (valid.subtractFromDate(today, { hours: -1 }))
  }
}

export default timefunc
