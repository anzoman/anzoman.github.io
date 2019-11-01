class Vector4f {

    constructor(x, y, z) {
        if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
            this.x = x;
            this.y = y;
            this.z = z;
            this.h = 1;
        } else {
            alert("Wrong data type of vector coordinates.")
        }
    }

    static negate(vector) {
        return new Vector4f(-vector.x, -vector.y, - vector.z, vector.h);
    }

    static add(vector1, vector2) {
        return new Vector4f(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z, vector.h);
    }

    static scalarProduct(scalar, vector) {
        return new Vector4f(vector.x * scalar, vector.y * scalar, vector.z * scalar, vector.h);
    }

    static dotProduct(vector1, vector2) {
        return vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z;
    }

    static crossProduct(vector1, vector2) {
        return new Vector4f(vector1.y * vector2.z - vector1.z * vector2.y, 
                            vector1.z * vector2.x - vector1.x * vector2.z, 
                            vector1.x * vector2.y - vector1.y * vector2.x, 
                            vector.h);
    }

    static length(vector) {
        return Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2);
    }

    static normalize(vector) {
        let vectorLength = length(vector);
        if (vector.length !== 0) {
            return new Vector4f(vector.x / vectorLength, vector.y / vectorLength, vector.z / vectorLength, vector.h);
        } else {
            alert("Zero vector cannot be normalized.");
        }
    }

    static project(vector1, vector2) {
        let product = dotProduct(vector1, vector2);
        let vectorLength = length(vector1);
        return new Vector4f((vector1.x * product) / (vectorLength ** 2), 
                            (vector1.y * product) / (vectorLength ** 2), 
                            (vector1.z * product) / (vectorLength ** 2),
                            vector.h);
    }

    static cosPhi(vector1, vector2) {
        if (length(vector1) === 0 || length(vector2) === 0) {
            return 0;
        } else {
            return dotProduct(vector1, vector2) / (length(vector1) * length(vector2));
        }
    }
}