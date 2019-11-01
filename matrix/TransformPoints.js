class TransformPoints {
    
    transform() {
        let pm = new PointManager();
        let vectorList = pm.readVectors();
        let transformation = new Transformation();
        let newVectorList = [];

        if (vectorList.length > 0) {
            vectorList.forEach(vector => {
                transformation.translate(new Vector4f(1.25, 0, 0));
                vector = transformation.transformPoint(vector);
                transformation.rotateZ(Math.PI / 3);
                vector = transformation.transformPoint(vector);
                transformation.translate(new Vector4f(0, 0, 4.15));
                vector = transformation.transformPoint(vector);
                transformation.translate(new Vector4f(0, 3.14, 0));
                vector = transformation.transformPoint(vector);
                transformation.scale(new Vector4f(1.12, 1.12, 0));
                vector = transformation.transformPoint(vector);
                transformation.rotateY(5 * Math.PI / 8);
                vector = transformation.transformPoint(vector);
                newVectorList.push(vector);
            });
        } else {
            alert("No vectors were retrieved.")
            return;
        }
        pm.writeVectors(newVectorList);
    }
}