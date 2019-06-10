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
function WANNAgent(p, wBias, aVec, wKey, weights) {
  this.num_hidden = 10;
  this.input_size = 5;
  this.output_size = 1;
  this.shape_in = [this.input_size, this.num_hidden];
  this.shape_out = [this.num_hidden, this.output_size];
  this.aVec = aVec;
  this.wKey = wKey;
  this.weights = weights;
  this.weight_bias = wBias;

  var nNodes = this.aVec.length;
  this.wVec = new Array(nNodes*nNodes);
  var i;
  for (i=0;i<nNodes*nNodes;i++) {
  	this.wVec[i] = 0;
  }
  //this.set_weight(this.weights, this.weight_bias);
  this.set_weight(this.weight_bias);
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
