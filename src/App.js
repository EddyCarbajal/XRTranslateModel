const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const multer = require('multer');
const fs = require('fs');
const Parser = require('rss-parser');
const router = express.Router();

// Configure multer for image upload
const upload = multer({ dest: 'uploads/' });


// Load TensorFlow model asynchronously
// let model;
// tf.loadGraphModel('https://xrtranslate-standard-83t.s3.us-east.cloud-object-storage.appdomain.cloud/model.json')
//   .then((loadedModel) => {
//     model = loadedModel;
//     console.log('Model loaded successfully');
//   })
//   .catch((error) => {
//     console.error('Error loading the model', error);
//   });

// Load your TensorFlow model

// var model;
// (async () =>{
//     model = await tf.loadGraphModel('https://xrtranslate-standard-83t.s3.us-east.cloud-object-storage.appdomain.cloud/model.json');
// })();



router.post('/', upload.single('image'), async (req, res) => {
    const model = await tf.loadGraphModel('https://xrtranslate-standard-83t.s3.us-east.cloud-object-storage.appdomain.cloud/model.json');

    if (!req.file) {
        return res.status(400).send('No image uploaded.');
    }

    // Read the image file into a buffer
    const imageBuffer = fs.readFileSync(req.file.path);

    // Decode the image buffer into a tensor
    const img = tf.node.decodeImage(imageBuffer, 3); // 3 for RGB channels
    const resized = tf.image.resizeBilinear(img, [640, 480]);
    const casted = resized.cast('int32');
    const expanded = casted.expandDims(0);
    const obj = await model.executeAsync(expanded);

    // Assuming obj contains the detection results
    const boxes = await obj[1].array();
    const classes = await obj[2].array();
    const scores = await obj[4].array();

    // Clean up tensor objects
    tf.dispose([resized, casted, obj]);

    // Send back the detection results
    res.send(
        (boxes.length > 0 ? boxes[0] : []), 
     
    );

    // Optionally, clean up the uploaded file
    fs.unlinkSync(req.file.path);
});


module.exports = router;

















//     // Handle file upload
//     const handleImageUpload = event => {
//         const { files } = event.target;
//         if (files.length > 0) {
//             const url = URL.createObjectURL(files[0]);
//             imageRef.current.src = url; // Set the image src to display the image
//         }
//     };

//     const detect = async (imageElement) => {
//         if (model && imageElement) {
//             const videoWidth = imageElement.width;
//             const videoHeight = imageElement.height;

//             // Set canvas height and width
//             canvasRef.current.width = videoWidth;
//             canvasRef.current.height = videoHeight;

//             // Make Detections
            // const img = tf.browser.fromPixels(imageElement);
            // const resized = tf.image.resizeBilinear(img, [640, 480]);
            // const casted = resized.cast('int32');
            // const expanded = casted.expandDims(0);
            // const obj = await model.executeAsync(expanded);

//             // Extracting boxes, classes, and scores
//             const boxes = await obj[1].array();
//             const classes = await obj[2].array();
//             const scores = await obj[4].array();
//             console.log("BOXES", boxes[0])
//             console.log("CLASSES", classes[0])
//             console.log("SCORES", scores[0])

//             // Draw mesh
//             const ctx = canvasRef.current.getContext('2d');
//             drawRect(boxes[0], classes[0], scores[0], 0.5, videoWidth, videoHeight, ctx);

//             // Dispose of tensors
//             tf.dispose([img, resized, casted, expanded, ...obj]);
//         }
//     };
    
// router.get('/',async (req,res) => {


//     const imageRef = useRef(null);
//     const canvasRef = useRef(null);
//     const [model, setModel] = useState(null);

//     // Load the TensorFlow model once when the component mounts
//     useEffect(() => {
//         const loadModel = async () => {
//             const loadedModel = await tf.loadGraphModel('https://xrtranslate-standard-83t.s3.us-east.cloud-object-storage.appdomain.cloud/model.json');
//             setModel(loadedModel);
//             console.log('Model loaded.');
//         };
//         loadModel();
//     }, []);


// })


