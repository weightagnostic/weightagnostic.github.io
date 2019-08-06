## Acknowledgements

We would like to thank Douglas Eck, Geoffrey Hinton, Anja Austermann, Jeff Dean, Luke Metz, Ben Poole, Jean-Baptiste Mouret, Michiel Adriaan Unico Bacchiani, Heiga Zen, and Alexander M. Lamb for their thoughtful feedback.

The experiments in this work were performed on 96-core CPU Linux virtual machines provided by [Google Cloud Platform](https://cloud.google.com/).

This article was prepared using the [Distill](https://distill.pub) [template](https://github.com/distillpub/template). Interactive demos were built with [p5.js](https://p5js.org).

Any errors here are our own and do not reflect opinions of our proofreaders and colleagues. If you see mistakes or want to suggest changes, feel free to contribute feedback by participating in the discussion [forum](https://github.com/weightagnostic/weightagnostic.github.io/issues) for this article.

<h3 id="citation">Citation</h3>

For attribution in academic contexts, please cite this work as

<pre class="citation short">Adam Gaier and David Ha, "Weight Agnostic Neural Networks", 2019.</pre>

BibTeX citation

<pre class="citation long">@article{wann2019,
  author = {Adam Gaier and David Ha},
  title  = {Weight Agnostic Neural Networks},
  eprint = {arXiv:1906.04358},
  url    = {https://weightagnostic.github.io},
  note   = "\url{https://weightagnostic.github.io}",
  year   = {2019}
}</pre>

## Open Source Code

We release a general purpose tool, not only to facilitate reproduction, but also for further research in this direction. Our NumPy <dt-cite key="van2011numpy"></dt-cite> implementation of NEAT <dt-cite key="neat"></dt-cite> supports MPI <dt-cite key="mpi_library"></dt-cite> and OpenAI Gym <dt-cite key="openai_gym"></dt-cite> environments.

Please see our [repo](https://github.com/google/brain-tokyo-workshop/tree/master/WANNRelease) for details about the code release.

## Reuse

Diagrams and text are licensed under Creative Commons Attribution [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/) with the [source available on GitHub](https://github.com/weightagnostic/weightagnostic.github.io), unless noted otherwise. The figures that have been reused from other sources don’t fall under this license and can be recognized by the citations in their caption.

## Supplementary Materials

For further discussion about the implementation details of the experiments, and results for multiple independent runs of the search algorithms, please refer to the Supplementary Materials section in the [pdf](https://arxiv.org/abs/1906.04358) version of this article.

## Performance Profiles

### Average Performance (100 trial) versus Weight for Champion Networks

<div style="text-align: center;">
<img src="https://storage.googleapis.com/quickdraw-models/sketchRNN/wann/png/champ_swingup_profile.png" style="display: block; margin: auto; width: 60%;"/>
<figcaption style="text-align: center;">
CartpoleSwingUp
</figcaption>
<br/>
<img src="https://storage.googleapis.com/quickdraw-models/sketchRNN/wann/png/champ_biped_profile.png" style="display: block; margin: auto; width: 60%;"/>
<figcaption style="text-align: center;">
BipedalWalker-v2
</figcaption>
<br/>
<img src="https://storage.googleapis.com/quickdraw-models/sketchRNN/wann/png/champ_carracing_profile.png" style="display: block; margin: auto; width: 60%;"/>
<figcaption style="text-align: center;">
CarRacing-v0
</figcaption>
</div>

## Additional Bipedal Walker Results

### Increasing the search space

<div style="text-align: center;">
<img src="https://storage.googleapis.com/quickdraw-models/sketchRNN/wann/png/biped_net_outConns.png" style="display: block; margin: auto; width: 100%;"/>
<figcaption style="text-align: left;">If we allow connection between outputs (a small modification to the search space), we discovered a simple and elegant WANN for the Bipedal Walker task. This particular network notably ignores many LIDAR, angle, and other input signals that are not required for the task. Refer to section on <i>Performance and Complexity</i> in the main text.</figcaption>
</div>

<div style="text-align: center;">
<video class="b-lazy" data-src="https://storage.googleapis.com/quickdraw-models/sketchRNN/wann/mp4/trial_outConns_-1.0.mp4" type="video/mp4" autoplay muted playsinline loop style="display: block; margin: auto; width: 100%;" ></video>
<figcaption style="text-align: left;">Rollout of policy using above network, weight set to -1.0. Gait is simpler compared to the network in the main text, possibly due to network's simplicity.</figcaption>
</div>

### Bloopers

<div style="text-align: center;">
<video class="b-lazy" data-src="https://storage.googleapis.com/quickdraw-models/sketchRNN/wann/mp4/trial_biped_failures.mp4" type="video/mp4" autoplay muted playsinline loop style="display: block; margin: auto; width: 100%;" ></video>
<figcaption style="text-align: left;">Failure cases at bad weight values.</figcaption>
</div>

<div style="text-align: center;">
<video class="b-lazy" data-src="https://storage.googleapis.com/quickdraw-models/sketchRNN/wann/mp4/trial_balancer.mp4" type="video/mp4" autoplay muted playsinline loop style="display: block; margin: auto; width: 100%;" ></video>
<figcaption style="text-align: left;">But even at some bad weights (here, weight set to +1.14), our agent performs non trivial actions like balancing.</figcaption>
</div>
