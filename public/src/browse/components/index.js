'use strict';

import { React, useMemo, useState, mui, useDispatch, useLifecycle, immutable } from 'mylife-tools-ui';
import { browseEnter, browseLeave } from '../actions';
import Criteria from './criteria';
import List from './list';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    enter : () => dispatch(browseEnter()),
    leave : () => dispatch(browseLeave()),
  }), [dispatch]);
};

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflowY: 'auto'
  },
  criteria: {
  },
  list: {
    flex: '1 1 auto'
  }
});

const initialCriteria = {
  children: false,
  minDate: null,
  maxDate: null,
  account: null,
  groups: new immutable.List([ null ])
};

const initialDisplay = {
  invert: true,
  fullnames: false,
};

const Browse = () => {
  const classes = useStyles();
  const { enter, leave } = useConnect();
  useLifecycle(enter, leave);

  const [criteria, setCriteria] = useState(initialCriteria);
  const [display, setDisplay] = useState(initialDisplay);

  return (
    <div className={classes.container}>
      <Criteria className={classes.criteria} criteria={criteria} onCriteriaChanged={setCriteria} display={display} onDisplayChanged={setDisplay} />
      <List className={classes.list} display={display}  />
    </div>
  );
};

export default Browse;
