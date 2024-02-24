import { sum } from "@tensorflow/tfjs";

// Define our labelmap
const labelMap = {
    1: { name: 'word', color: 'red' },
    2: { name: 'phrase', color: 'yellow' },
    3: { name: 'pararaphs', color: 'lime' },
}





// Define a drawing function
export const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx) => {
    for (let i = 0; i < boxes.length; i++) {
        // console.log(`Box ${i}:`, boxes[i], `Score:`, scores[i], `Class:`, classes[i]);
        if (scores[i] > threshold) {
            // Assuming the box format is [y, x, height, width]
            // Assuming boxes are [ymin, xmin, ymax, xmax]
            const [ymin, xmin, ymax, xmax] = boxes[i];
            const y = ymin * imgHeight;
            const x = xmin * imgWidth;
            const height = (ymax - ymin) * imgHeight;
            const width = (xmax - xmin) * imgWidth;

            const label = labelMap[classes[i]] ? labelMap[classes[i]].name : 'unknown';
            const color = labelMap[classes[i]] ? labelMap[classes[i]].color : 'white';

            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.fillStyle = color;
            ctx.font = '18px Arial';

            ctx.beginPath();
            ctx.fillText(`${label} - ${Math.round(scores[i] * 100) / 100}`, x, y - 10);
            ctx.rect(x, y, width, height);
            ctx.stroke();
        }
    }
};

// Define a drawing function
export const old = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx) => {
    for (let i = 0; i < boxes.length; i++) {
        // console.log(
        //     "Box: " + boxes[i],
        //     "Class: " + classes[i],
        //     "Score: " + scores[i]
        // )
        // Assuming boxes[i], classes[i], and scores[i] are numbers or can be converted to numbers
        const boxValue = Number(boxes[i]);
        const classValue = Number(classes[i]);
        const scoreValue = Number(scores[i]);

        const summation = boxValue + classValue + scoreValue;
        if (summation != NaN) {
            console.log("Summation: " + summation);
        }

        if (boxes[i] && classes[i] && scores[i] > threshold) {
            // Extract variables
            const [y, x, height, width] = boxes[i]
            // console.log("coordinates" + x, "," + y, " and threshold: " + threshold)
            const text = classes[i]

            // Set styling
            ctx.strokeStyle = labelMap[text]['color']
            ctx.lineWidth = 10
            ctx.fillStyle = 'white'
            ctx.font = '30px Arial'

            // DRAW!!
            ctx.beginPath()
            ctx.fillText(labelMap[text]['name'] + ' - ' + Math.round(scores[i] * 100) / 100, x * imgWidth, y * imgHeight - 10)
            ctx.rect(x * imgWidth, y * imgHeight, width * imgWidth / 2, height * imgHeight / 2);
            ctx.stroke()
        }
    }
}