class Transformation {
    
    constructor() {
        var matrix = new Matrix4f(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        this.setMatrix = function(privateMatrix) { matrix = privateMatrix; }
        this.getMatrix = function() { return matrix; }
    }

    translate(vector) {
        this.getMatrix().matrix[0] = [1, 0, 0, vector.x];
        this.getMatrix().matrix[1] = [0, 1, 0, vector.y];
        this.getMatrix().matrix[2] = [0, 0, 1, vector.z];
        this.getMatrix().matrix[3] = [0, 0, 0, 1];
    }

    scale(vector) {
        this.getMatrix().matrix[0] = [vector.x, 0, 0, 0];
        this.getMatrix().matrix[1] = [0, vector.y, 0, 0];
        this.getMatrix().matrix[2] = [0, 0, vector.z, 0];
        this.getMatrix().matrix[3] = [0, 0, 0, 1];
    }

    rotateX(angle) {
        this.getMatrix().matrix[0] = [1, 0, 0, 0];
        this.getMatrix().matrix[1] = [0, Math.cos(angle), - Math.sin(angle), 0];
        this.getMatrix().matrix[2] = [0, Math.sin(angle), Math.cos(angle), 0];
        this.getMatrix().matrix[3] = [0, 0, 0, 1];
    }

    rotateY(angle) {
        this.getMatrix().matrix[0] = [Math.cos(angle), 0, Math.sin(angle), 0];
        this.getMatrix().matrix[1] = [0, 1, 0, 0];
        this.getMatrix().matrix[2] = [- Math.sin(angle), 0, Math.cos(angle), 0];
        this.getMatrix().matrix[3] = [0, 0, 0, 1];
    }

    rotateZ(angle) {
        this.getMatrix().matrix[0] = [Math.cos(angle), - Math.sin(angle), 0, 0];
        this.getMatrix().matrix[1] = [Math.sin(angle), Math.cos(angle), 0, 0];
        this.getMatrix().matrix[2] = [0, 0, 1, 0];
        this.getMatrix().matrix[3] = [0, 0, 0, 1];
    }

    transformPoint(vector) {
        return new Vector4f(this.getMatrix().matrix[0][0] * vector.x + this.getMatrix().matrix[0][1] * vector.y + this.getMatrix().matrix[0][2] * vector.z + this.getMatrix().matrix[0][3] * vector.h,
                            this.getMatrix().matrix[1][0] * vector.x + this.getMatrix().matrix[1][1] * vector.y + this.getMatrix().matrix[1][2] * vector.z + this.getMatrix().matrix[1][3] * vector.h, 
                            this.getMatrix().matrix[2][0] * vector.x + this.getMatrix().matrix[2][1] * vector.y + this.getMatrix().matrix[2][2] * vector.z + this.getMatrix().matrix[2][3] * vector.h)
    }
}