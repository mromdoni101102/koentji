    import { getImageUrl } from '../../utils/utils.js';

    function MyProfile({ name, imageId, profession, awards, discoveries }) {
    return (
        <section className="profile">
        <h2>{name}</h2>
        <img
            className="avatar"
            src={getImageUrl(imageId)}
            alt={name}
            width={70}
            height={70}
        />
        <ul>
            <li>
            <b>Profesi: </b>
            {profession}
            </li>
            <li>
            <b>Penghargaan: {awards.length} </b>
            ({awards.join(', ')})
            </li>
            <li>
            <b>Telah Menemukan: </b>
            {discoveries}
            </li>
        </ul>
        </section>
    );
    }

    export default function MyGallery() {
    return (
        <div>
        <h1>Notable Scientists</h1>
        <MyProfile
            name="Maria Skłodowska-Curie"
            imageId="szV5sdG"
            profession="Fisikawan dan kimiawan"
            awards={['Penghargaan Nobel Fisika', 'Penghargaan Nobel Kimia', 'Medali Davy', 'Medali Matteucci']}
            discoveries="polonium (unsur kimia)"
        />
        <MyProfile
            name="Katsuko Saruhashi"
            imageId="YfeOqp2"
            profession="Ahli Geokimia"
            awards={['Penghargaan Miyake Geokimia', 'Penghargaan Tanaka']}
            discoveries="sebuah metode untuk mengukur karbon dioksida pada air laut"
        />
        </div>
    );
    }
