import { getImageUrlV2 } from '../../utils/utils.js';

function MyAvatar({ person, size }) {
  const imageSizeCode = size < 90 ? 's' : 'b';

  return (
    <img
      className="avatar"
      src={getImageUrlV2(person, imageSizeCode)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function MyProfile() {
  return (
    <div>
      <MyAvatar
        size={40}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
      <MyAvatar
        size={100}
        person={{
          name: 'Ada Lovelace',
          imageId: 'rDE2SL3L' // contoh imageId lain
        }}
      />
    </div>
  );
}
