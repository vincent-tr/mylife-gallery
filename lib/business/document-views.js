'use strict';

const { createLogger, notifyView, StoreContainer, getStoreCollection } = require('mylife-tools-server');
const business = require('.');

const logger = createLogger('mylife:gallery:business:document-view');

exports.documentNotify = (session, type, id) => {
  const collection = business.getDocumentStoreCollection(type);
  return notifyView(session, collection.createView(document => document._id === id));
};

exports.documentsNotify = (session, criteria) => {
  const view = new DocumentView();
  view.setCriteria(criteria);
  return notifyView(session, view);
};

class DocumentView extends StoreContainer {
  constructor() {
    super();
    this._createSubscriptions();
    this._filter = () => false; // will be set by _buildFilter
  }

  _createSubscriptions() {
    this.subscriptions = [];
    this.collections = {};

    for(const collection of business.getDocumentStoreCollections()) {
      const subscription = new business.CollectionSubscription(this, collection);
      this.subscriptions.push(subscription);
      this.collections[collection.entity.id] = collection;
    }

    // add subscription on albums to reset filtering on albums
    const albums = getStoreCollection('albums');
    const subscription = new business.CollectionSubscription(this, albums, () => this.refresh());
    this.subscriptions.push(subscription);
  }

  close() {
    for(const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this._reset();
  }

  setCriteria(criteria) {
    this._buildFilter(criteria);
    this.refresh();
  }

  refresh() {
    for(const collection of Object.values(this.collections)) {
      for(const object of collection.list()) {
        this.onCollectionChange(collection, { type: 'update', before: object, after: object });
      }
    }
  }

  onCollectionChange(collection, { before, after, type }) {
    switch(type) {
      case 'create': {
        if(this._filter(after)) {
          this._set(after);
        }
        break;
      }

      case 'update': {
        if(this._filter(after)) {
          this._set(after);
        } else {
          this._delete(before._id);
        }
        break;
      }

      case 'remove': {
        this._delete(before._id);
        break;
      }


      default:
        throw new Error(`Unsupported event type: '${type}'`);
    }
  }

  _buildFilter(criteria) {
    logger.debug(`creating document filter with criteria '${JSON.stringify(criteria)}'`);

    const parts = [];

    createIntervalFilterPart(criteria, parts, 'minDate', 'maxDate', 'date');
    createIntervalFilterPart(criteria, parts, 'minIntegrationDate', 'maxIntegrationDate', 'integrationDate');

    if(criteria.type) {
      const types = new Set(criteria.type);
      parts.push(document => types.has(document._entity));
    }

    if(criteria.albums) {
      const references = new Set();
      for(const albumId of criteria.albums) {
        const album = business.albumGet(albumId);
        for(const albumDocument of album.documents) {
          references.add(`${albumDocument.type}:${albumDocument.id}`);
        }
      }

      parts.push(document => references.has(`${document._entity}:${document._id}`));
    }

    if(criteria.noAlbum) {
      // all documents that are in some album
      const references = new Set();
      for(const album of business.albumList()) {
        for(const albumDocument of album.documents) {
          references.add(`${albumDocument.type}:${albumDocument.id}`);
        }
      }

      parts.push(document => !references.has(`${document._entity}:${document._id}`));
    }

    if(criteria.persons) {
      const personIds = new Set(criteria.persons);
      parts.push(document => hasPerson(document, personIds));
    }

    if(criteria.noPerson) {
      parts.push(hasNoPerson);
    }

    if(criteria.keywords) {
      const criteriaKeywords = criteria.keywords.split(/(\s+)/);
      parts.push(document => hasKeyword(document, criteriaKeywords));
    }

    if(criteria.caption) {
      parts.push(document => document.caption && document.caption.includes(criteria.caption));
    }

    if(criteria.path) {
      parts.push(document => hasPath(document, criteria.path));
    }

    if(criteria.pathDuplicate) {
      parts.push(document => document.paths.length > 1);
    }

    createIntervalFilterPart(criteria, parts, 'minWidth', 'maxWidth', 'width');
    createIntervalFilterPart(criteria, parts, 'minHeight', 'maxHeight', 'height');

    switch(criteria.orientation) {
      case 'landscape':
        parts.push(document => document.width && document.height && document.height < document.width);
        break;

      case 'portrait':
        parts.push(document => document.width && document.height && document.width < document.height);
        break;

    }

    this._filter = document => parts.every(part => part(document));
  }
}

function createIntervalFilterPart(criteria, parts, minName, maxName, propName) {
  // optimize if both min and max are defined
  const min = criteria[minName];
  const max = criteria[maxName];
  if(min && max) {
    parts.push(document => {
      const value = document[propName];
      return value && value >= min && value <= max;
    });
    return;
  }

  if(min) {
    parts.push(document => {
      const value = document[propName];
      return value && value >= min;
    });
    return;
  }

  if(max) {
    parts.push(document => {
      const value = document[propName];
      return value && value <= max;
    });
    return;
  }
}

function hasPerson(document, personIds) {
  switch(document.type) {
    case 'image':
      return document.persons.some(tag => personIds.has(tag.person));

    case 'video':
      return document.persons.some(person => personIds.has(person));
  }

  return false;
}

function hasNoPerson(document) {
  switch(document.type) {
    case 'image':
    case 'video':
      return document.persons.length === 0;
  }

  return true;
}

function hasKeyword(document, criteriaKeywords) {
  for(const documentKeyword of document.keywords) {
    for(const criteriaKeyword of criteriaKeywords) {
      if(documentKeyword.includes(criteriaKeyword)) {
        return true;
      }
    }
  }
  return false;
}

function hasPath(document, criteriaPath) {
  for(const { path } of document.paths) {
    if(path.includes(criteriaPath)) {
      return true;
    }
  }
  return false;
}
