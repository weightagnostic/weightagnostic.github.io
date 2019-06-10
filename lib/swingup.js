/**
 * swingup cartpole environment
 * @class
 * @constructor
 */
function CartPoleSwingUpEnv(p, time_limit, specified_init_state, hard_mode) {
  this.p = p; // the p5.js environment
  this.g = 9.82;  // gravity;
  this.m_c = 0.5; // cart mass
  this.m_p = 0.5;  // pendulum mass
  this.total_m = (this.m_p + this.m_c);
  this.l = 0.6; // pole's length
  this.m_p_l = (this.m_p*this.l);
  this.force_mag = 10.0;
  this.dt = 0.01;  // seconds between state updates
  this.b = 0.1;  // friction coefficient

  this.t = 0; // timestep
  this.t_limit = time_limit;

  this.hard_mode = hard_mode;

  // Angle at which to fail the episode
  this.theta_threshold_radians = 12 * 2 * Math.PI / 360;
  this.x_threshold = 2.4;

  this.action_space = 1;
  this.observation_space = 5;

  this.specified_init_state = specified_init_state;
  this.state = null;
}
CartPoleSwingUpEnv.prototype.step = function(action) {
  // Valid action
  if (action < -1.0) action = -1.0;
  if (action > 1.0) action = 1.0;
  action *= this.force_mag;

  var state = this.state;
  var x = state[0];
  var x_dot = state[1];
  var theta = state[2];
  var theta_dot = state[3];

  var s = Math.sin(theta);
  var c = Math.cos(theta);

  var xdot_update = (-2*this.m_p_l*(theta_dot*theta_dot)*s + 3*this.m_p*this.g*s*c + 4*action - 4*this.b*x_dot)/(4*this.total_m - 3*this.m_p*c*c);
  var thetadot_update = (-3*this.m_p_l*(theta_dot*theta_dot)*s*c + 6*this.total_m*this.g*s + 6*(action - this.b*x_dot)*c)/(4*this.l*this.total_m - 3*this.m_p_l*c*c);

  x = x + x_dot*this.dt;
  theta = theta + theta_dot*this.dt;
  x_dot = x_dot + xdot_update*this.dt;
  theta_dot = theta_dot + thetadot_update*this.dt;

  this.state = [x,x_dot,theta,theta_dot];

  var done = false;
  if ((x < -this.x_threshold) || (x > this.x_threshold)) done = true;

  this.t += 1;

  if (this.t >= this.t_limit) done = true;

  var reward_theta = (Math.cos(theta)+1.0)/2.0;
  var reward_x = Math.cos((x/this.x_threshold)*(Math.PI/2.0));

  var reward = reward_theta*reward_x;

  var obs = [x,x_dot,Math.cos(theta),Math.sin(theta),theta_dot];

  return [obs, reward, done];
};
CartPoleSwingUpEnv.prototype.reset = function() {
  var stdev = 0.1;
  var x = randn(0.0, stdev);
  var x_dot = randn(0.0, stdev);
  var theta = randn(Math.PI, stdev);
  var theta_dot = randn(0.0, stdev);
  x = randf(-1.0, 1.0)*this.x_threshold*0.5;
  if (this.hard_mode) {
    // for fun.
    /*
        [rand_x, rand_x_dot, rand_theta, rand_theta_dot] = np.multiply(np.random.rand(4)*2-1, [self.x_threshold, 10., np.pi/2., 10.])
        self.state = np.array([rand_x, rand_x_dot, np.pi+rand_theta, rand_theta_dot])
    */
    x = randf(-1.0, 1.0)*this.x_threshold*1.0;
    x_dot = randf(-1.0, 1.0)*10.0*1.0;
    theta = randf(-1.0, 1.0)*Math.PI/2.0+Math.PI;
    theta_dot = randf(-1.0, 1.0)*10.0*1.0;
  }
  this.state = [x, x_dot, theta, theta_dot];
  if (this.specified_init_state) {
    this.state = this.specified_init_state;
  }
  this.specified_init_state = null;
  this.t = 0;
  var obs = [x,x_dot,Math.cos(theta),Math.sin(theta),theta_dot];
  return obs;
};
CartPoleSwingUpEnv.prototype.render = function(screen_width) {
  var world_width = 5;  // max visible position of cart
  var scale = screen_width/world_width;
  var carty = screen_width/8; // TOP OF CART (assume screen_width == screen_height * 4)
  var polewidth = 6.0*screen_width/600;
  var polelen = scale*this.l;  // 0.6 or this.l;
  var cartwidth = 40.0*screen_width/600;
  var cartheight = 20.0*screen_width/600;

  var state = this.state;
  var x = state[0];
  var x_dot = state[1];
  var theta = state[2];
  var theta_dot = state[3];
  var cartx = x*scale+screen_width/2.0; // MIDDLE OF CART

  this.p.stroke(0);
  this.p.strokeWeight(0.5);

  // track
  this.p.line(screen_width/2 - this.x_threshold*scale,
              carty + cartheight/2 + cartheight/4 + 1,
              screen_width/2 + this.x_threshold*scale,
              carty + cartheight/2 + cartheight/4 + 1);

  var l=-cartwidth/2,r=cartwidth/2,t=cartheight/2,b=-cartheight/2;

  // cart
  this.p.fill(255, 64, 64);
  this.p.push();
  this.p.translate(cartx, carty);
  polygon(this.p, [[l,b], [l,t], [r,t], [r,b]]);
  this.p.pop();

  // L and R wheels
  this.p.fill(192);
  this.p.circle(cartx-cartwidth/2, carty+cartheight/2, cartheight/2);
  this.p.circle(cartx+cartwidth/2, carty+cartheight/2, cartheight/2);

  // pole
  var l=-polewidth/2,r=polewidth/2,t=polelen-polewidth/2,b=-polewidth/2;
  this.p.fill(64, 64, 255);
  this.p.push();
  this.p.translate(cartx, carty);
  this.p.rotate(Math.PI-theta);
  polygon(this.p, [[l,b], [l,t], [r,t], [r,b]]);
  this.p.pop();

  // axle
  this.p.fill(48);
  this.p.circle(cartx, carty, polewidth); // note: diameter, not radius.

};

// p5.js polygon
function polygon(p, points) {
  p.beginShape();
  var N = points.length;
  var x, y;
  for (var i=0; i<N; i++) {
    x = points[i][0];
    y = points[i][1];
    p.vertex(x, y);
  }
  p.endShape(p.CLOSE);
}

// Random numbers util (from https://github.com/karpathy/recurrentjs)
var return_v = false;
var v_val = 0.0;
function gaussRandom() {
  if(return_v) {
    return_v = false;
    return v_val;
  }
  var u = 2*Math.random()-1;
  var v = 2*Math.random()-1;
  var r = u*u + v*v;
  if(r == 0 || r > 1) return gaussRandom();
  var c = Math.sqrt(-2*Math.log(r)/r);
  v_val = v*c; // cache this
  return_v = true;
  return u*c;
}
function randf(a, b) { return Math.random()*(b-a)+a; };
function randi(a, b) { return Math.floor(Math.random()*(b-a)+a); };
function randn(mu, std){ return mu+gaussRandom()*std; };
// from http://www.math.grin.edu/~mooret/courses/math336/bivariate-normal.html
function birandn(mu1, mu2, std1, std2, rho) {
  var z1 = randn(0, 1);
  var z2 = randn(0, 1);
  var x = Math.sqrt(1-rho*rho)*std1*z1 + rho*std1*z2 + mu1;
  var y = std2*z2 + mu2;
  return [x, y];
};
