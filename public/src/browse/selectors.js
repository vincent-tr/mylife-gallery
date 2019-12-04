'use strict';

import { io, createSelector } from 'mylife-tools-ui';

const getBrowse = state => state.browse;
export const getViewId = state => getBrowse(state).viewId;
const getView = state => io.getView(state, getViewId(state));
export const getDisplay = state => getBrowse(state).display;

export const getDisplayView = createSelector(
  [ getView, getDisplay ],
  (view, display) => {
    const { sortField, sortOrder } = display;
    const sourceArray = view.valueSeq().toArray();
    if(!sortField) {
      return sourceArray;
    }

    const comparerFactory = comparerFactories[sortField];
    if(!comparerFactory) {
      throw new Error(`Unsupported sort field: '${sortField}'`);
    }

    const order = orderNumerics[sortOrder];
    if(order === undefined) {
      throw new Error(`Unsupported sort order: '${sortOrder}'`);
    }

    const comparer = comparerFactory(sortField, order);
    const array = Array.from(sourceArray);
    array.sort(comparer);
    return array;
  }
);

const orderNumerics = {
  asc: 1,
  desc: -1
};

const comparerFactories = {
  date: createSimpleFieldComparer,
  integrationDate: createSimpleFieldComparer,
  path: createPathComparer,
};

function createSimpleFieldComparer(field, order) {
  return (doc1, doc2) => {
    const comp = compareSimpleField(field, doc1, doc2) || compareDefault(doc1, doc2);
    return comp * order;
  };
}

function createPathComparer(field, order) {
  return (doc1, doc2) => {
    const comp = comparePaths(doc1, doc2) || compareDefault(doc1, doc2);
    return comp * order;
  };
}

function compareSimpleField(field, doc1, doc2) {
  return compareValue(doc1[field], doc2[field]);
}

function comparePaths(doc1, doc2) {
  const paths1 = doc1.paths;
  const paths2 = doc2.paths;

  // if both duplicates consider them equal
  if(paths1.length > 1 && paths2.length > 1) {
    return 0;
  }

  // move duplicates at the end
  if(paths1.length > 1) {
    return 1;
  }

  if(paths2.length > 1) {
    return -1;
  }

  return compareValue(paths1[0].path, paths2[0].path);
}

function compareDefault(doc1, doc2) {
  return compareSimpleField('_id', doc1, doc2);
}

function compareValue(val1, val2) {
  return val1 < val2 ? -1 : 1;
}
