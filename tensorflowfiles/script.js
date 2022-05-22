// Grab a reference to our status text element on the web page.
// Initially we print out the loaded version of TFJS.
const status = document.getElementById('status');
status.innerText = 'Loaded TensorFlow.js - version: ' + tf.version.tfjs;

const MODEL_URL_1 = "modelEncrypter.json";
const MODEL_URL_2 = "modelDecrypter.json";
// Specify a test value we wish to use in our prediction.
// Here we use 950, so we expect the result to be close to 950,000.
const TEST_VALUE = 950.0

// Create an asynchronous function.
async function run() {
    // Load the model from the CDN.
    const gantImage1 = document.getElementById('gant1');
    const gantImage2= document.getElementById('gant2');
    let gantTensor1 = tf.image.resizeBilinear(tf.browser.fromPixels(gantImage1).div(255.0), [64,64]);
    let gantTensor2 = tf.image.resizeBilinear(tf.browser.fromPixels(gantImage2).div(255.0), [64,64]);
    
    console.log(
      `Successful conversion from DOM to a ${gantTensor1.shape} tensor`
    )
    console.log(
        `Successful conversion from DOM to a ${gantTensor2.shape} tensor`
      )
    const model = await tf.loadLayersModel(MODEL_URL_1);
    const decrypter = await tf.loadLayersModel(MODEL_URL_2);


    const secret = document.getElementById("secret");
    const cover = document.getElementById("cover");
    const stego = document.getElementById("stego");
    const dec = document.getElementById("dec");

    tf.browser.toPixels(tf.image.resizeBilinear(gantTensor1,[200,200]), secret).then(() => { 
      // It's not bad practice to clean up and make sure we got everything
      console.log("Make sure we cleaned up", tf.memory().numTensors);
    });

    tf.browser.toPixels(tf.image.resizeBilinear(gantTensor2,[200,200]), cover).then(() => { 
      // It's not bad practice to clean up and make sure we got everything
      console.log("Make sure we cleaned up", tf.memory().numTensors);
    });
    
    // Create a 1 dimensional tensor with our test value.
    let val = model.predict([gantTensor1.reshape([1,64,64,3]),gantTensor2.reshape([1,64,64,3])]);
    tf.browser.toPixels(tf.image.resizeBilinear(val.reshape([64,64,3]),[200,200]), stego).then(() => { 
        // It's not bad practice to clean up and make sure we got everything
        console.log("Make sure we cleaned up", tf.memory().numTensors);
      });




          // Create a 1 dimensional tensor with our test value.
    let y = decrypter.predict([val])
    tf.browser.toPixels(tf.image.resizeBilinear(y.reshape([64,64,3]),[200,200]), dec).then(() => { 
        // It's not bad practice to clean up and make sure we got everything
        console.log("Make sure we cleaned up", tf.memory().numTensors);
      });




    const canvas = document.createElement('canvas');
    val = tf.image.resizeBilinear(val.reshape([64,64,3]),[200,200]);
    canvas.width = val.shape.width
    canvas.height = val.shape.height
    await tf.browser.toPixels(val, canvas);
    
    let b64 = canvas.toDataURL().split(';base64,')[1];
    console.log(b64);

    // let b64 = stego.toDataURL().split(';base64,')[1];;
    // console.log(b64);
    // Actually make the prediction.
   // const result = model.predict(input);

    // Grab the result of prediction using dataSync method
    // which ensures we do this synchronously.
    // status.innerText = 'Input of ' + TEST_VALUE + 
    //     'sqft predicted as $' + result.dataSync()[0];
}

// Call our function to start the prediction!
run();

/*
  async function encode(){
    const MODEL_URL_1 = "tensorflowfiles/modelEncrypter.json";
    const gantImage1 = document.getElementById('gant1');
    const gantImage2= document.getElementById('gant2');
    let gantTensor1 = tf.image.resizeBilinear(tf.browser.fromPixels(gantImage1).div(255.0), [64,64]);
    let gantTensor2 = tf.image.resizeBilinear(tf.browser.fromPixels(gantImage2).div(255.0), [64,64]);
    const model = await tf.loadLayersModel(MODEL_URL_1);
    let val = model.predict([gantTensor1.reshape([1,64,64,3]),gantTensor2.reshape([1,64,64,3])]);
    const canvas = document.createElement('canvas');
    val = tf.image.resizeBilinear(val.reshape([64,64,3]),[200,200]);
    canvas.width = val.shape.width
    canvas.height = val.shape.height
    await tf.browser.toPixels(val, canvas);
    let b64 = canvas.toDataURL().split(';base64,')[1];
    console.log(b64);

    //send b64 to server


  } */
