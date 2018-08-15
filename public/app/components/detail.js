'use strict';

import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from 'react-redux';

import { getDetail } from '../selectors';
import { hideDetail } from '../actions/user';

import Layout from './layout';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container : {
    position        : 'absolute',
    top             : 0,
    bottom          : 0,
    left            : 0,
    right           : 0,
    backgroundColor : theme.palette.background.paper,
  },
  image : {
    position : 'relative',
    height   : '100%',
    width    : '100%',
    objectFit : 'scale-down',
  }
});

const Detail = ({ item, close, classes }) => (
  <Layout title={`${item.album} - ${item.name}`} onClose={close}>
    <div className={classes.container}>
      <img src={'/images/raw/' + item.id} className={classes.image} />
    </div>
  </Layout>
);

Detail.propTypes = {
  item    : PropTypes.object.isRequired,
  close   : PropTypes.func.isRequired,
  classes : PropTypes.object.isRequired,
};

const mapStateToProps = () => {
  return (state) => ({
    item : getDetail(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  close : () => dispatch(hideDetail())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Detail));
