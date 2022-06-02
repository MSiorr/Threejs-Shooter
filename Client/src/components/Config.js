import playerImg from '../models/Knight/knight.png';
import playerModel from '../models/Knight/tris.md2';

import enemyImg from '../models/Qmech/qmech.png';
import enemyModel from '../models/Qmech/tris.md2';

export default {
    rotateLeft: false,
    rotateRight: false,
    moveForward: false,
    moveBackward: false,
    spaceAttack: false,

    playerSource: {
        img: playerImg,
        model: playerModel
    },
    
    enemySource: {
        img: enemyImg,
        model: enemyModel
    }
}