'use strict';

module.exports = [
  { id: 'path', primitive: 'string' },
  {
    id: 'filesystem-item', structure: [
      { id: 'path', name: 'Chemin du fichier', datatype: 'path', constraints: ['not-null'] },
      { id: 'fileUpdateDate', name: 'Date de modification du fichier', datatype: 'datetime', constraints: ['not-null'] },
    ]
  },
  {
    id: 'document-reference', structure: [
      { id: 'type', name: 'Type du document', datatype: 'name', constraints: ['not-null'] },
      { id: 'id', name: 'Identifiant du document', datatype: 'identifier', constraints: ['not-null'] }, // as identifier because it is a polymorph reference
    ]
  },
  {
    id: 'image-tag', structure: [
      { id: 'person', name: 'Personne', datatype: 'person' },
      { id: 'left', name: 'Placement gauche', datatype: 'count' },
      { id: 'top', name: 'Placement haut', datatype: 'count' },
      { id: 'width', name: 'Largeur', datatype: 'count' },
      { id: 'height', name: 'Hauteur', datatype: 'count' },
    ]
  },
  {
    id: 'image-metadata', structure: [
      { id: 'date', name: 'Date de prise', datatype: 'datetime' },
      { id: 'gpsLatitude', name: 'GPS Latitude', datatype: 'real' },
      { id: 'gpsLongitude', name: 'GPS Longitude', datatype: 'real' },
      { id: 'model', name: 'Modèle', datatype: 'name' },
    ]
  },
  {
    id: 'video-metadata', structure: [
      { id: 'date', name: 'Date de prise', datatype: 'datetime' }
    ]
  },
];
