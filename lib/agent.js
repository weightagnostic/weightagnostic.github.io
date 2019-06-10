/**
 * swingup cartpole environment
 * @class
 * @constructor
 */
function BaselineAgent( p ) {
  this.num_hidden = 10;
  this.input_size = 5;
  this.output_size = 1;
  this.shape_in = [this.input_size, this.num_hidden];
  this.shape_out = [this.num_hidden, this.output_size];
  this.w_in = nj.array([[-8.9295, -5.603, -14.3345, 8.329, 17.781, 1.3176, 4.965, -1.0546, 1.5653, 8.1426], [3.0292, -9.128, 2.2154, -0.8566, 8.4249, 3.2898, -0.4963, 2.3303, -0.3388, 7.1902], [0.7965, 1.6939, 1.0807, -5.2016, 10.1711, 2.5834, 6.1202, -5.4777, -0.6702, -12.5217], [-0.0486, -3.2057, 4.1934, -2.7201, -21.3973, -12.506, -0.172, 2.8808, -10.0306, -8.8568], [-2.5144, -5.9105, 1.6907, 2.5247, -1.683, -2.4005, -13.4399, -1.8358, 6.7264, -0.0158]]);
  this.b_in = nj.array([4.2084, -0.3838, -11.9949, 5.1368, 3.3055, -2.4984, -10.6295, 2.249, -0.7245, 2.33]);
  this.w_out = nj.array([[4.4807], [-0.2342], [6.7905], [6.4676], [-10.2785], [12.7565], [4.3914], [-4.5724], [0.5489], [-4.8281]]);
  this.b_out = nj.array([6.298]);
}
BaselineAgent.prototype.get_action = function(obs) {
  obs = nj.array(obs);
  var h=nj.tanh(nj.add(nj.dot(obs, this.w_in), this.b_in));
  var out=nj.tanh(nj.add(nj.dot(h, this.w_out), this.b_out));
  return out.tolist()[0];
}
