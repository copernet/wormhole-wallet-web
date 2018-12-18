/**
** @Description: Author Message
** @author Rick
** @date 2018/9/11
**/

// toogle sidebar

export const toogleSide = (state, type) => {
  if (type === 'stopToogle') {
    event.stopPropagation()
    return false
  }
  if (!state.sideType) {
    state.sideType = type
  } else {
    state.sideType === type ? state.sideType = '' : state.sideType = type
  }
}
