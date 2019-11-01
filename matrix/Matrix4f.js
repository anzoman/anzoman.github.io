class Matrix4f {

    constructor(x1, y1, z1, h1,
                x2, y2, z2, h2,
                x3, y3, z3, h3,
                x4, y4, z4, h4) {
        if (typeof x1 === 'number' && typeof y1 === 'number' && typeof z1 === 'number' && typeof h1 === 'number' &&
            typeof x2 === 'number' && typeof y2 === 'number' && typeof z2 === 'number' && typeof h2 === 'number' &&
            typeof x3 === 'number' && typeof y3 === 'number' && typeof z3 === 'number' && typeof h3 === 'number' && 
            typeof x4 === 'number' && typeof y4 === 'number' && typeof z4 === 'number' && typeof h4 === 'number') {
            this.x1 = x1, this.x2 = x2, this.x3 = x3, this.x4 = x4;
            this.y1 = y1, this.y2 = y2, this.y3 = y3, this.y4 = y4;
            this.z1 = z1, this.z2 = z2, this.z3 = z3, this.z4 = z4;
            this.h1 = h1, this.h2 = h2, this.h3 = h3, this.h4 = h4;
            this.matrix = [[x1, y1, z1, h1], 
                        [x2, y2, z2, h2], 
                        [x3, y3, z3, h3], 
                        [x4, y4, z4, h4]];
        } else {
            alert("Wrong data type of matrix coordinates.")
        }
    }

    static negate(matrix) {
        return new Matrix4f(- matrix.x1, - matrix.y1, - matrix.z1, - matrix.h1,
                            - matrix.x2, - matrix.y2, - matrix.z2, - matrix.h2,
                            - matrix.x3, - matrix.y3, - matrix.z3, - matrix.h3,
                            - matrix.x4, - matrix.y4, - matrix.z4, - matrix.h4);
    }

    static add(matrix1, matrix2) {
        return new Matrix4f(matrix1.x1 + matrix2.x1, matrix1.y1 + matrix2.y1, matrix1.z1 + matrix2.z1, matrix1.h1 + matrix2.h1,
                            matrix1.x2 + matrix2.x2, matrix1.y2 + matrix2.y2, matrix1.z2 + matrix2.z2, matrix1.h2 + matrix2.h2,
                            matrix1.x3 + matrix2.x3, matrix1.y3 + matrix2.y3, matrix1.z3 + matrix2.z3, matrix1.h3 + matrix2.h3,
                            matrix1.x4 + matrix2.x4, matrix1.y4 + matrix2.y4, matrix1.z4 + matrix2.z4, matrix1.h4 + matrix2.h4);
    }

    static transpose(matrix) {
        return new Matrix4f(matrix.x1, matrix.x2, matrix.x3, matrix.x4,
                            matrix.y1, matrix.y2, matrix.y3, matrix.y4,
                            matrix.z1, matrix.z2, matrix.z3, matrix.z4,
                            matrix.h1, matrix.h2, matrix.h3, matrix.h4);
    }

    static multiplyScalar(scalar, matrix) {
        return new Matrix4f(scalar * matrix.x1, scalar * matrix.y1, scalar * matrix.z1, scalar * matrix.h1,
                            scalar * matrix.x2, scalar * matrix.y2, scalar * matrix.z2, scalar * matrix.h2,
                            scalar * matrix.x3, scalar * matrix.y3, scalar * matrix.z3, scalar * matrix.h3,
                            scalar * matrix.x4, scalar * matrix.y4, scalar * matrix.z4, scalar * matrix.h4);
    }

    static multiply(matrix1, matrix2) {
        return new Matrix4f(matrix1.x1 * matrix2.x1 + matrix1.y1 * matrix2.x2 + matrix1.z1 + matrix2.x3 + matrix1.h1 * matrix2.x4,
                            matrix1.x1 * matrix2.y1 + matrix1.y1 * matrix2.y2 + matrix1.z1 + matrix2.y3 + matrix1.h1 * matrix2.y4,
                            matrix1.x1 * matrix2.z1 + matrix1.y1 * matrix2.z2 + matrix1.z1 + matrix2.z3 + matrix1.h1 * matrix2.z4,
                            matrix1.x1 * matrix2.h1 + matrix1.y1 * matrix2.h2 + matrix1.z1 + matrix2.h3 + matrix1.h1 * matrix2.h4,
                            matrix1.x2 * matrix2.x1 + matrix1.y2 * matrix2.x2 + matrix1.z2 + matrix2.x3 + matrix1.h2 * matrix2.x4,
                            matrix1.x2 * matrix2.y1 + matrix1.y2 * matrix2.y2 + matrix1.z2 + matrix2.y3 + matrix1.h2 * matrix2.y4,
                            matrix1.x2 * matrix2.z1 + matrix1.y2 * matrix2.z2 + matrix1.z2 + matrix2.z3 + matrix1.h2 * matrix2.z4,
                            matrix1.x2 * matrix2.h1 + matrix1.y2 * matrix2.h2 + matrix1.z2 + matrix2.h3 + matrix1.h2 * matrix2.h4,
                            matrix1.x3 * matrix2.x1 + matrix1.y3 * matrix2.x2 + matrix1.z3 + matrix2.x3 + matrix1.h3 * matrix2.x4,
                            matrix1.x3 * matrix2.y1 + matrix1.y3 * matrix2.y2 + matrix1.z3 + matrix2.y3 + matrix1.h3 * matrix2.y4,
                            matrix1.x3 * matrix2.z1 + matrix1.y3 * matrix2.z2 + matrix1.z3 + matrix2.z3 + matrix1.h3 * matrix2.z4,
                            matrix1.x3 * matrix2.h1 + matrix1.y3 * matrix2.h2 + matrix1.z3 + matrix2.h3 + matrix1.h3 * matrix2.h4,
                            matrix1.x4 * matrix2.x1 + matrix1.y4 * matrix2.x2 + matrix1.z4 + matrix2.x3 + matrix1.h4 * matrix2.x4,
                            matrix1.x4 * matrix2.y1 + matrix1.y4 * matrix2.y2 + matrix1.z4 + matrix2.y3 + matrix1.h4 * matrix2.y4,
                            matrix1.x4 * matrix2.z1 + matrix1.y4 * matrix2.z2 + matrix1.z4 + matrix2.z3 + matrix1.h4 * matrix2.z4,
                            matrix1.x4 * matrix2.h1 + matrix1.y4 * matrix2.h2 + matrix1.z4 + matrix2.h3 + matrix1.h4 * matrix2.h4)
    }
}