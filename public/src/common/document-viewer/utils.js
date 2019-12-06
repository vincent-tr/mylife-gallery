'use strict';

export function getInfo(document) {
  return {
    thumbnailUrl: getThumbnailUrl(document),
    title: getTitle(document),
    subtitle: getSubtitle(document)
  };
}

function getThumbnailUrl(document) {
  switch(document._entity) {
    case 'image':
      return `/content/thumbnail/${document.thumbnail}`;
    case 'video':
      return `/content/thumbnail/${document.thumbnails[0]}`;
    default:
      return null;
  }
}

function getTitle(document) {
  if(document.caption) {
    return document.caption;
  }
  const path = document.paths[0].path;
  const fileName = path.replace(/^.*[\\/]/, '');
  return fileName;
}

function getSubtitle(document) {
  if(document.keywords.length) {
    return document.keywords.join(' ');
  }

  return document.paths[0].path;
}
