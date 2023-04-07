import {CellClassParams} from "ag-grid-community";

export let ROW_INDEX_TO_BLUR = 6;
export let IS_BLUR_ACTIVATED_FOR_NOT_LOGGED_USER = true;

export function getDefaultCellStyle(params: CellClassParams, isLoggedIn: boolean = false, isView2: boolean = false) {
  let style = {
    'white-space': 'normal',
    height: '100%',
    'line-height': isView2 ? '30px' : '40px',
    // minHeight: "10px",
    display: 'flex',
    'align-items': 'center',
  };
  blurCellIfIsNotLoggedIn(isLoggedIn, style, params.rowIndex);

  return style
}


export function totalSalaryCellStyle(params: CellClassParams, isLoggedIn: boolean = false) {
  let style = {
    height: '100%',
    display: 'flex ',
    'align-items': 'center',
    'background-color': '',
    'color': 'black',
  };

  blurCellIfIsNotLoggedIn(isLoggedIn, style, params.rowIndex);

  let salary = params.value;
  if (salary < 3)
    style["background-color"] = ''
  else if (salary < 20000)
    style["background-color"] = '#f8f8e7'
  else if (salary < 30000)
    style["background-color"] = '#f3f3d3'
  else if (salary < 40000)
    style["background-color"] = '#f0f0cb'
  else if (salary < 60000)
    style["background-color"] = '#eeeec3'
  else if (salary < 80000)
    style["background-color"] = '#eaeab3'
  else if (salary >= 80000)
    style["background-color"] = '#d5d56c'
  return style
}

export function totalYearsOfExperienceCellStyle(params: CellClassParams, isLoggedIn: boolean = false) {
  let style = {height: '100%', display: 'flex ', 'align-items': 'center', 'background-color': '', color: 'black',};
  blurCellIfIsNotLoggedIn(isLoggedIn, style, params.rowIndex);
  let experience = params.value;

  if (experience < 3)
    style["background-color"] = '#dadada'
  else if (experience < 6)
    style["background-color"] = '#cdcdcd'
  else if (experience < 9)
    style["background-color"] = '#c0c0c0'
  else if (experience < 20)
    style["background-color"] = '#b4b4b4'
  else if (experience >= 20)
    style["background-color"] = '#a7a7a7'


  return style;
}


export function blurCellIfIsNotLoggedIn(isLoggedIn: boolean, style: any, rowIndex = 0) {
  if (!isLoggedIn && rowIndex > ROW_INDEX_TO_BLUR) {
    if (IS_BLUR_ACTIVATED_FOR_NOT_LOGGED_USER) {
      style['-webkit-filter'] = 'blur(5px)'
      style['-moz-filter'] = 'blur(5px)'
      style['-o-filter'] = 'blur(5px)'
      style['-ms-filter'] = 'blur(5px)'
      style['filter'] = 'blur(5px)'
    }
  }
}

export function globalAgGridStyleDependingOnBlur(isLoggedIn, chosenUserRowIndex) {
  if (isLoggedIn)
    return null
  else if (chosenUserRowIndex > ROW_INDEX_TO_BLUR) {
    if (IS_BLUR_ACTIVATED_FOR_NOT_LOGGED_USER) {
      return {
        '-webkit-filter': 'blur(5px)',
        '-moz-filter': 'blur(5px)',
        '-o-filter': 'blur(5px)',
        '-ms-filter': 'blur(5px)',
        'filter': 'blur(5px)',
      }
    }
  }
  return null
}


export function globalHideLegendsBecauseOfBlur(isLoggedIn, chosenUserRowIndex) {
  if (IS_BLUR_ACTIVATED_FOR_NOT_LOGGED_USER)
    return isLoggedIn || chosenUserRowIndex < ROW_INDEX_TO_BLUR
  return true
}
