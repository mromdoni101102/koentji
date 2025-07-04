export function getImageUrl(imageId, size = 's') {
    return 'https://i.imgur.com/' + imageId + size + '.jpg';
  }
  
  export function getImageUrlV2(person, size) {
    return 'https://i.imgur.com/' + person.imageId + size + '.jpg';
  }