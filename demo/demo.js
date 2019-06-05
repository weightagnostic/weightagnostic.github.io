// Copyright 2019 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied. See the License for the specific language governing
// permissions and limitations under the License.
/**
 * Author: David Ha <hadavid@google.com>
 *
 * @fileoverview swingup pendulum gym environment ported to p5.js
 *
 */

var sketch = function( p ) { 
  "use strict";

  var screen_width, screen_height; // stores the browser's dimensions
  var actual_screen_width, actual_screen_height;


  // UI
  var canvas;
  var shared_weight = -1.50;

  var title_text="shared weight: "+Math.round(shared_weight*100)/100;
  var drag_me = true;

  var tune_button, restart_button;
  var tune_button_mode = true;

  // agent
  var env = new CartPoleSwingUpEnv( p );
  //var agent = new BaselineAgent();
  var obs, reward, done, result, action;
  var wann_agent = new WANNAgent( p, shared_weight );

  var set_screen = function() {
    // make sure we enforce some minimum size of our demo
    actual_screen_width = Math.max(window.innerWidth, 320);
    actual_screen_height = Math.max(window.innerHeight, 320);
    // make a 4x1 resolution demo.
    var screen_dim = actual_screen_width;
    screen_width = screen_dim;
    screen_height = screen_dim / 4.0;
  }

  var draw_weight_bar = function() {
    var x = screen_width/2*(1+(shared_weight/2.0)*7/8);

    p.stroke(0);
    p.strokeWeight(0.5);

    p.line(screen_width/2, screen_height+20, x, screen_height+20);
    p.fill(255);

    p.circle(screen_width/2, screen_height+20, 20.0*screen_width/600/2);
    p.rect(x-15, screen_height+6, 70, 28);

    p.fill(0);
    p.text(Math.round(shared_weight*100)/100, x, screen_height+25);

    if (drag_me) {
      p.stroke(255,108,0);
      p.fill(255,108,0);
      p.text("⬇ drag me", x, screen_height-10);
    }
  }

  var restart = function() {

    set_screen();

    // reset env
    obs = env.reset();

    canvas = p.createCanvas(screen_width, screen_height+60);
    p.frameRate(60);
    p.background(255, 255, 255, 255);
    p.fill(255, 255, 255, 255);

    p.textFont("Courier New");
    p.textSize(16);

    var canvas_position = canvas.position();
    var cx = canvas_position.x;
    var cy = canvas_position.y;

    restart_button = p.createButton('restart environment');
    restart_button.style("font-family", "Courier New");
    restart_button.style("font-size", "16");

    restart_button.position(cx+screen_width*0.02, cy+screen_height+35+25);
    restart_button.mousePressed(restart_environment);

    if (tune_button_mode) {
      tune_button = p.createButton('tune individual weights');
      tune_button.style("font-family", "Courier New");
      tune_button.style("font-size", "16");

      tune_button.position(cx+screen_width*0.04+restart_button.size().width, cy+screen_height+35+25);
      tune_button.mousePressed(tune_individual_weights);
    }

  };

  var reset_screen = function() {
    set_screen();
    p.resizeCanvas(screen_width, screen_height+60);
    var canvas_position = canvas.position();
    var cx = canvas_position.x;
    var cy = canvas_position.y;
    restart_button.position(cx+screen_width*0.02, cy+screen_height+35+25);
    restart_button.mousePressed(restart_environment);
    if (tune_button_mode) {
      tune_button.position(cx+screen_width*0.04+restart_button.size().width, cy+screen_height+35+25);
      tune_button.mousePressed(tune_individual_weights);
    }
  }

  p.windowResized = function() {
    reset_screen();
  }

  var tune_individual_weights = function() {
    wann_agent.tune_weights();
    title_text = "using tuned individual weights";
  }

  var restart_environment = function() {
    env.reset();
  }

  p.setup = function() {
    restart(); // initialize variables for this demo and redraws interface
  };

  p.draw = function() {
    // clear screen
    p.background(255);

    // draw text
    p.text(title_text, screen_width*0.02, Math.max(screen_width*0.02, 32));

    draw_weight_bar();

    env.render(screen_width);

    action = wann_agent.get_action(obs);

    // gym loop
    result = env.step(action);

    obs = result[0];
    reward = result[1];
    done = result[2];

    if (done) {
      env.reset();
    }

  };

  var touched = function() {
    var mx = p.mouseX;
    var my = p.mouseY;
    if (mx >= 0 && mx < screen_width && my >= 0 && my < screen_height+50) {
      drag_me = false;
      shared_weight = 2.0 * (mx - screen_width/2) / ((screen_width/2)*7/8);
      if (shared_weight >= 2.0) shared_weight = 2.0;
      if (shared_weight <= -2.0) shared_weight = -2.0;
      wann_agent.set_weight(shared_weight);
      title_text="shared weight: "+Math.round(shared_weight*100)/100;
    }
  };

  p.touchMoved = touched;
  p.touchStarted = touched;

};
var custom_p5 = new p5(sketch, 'sketch');
