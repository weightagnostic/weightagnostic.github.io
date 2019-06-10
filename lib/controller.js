// controls the flow of the page

var scroll_top = 0;
var scroll_bottom = 1;
$(document).scroll(function(){
  scroll_top = $(document).scrollTop();
  scroll_bottom = scroll_top + $(document).height();
});

// blazy code
var bLazy = new Blazy({
  success: function(){
    updateCounter();
  }
});

// not needed, only here to illustrate amount of loaded images
var imageLoaded = 0;

function updateCounter() {
  imageLoaded++;
  console.log("blazy image loaded: "+imageLoaded);
}

var full_demo_settings = {
  divName: 'intro_demo',
  smallMode: false,
  timeLimit: 3000,
  initState: [0.601049815029565, 0.24219583981105042, 3.0275375362833477, 0.06461472207991191],
  useFineTune: false,
  drawBar: true,
  showInstructions: true,
  hardMode: false,
  aVec: [1,1,1,1,1,1,7,7,5,1,5,5,4,1,7,3,9,1,3,7,9,5,4,3,9,7,1,7,1],
  wKey: [10,35,36,41,64,69,95,97,108,125,128,142,157,202,231,257,289,302,331,361,362,363,364,367,368,373,374,376,394,395,398,401,403,425,461,484,517,543,574,576,602,603,604,606,633,662,692,722,723,753,782,811],
  weights: [-0.1783,-0.0303,1.5435,1.8088,-0.857,1.024,-0.3872,0.2639,-1.138,-0.2857,0.3797,-0.199,1.3008,-1.4126,-1.3841,7.1232,-1.5903,-0.6301,0.8013,-1.1348,-0.7306,0.006,1.4754,1.1144,-1.5251,-1.277,1.0933,0.1666,-0.5483,2.6779,-1.2728,0.4593,-0.2608,0.1183,-2.1036,-0.3119,-1.0469,0.2662,0.7156,0.0328,0.3441,-0.1147,-0.0553,-0.4123,-3.2276,2.5201,1.7362,-2.9654,0.9641,-1.7355,-0.1573,2.9135],
  wBias: -1.5,
  displayTitle: true,
};
var demo_intro = new p5(cartpole_demo(full_demo_settings), 'intro_demo');

var demo_0008_settings = {
  divName: 'demo_0008',
  smallMode: true,
  timeLimit: 1000,
  useFineTune: false,
  drawBar: true,
  showInstructions: false,
  hardMode: false,
  aVec: [1, 1, 1, 1, 1, 1, 6, 7, 7, 1],
  wKey: [ 9, 18, 19, 27, 36, 46, 49, 58, 69, 79, 89],
  weights: null,
  wBias: -0.25,
  displayTitle: true,
};
var demo_0008 = new p5(cartpole_demo(demo_0008_settings), 'demo_0008');

var demo_0032_settings = {
  divName: 'demo_0032',
  smallMode: true,
  timeLimit: 1000,
  useFineTune: false,
  drawBar: true,
  showInstructions: false,
  hardMode: false,
  aVec: [1, 1, 1, 1, 1, 1, 6, 7, 7, 4, 2, 7, 1],
  wKey: [ 12 , 20 , 21 , 24  ,33 , 45 , 58 , 62 , 74 , 90, 103 ,116, 128, 142, 155],
  weights: null,
  wBias: 1.5,
  displayTitle: true,
};
var demo_0032 = new p5(cartpole_demo(demo_0032_settings), 'demo_0032');

var demo_0128_settings = {
  divName: 'demo_0128',
  smallMode: true,
  timeLimit: 1000,
  useFineTune: false,
  drawBar: true,
  showInstructions: false,
  hardMode: false,
  aVec: [ 1 , 1 , 1 ,1 , 1 , 1 , 7,  7 , 4, 2 , 2 , 8 , 7 ,10 , 1 , 3,  7 , 1],
  wKey: [ 10 , 24 , 25,  34 , 42,  65 , 81 , 86,  98, 125, 143, 156, 160 ,161, 179 ,197, 211 ,232 ,248 ,249 ,250 ,269, 286, 305],
  weights: null,
  wBias: -0.5,
  displayTitle: true,
};
var demo_0128 = new p5(cartpole_demo(demo_0128_settings), 'demo_0128');

