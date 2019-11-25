'use strict';

module.exports = {
  id: 'video',
  parent: 'document',
  name: 'Video',
  fields: [
    { id: 'thumbnails', name: 'Miniatures', datatype: 'list:identifier', constraints: ['not-null'], initial: [] },
    { id: 'metadata', name: 'Métadonnées', datatype: 'video-metadata' },
    { id: 'width', name: 'Largeur', datatype: 'count' },
    { id: 'height', name: 'Hauteur', datatype: 'count' },
    { id: 'duration', name: 'Durée', datatype: 'real' },
    { id: 'persons', name: 'Personnes', datatype: 'list:person', constraints: ['not-null'], initial: [] }, // we do not directly reference thumbnail because it is not loaded as store collection
  ]
};
