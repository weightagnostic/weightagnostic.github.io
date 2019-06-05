// WANN implementation of cartpole controller

function applyActSimple(actId, x) {
	/* Assume x is a float (not vector)
		case 1  -- Linear
		case 2  -- Unsigned Step Function
		case 3  -- Sin
		case 4  -- Gausian with mean 0 and sigma 1
		case 5  -- Hyperbolic Tangent (signed)
		case 6  -- Sigmoid unsigned [1 / (1 + exp(-x))]
		case 7  -- Inverse
		case 8  -- Absolute Value
		case 9  -- Relu
		case 10 -- Cosine

		x is a numjs NDArrayß
	*/
	var result;
	switch (actId) {
	  case 1: // Linear
	  	result = x;
	    break;
	  case 2: // Unsigned Step Function
	  	result = 0.0;
	  	if (x > 0.0) {
	  		result = 1.0;
	  	}
	    break;
	  case 3: // Sine
	  	result = Math.sin(Math.PI*x);
	    break;
	  case 4: // Gaussian with mean zero and unit variance
	  	// value = np.exp(-np.multiply(x, x) / 2.0)
	  	result = Math.exp(-(x*x)/2.0);
	    break;
	  case 5: // Hyperbolic Tangent
	  	result = Math.tanh(x);
	    break;
	  case 6: // Sigmoid
	  	result = (Math.tanh(x/2.0) + 1.0)/2.0;
	    break;
	  case 7: // Inverse
	  	result = -x;
	    break;
	  case 8: // Absolute Value
	  	result = Math.abs(x);
	    break;
	  case 9: // ReLU
	  	result = Math.max(x, 0);
	    break;
	  case 10: // Cosine
	  	result = Math.cos(Math.PI*x);
	    break;
	  default: 
	  	console.log("unidentified value "+actId+" passed as actId into applyActSimple.");
	}
	return result;
}

function getAction(weights, aVec, nInput, nOutput, obs) {
	/*
	activate feed forward network once:
	weights: 1D JS list of weights that must be of length N*N
	aVec: 1D JS list of activation (ints) that must be of length N
	nInput: integer, size of input
	nOutput: integer, size of output
	obs: JS list of length nInput
	*/

	var nNodes = aVec.length;
	var wMat = nj.array(weights).reshape(nNodes, nNodes);
	var i;
	var rawAct;

	var nodeAct = nj.zeros(nNodes);
	nodeAct.set(0, 1);
	for (i=0;i<obs.length;i++) {
		nodeAct.set(i+1, obs[i]);
	}

	for (var iNode=nInput+1;iNode<nNodes;iNode++) {
		rawAct = nj.dot(nodeAct, wMat.slice(0, [iNode, iNode+1]));
		rawAct = applyActSimple(aVec[iNode], rawAct.tolist()[0]);
		nodeAct.set(iNode, rawAct);
	}

	return nodeAct.slice(-nOutput).tolist();
}

/**
 * swingup cartpole environment, wann agent
 * @class
 * @constructor
 */
function WANNAgent( p, init_shared_weight ) {
  this.num_hidden = 10;
  this.input_size = 5;
  this.output_size = 1;
  this.shape_in = [this.input_size, this.num_hidden];
  this.shape_out = [this.num_hidden, this.output_size];
  this.aVec = [1,1,1,1,1,1,7,7,5,1,5,5,4,1,7,3,9,1,3,7,9,5,4,3,9,7,1,7,1];
  this.wKey = [10,35,36,41,64,69,95,97,108,125,128,142,157,202,231,257,289,302,331,361,362,363,364,367,368,373,374,376,394,395,398,401,403,425,461,484,517,543,574,576,602,603,604,606,633,662,692,722,723,753,782,811];
  this.weights = [-0.1783,-0.0303,1.5435,1.8088,-0.857,1.024,-0.3872,0.2639,-1.138,-0.2857,0.3797,-0.199,1.3008,-1.4126,-1.3841,7.1232,-1.5903,-0.6301,0.8013,-1.1348,-0.7306,0.006,1.4754,1.1144,-1.5251,-1.277,1.0933,0.1666,-0.5483,2.6779,-1.2728,0.4593,-0.2608,0.1183,-2.1036,-0.3119,-1.0469,0.2662,0.7156,0.0328,0.3441,-0.1147,-0.0553,-0.4123,-3.2276,2.5201,1.7362,-2.9654,0.9641,-1.7355,-0.1573,2.9135];
  this.weight_bias = -1.5;

  var nNodes = this.aVec.length;
  this.wVec = new Array(nNodes*nNodes);
  var i;
  for (i=0;i<nNodes*nNodes;i++) {
  	this.wVec[i] = 0;
  }
  //this.set_weight(this.weights, this.weight_bias);
  this.set_weight(init_shared_weight);
}
WANNAgent.prototype.tune_weights = function() {
  this.set_weight(this.weights, this.weight_bias);
}
WANNAgent.prototype.set_weight = function(w, wb) {
  var weights;
  var i, k;
  var nValues = this.wKey.length;
  var weight_bias = 0;
  if (typeof wb == 'number') {
  	weight_bias = wb;
  }
  if (Array.isArray(w)) {
  	weights = w;
  } else {
  	weights = Array.apply(null, Array(nValues)).map(Number.prototype.valueOf,w);
  }
  for (i=0;i<nValues;i++) {
  	k = this.wKey[i];
  	this.wVec[k] = weights[i] + weight_bias;
  }
}
WANNAgent.prototype.get_action = function(obs) {
  return getAction(this.wVec, this.aVec, this.input_size, this.output_size, obs)[0];
}