var demo_1024_settings = {
  divName: 'demo_1024',
  smallMode: true,
  timeLimit: 1000,
  initState: [0.601049815029565, 0.24219583981105042, 3.0275375362833477, 0.06461472207991191],
  useFineTune: false,
  drawBar: true,
  showInstructions: false,
  hardMode: false,
  aVec: [1,1,1,1,1,1,7,7,5,1,5,5,4,1,7,3,9,1,3,7,9,5,4,3,9,7,1,7,1],
  wKey: [10,35,36,41,64,69,95,97,108,125,128,142,157,202,231,257,289,302,331,361,362,363,364,367,368,373,374,376,394,395,398,401,403,425,461,484,517,543,574,576,602,603,604,606,633,662,692,722,723,753,782,811],
  weights: null,
  wBias: -1.5,
  displayTitle: true,
};
var demo_1024 = new p5(cartpole_demo(demo_1024_settings), 'demo_1024');


var final_demo_settings = {
  divName: 'final_demo',
  smallMode: false,
  timeLimit: 1000,
  useFineTune: true,
  drawBar: false,
  showInstructions: false,
  hardMode: true,
  aVec: [1,1,1,1,1,1,7,7,5,1,5,5,4,1,7,3,9,1,3,7,9,5,4,3,9,7,1,7,1],
  wKey: [10,35,36,41,64,69,95,97,108,125,128,142,157,202,231,257,289,302,331,361,362,363,364,367,368,373,374,376,394,395,398,401,403,425,461,484,517,543,574,576,602,603,604,606,633,662,692,722,723,753,782,811],
  weights: [-0.1783,-0.0303,1.5435,1.8088,-0.857,1.024,-0.3872,0.2639,-1.138,-0.2857,0.3797,-0.199,1.3008,-1.4126,-1.3841,7.1232,-1.5903,-0.6301,0.8013,-1.1348,-0.7306,0.006,1.4754,1.1144,-1.5251,-1.277,1.0933,0.1666,-0.5483,2.6779,-1.2728,0.4593,-0.2608,0.1183,-2.1036,-0.3119,-1.0469,0.2662,0.7156,0.0328,0.3441,-0.1147,-0.0553,-0.4123,-3.2276,2.5201,1.7362,-2.9654,0.9641,-1.7355,-0.1573,2.9135],
  wBias: -1.5,
  displayTitle: false,
};
var demo_final = new p5(cartpole_demo(final_demo_settings), 'final_demo');

$("#mnist_all").click(function(){
  console.log("all");
  $('#mnist_figure').attr('src', 'assets/png/mnist_all.png');
});
var mnist_idx = 0;

$("#mnist_0").click(function(){
  console.log("0");
  $('#mnist_figure').attr('src', 'assets/png/mnist_0.png');
});

$("#mnist_1").click(function(){
  console.log("1");
  $('#mnist_figure').attr('src', 'assets/png/mnist_1.png');
});

$("#mnist_2").click(function(){
  console.log("2");
  $('#mnist_figure').attr('src', 'assets/png/mnist_2.png');
});

$("#mnist_3").click(function(){
  console.log("3");
  $('#mnist_figure').attr('src', 'assets/png/mnist_3.png');
});

$("#mnist_4").click(function(){
  console.log("4");
  $('#mnist_figure').attr('src', 'assets/png/mnist_4.png');
});

$("#mnist_5").click(function(){
  console.log("5");
  $('#mnist_figure').attr('src', 'assets/png/mnist_5.png');
});

$("#mnist_6").click(function(){
  console.log("6");
  $('#mnist_figure').attr('src', 'assets/png/mnist_6.png');
});

$("#mnist_7").click(function(){
  console.log("7");
  $('#mnist_figure').attr('src', 'assets/png/mnist_7.png');
});

$("#mnist_8").click(function(){
  console.log("8");
  $('#mnist_figure').attr('src', 'assets/png/mnist_8.png');
});

$("#mnist_9").click(function(){
  console.log("9");
  $('#mnist_figure').attr('src', 'assets/png/mnist_9.png');
});