import React, {useEffect, useState} from 'react';
import GetOptions from "./getOptions";

import { Button } from "@material-ui/core";
import './App.css'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Chip from "@material-ui/core/Chip";
import styled from 'styled-components';
import { generateUniqueID } from "web-vitals/dist/modules/lib/generateUniqueID";
import Select from '@material-ui/core/Select';


const useStyles = makeStyles((theme) => ({
  formControl: {
    display: 'inline-flex',
    justifyContent: 'center',
    marginTop: theme.spacing(10),
    marginRight: theme.spacing(0.2),
    minWidth: 130,
    verticalAlign: 'bottom',
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

const GridWrapper = styled.div`
    display: grid;
    margin-top: 80px;
    margin-bottom: 80px;
    grid-template-columns: repeat(${props => props.gridSide}, 24px);
    grid-template-rows: repeat(${props => props.gridSide}, 24px);
    justify-content: center;
`

const GridItem = styled.div`
    border: 1px solid black;
    margin:0 -1px -1px 0;
    background: ${props => props.color};
`

const getData = new GetOptions();

const App = () => {
  const [gridSide, setGridSide] = useState('');
  const [modeName, setModeName] = useState('');
  const [hoverArray, setHoverArray] = useState([]);
  const [start, setStart] = useState(false);

  const classes = useStyles();

  const handleStart = (e) => {
    e.preventDefault();
    setStart(true)
  }

  const handleChange = (event) => {
    setModeName(event.target.value);
  };

  useEffect(() => {
      setHoverArray(new Array(gridSide**2)
        .fill('')
        .map(el => ({label: `${el}`, color: 'white', key: generateUniqueID()}))
      )
      // setStart(() => false)
  }, [gridSide]);

  useEffect(() => {
    const fetchGridSize = async () => {
      if (modeName === 'easyMode') {
        const res = await getData.getEasyMode();
        setGridSide(res);
      } else if (modeName === 'normalMode') {
        const res = await getData.getNormalMode();
        setGridSide(res);
      } else if (modeName === 'hardMode') {
        const res = await getData.getHardMode();
        setGridSide(res);
      }
    };
    fetchGridSize();
  }, [modeName]);


  const HoverSquare = () => {
    const positionFinder = (index) => {
      let rowPos = Math.ceil((index + 1)/gridSide);
      let colPos = (index + 1)%gridSide !== 0 ? (index + 1)%gridSide : gridSide;
      return `row:${rowPos} col:${colPos}`;
    };

    let hoverSquare = hoverArray
      .reduce((result, value, index) => {
        if (value.color === 'deepskyblue') result.push(index);
          return result
      }, []);

    return (hoverSquare.map(item =>
      <Chip key={generateUniqueID()} label={positionFinder(item)} component="span"/>
      )
    )
  };

  return (
    <>
      <form onSubmit={handleStart}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Pick mode</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={modeName}
            onChange={handleChange}>
              <MenuItem value={'easyMode'}>Easy Mode</MenuItem>
              <MenuItem value={'normalMode'}>Normal Mode</MenuItem>
              <MenuItem value={'hardMode'}>Hard Mode</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" type="submit" value="Submit">
          Start
        </Button>
      </form>
      <GridWrapper gridSide={gridSide}>
        {hoverArray.map(el => {
          return (
            <GridItem key={el.key}
                      onMouseOver={() => {
              if (start) {
                setHoverArray(currentArray => currentArray.map(item => item.key === el.key ? {
                  ...item,
                  color: item.color === 'white' ? 'deepskyblue' : 'white'
                } : item));
              }}} color={el.color}>
              {el.label}
            </GridItem>
          )})
        }
      </GridWrapper>
      <h1>
        {start ? 'Hovered Squares:' : ''}
      </h1>
      <div className={classes.root}>
        <HoverSquare/>
      </div>
    </>
  );
};

export default App;
