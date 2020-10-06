## Abstract 

Not all neural network architectures are created equal, some perform much better than others for certain tasks. But how important are the weight parameters of a neural network compared to its architecture? In this work, we question to what extent neural network architectures alone, without learning any weight parameters, can encode solutions for a given task. We propose a search method for neural network architectures that can already perform a task without any explicit weight training. To evaluate these networks, we populate the connections with a single shared weight parameter sampled from a uniform random distribution, and measure the expected performance. We demonstrate that our method can find minimal neural network architectures that can perform several reinforcement learning tasks without weight training. On supervised learning domain, we find architectures that can achieve much higher than chance accuracy on MNIST using random weights.

______

## Introduction

In biology, precocial species are those whose young already possess certain abilities from the moment of birth <dt-cite key="bbc_islands"></dt-cite>. There is evidence to show that lizard <dt-cite key="miles1995morphological"></dt-cite> and snake <dt-cite key="burger1998antipredator,mori2000does"></dt-cite> hatchlings already possess behaviors to escape from predators. Shortly after hatching, ducks are able to swim and eat on their own <dt-cite key="starck1998patterns"></dt-cite>, and turkeys can visually recognize predators <dt-cite key="goth2001innate"></dt-cite>. In contrast, when we train artificial agents to perform a task, we typically choose a neural network architecture we believe to be suitable for encoding a policy for the task, and find the weight parameters of this policy using a learning algorithm. Inspired by precocial behaviors evolved in nature, in this work, we develop neural networks with architectures that are naturally capable of performing a given task even when their weight parameters are randomly sampled. By using such neural network architectures, our agents can already perform well in their environment without the need to learn weight parameters.

<div style="text-align: center;">
<video class="b-lazy" data-src="assets/mp4/square_biped.mp4" type="video/mp4" autoplay muted playsinline loop style="width:50%;" ></video><video class="b-lazy" data-src="assets/mp4/square_racer.mp4" type="video/mp4" autoplay muted playsinline loop style="width:50%;" ></video>
<br/><br/>
<img class="b-lazy" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src="assets/png/rl_cover_left.png" style="width: 50%;"/><img class="b-lazy" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src="assets/png/rl_cover_right.png" style="width: 50%;"/>
<br/>
<figcaption style="text-align: left;">
<b>Examples of Weight Agnostic Neural Networks: Bipedal Walker (left), Car Racing (right)</b><br/>
We search for architectures by deemphasizing weights. In place of training, networks are assigned a single shared weight value at each rollout. Architectures that are optimized for expected performance over a wide range of weight values are still able to perform various tasks without weight training.
</figcaption>
</div>

Decades of neural network research have provided building blocks with strong inductive biases for various task domains. Convolutional networks <dt-cite key="lecun1995convolutional,fukushima1982neocognitron"></dt-cite> are especially suited for image processing <dt-cite key="cohen2016inductive"></dt-cite>. Recent work <dt-cite key="he2016powerful,ulyanov2018deep"></dt-cite> demonstrated that even randomly-initialized CNNs can be used effectively for image processing tasks such as superresolution, inpainting and style transfer. <dt-cite key="evolino">Schmidhuber et al.</dt-cite> have shown that a randomly-initialized LSTM <dt-cite key="lstm"></dt-cite> with a learned linear output layer can predict time series where traditional RNNs trained using reservoir methods <dt-cite key="jaeger2004harnessing,reservoir"></dt-cite> fail. More recent developments in self-attention <dt-cite key="vaswani2017attention"></dt-cite> and capsule <dt-cite key="sabour2017dynamic"></dt-cite> networks expand the toolkit of building blocks for creating architectures with strong inductive biases for various tasks. Fascinated by the intrinsic capabilities of randomly-initialized CNNs and LSTMs, we aim to search for *weight agnostic neural networks*, architectures with strong inductive biases that can already perform various tasks with random weights.

<div style="text-align: center;">
<br/>
<img class="b-lazy" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src="assets/png/mnist_cover.png" style="display: block; margin: auto; width: 100%;"/>
<br/>
<figcaption style="text-align: left;">
<b>MNIST classification network evolved to work with random weights</b><br/>
Network architectures that already work with random weights are not only easily trainable, they also offer other advantages too. For instance, we can give the same network an ensemble of (untrained) weights to increase performance, without the need to explicitly train any weight parameters.
<br/><br/>
While a conventional network with random initialization will get ~ 10% accuracy on MNIST, this particular network architecture achieves a much better than chance accuracy on MNIST (> 80%) with random weights. Without any weight training, the accuracy increases to > 90% when we use an ensemble of untrained weights.
</figcaption>
</div>

In order to find neural network architectures with strong inductive biases, we propose to search for architectures by deemphasizing the importance of weights. This is accomplished by **(1)** assigning a single shared weight parameter to every network connection and **(2)** evaluating the network on a wide range of this single weight parameter. In place of optimizing weights of a fixed network, we optimize instead for architectures that perform well over a wide range of weights. We demonstrate our approach can produce networks that can be expected to perform various continuous control tasks with a random weight parameter. As a proof of concept, we also apply our search method on a supervised learning domain, and find it can discover networks that, even without explicit weight training, can achieve a much higher than chance test accuracy of $\sim$ 92\% on MNIST. We hope our demonstration of such weight agnostic neural networks will encourage further research exploring novel neural network building blocks that not only possess useful inductive biases, but can also learn using algorithms that are not necessarily limited to gradient-based methods.

<div style="text-align: center;">
<br/>
<div id="intro_demo" class="unselectable" style="text-align: center;"></div>
<br/>
<figcaption style="color:#FF6C00;">Interactive Demo</figcaption>
<figcaption style="text-align: left;">
A weight agnostic neural network performing <i>CartpoleSwingup</i> task. Drag the slider to control the weight parameter and observe the performance at various shared weight parameters. You can also fine-tune the individual weights of all connections in this demo.
</figcaption>
</div>

______

## Related Work

Our work has connections to existing work not only in deep learning, but also to various other fields:

**Architecture Search**&nbsp; Search algorithms for neural network topologies originated from the field of evolutionary computing in the 1990s <dt-cite key="harp1990designing,dasgupta1992designing,fullmer1992using"></dt-cite><dt-cite key="mandischer1993representation,zhang1993evolving,maniezzo1994genetic"></dt-cite><dt-cite key="angeline1994evolutionary,opitz1997connectionist,pujol1998evolving"></dt-cite><dt-cite key="yao1998towards,lee1996evolutionary,gruau1996comparison"></dt-cite><dt-cite key="krishnan1994delta,braun1993evolving"></dt-cite>, although its origins can be traced back to Alan Turing's <dt-cite key="turing1948intelligent">Unorganized Machines</dt-cite>. Our method is based on <dt-cite key="neat">NEAT</dt-cite>, an established topology search algorithm notable for its ability to optimize the weights and structure of networks simultaneously.

In order to achieve state-of-the-art results, recent methods narrow the search space to architectures composed of basic building blocks with strong domain priors such as CNNs <dt-cite key="zoph2016neural,real2017large,liu2017hierarchical,miikkulainen2019evolving"></dt-cite>, recurrent cells <dt-cite key="jozefowicz2015empirical,zoph2016neural,miikkulainen2019evolving"></dt-cite> and self-attention <dt-cite key="so2019evolved"></dt-cite>. However, despite all of the advances made, it has shown that simple random search methods can already achieve SOTA results if such powerful, hand-crafted building blocks with strong domain priors are used <dt-cite key="li2019random,sciuto2019evaluating,real2018regularized"></dt-cite>.

In addition, the inner loop for training the weights of each candidate architecture before evaluation makes neural architecture search computationally costly, although efforts have been made to improve efficiency <dt-cite key="pham2018efficient,brock2017smash,liu2018darts"></dt-cite>. In our approach, we evaluate architectures without weight training, bypassing the costly inner loop, similar to the random trial approach developed by <dt-cite key="hinton1996learning,smith1987learning">Hinton et al.</dt-cite> in the 1990s that evolved architectures to be more weight tolerant, based on the <dt-cite key="baldwin1896new">Baldwin effect</dt-cite> in evolution.

**Bayesian Neural Networks**&nbsp; The weight parameters of a BNN <dt-cite key="mackay1992bayesian,hinton1993keeping,barber1998ensemble"></dt-cite><dt-cite key="bishop2006pattern,neal2012bayesian,gal2016uncertainty"></dt-cite> are not fixed values, but sampled from a distribution. While the parameters of this distribution can be learned <dt-cite key="hanson1990meiosis,hanson1990stochastic,graves2011practical,krueger2017bayesian"></dt-cite>, the number of parameters is often greater than the number of weights. Recently, <dt-cite key="neklyudov2018variance">Neklyudov et al.</dt-cite> proposed variance networks, which sample each weight from a distribution with a zero mean and a learned variance parameter, and show that ensemble evaluations can improve performance on image recognition tasks. We employ a similar approach, sampling weights from a fixed uniform distribution with zero mean, as well as evaluating performance on network ensembles.

**Algorithmic Information Theory**&nbsp; In AIT <dt-cite key="solomonoff1964formal"></dt-cite>, the Kolmogorov complexity <dt-cite key="kolmogorov1965three"></dt-cite> of a computable object is the minimum length of the program that can compute it. The Minimal Description Length (MDL) <dt-cite key="rissanen1978modeling,grunwald2007minimum,rissanen2007information"></dt-cite> is a formalization of Occam's razor, in which a good model is one that is best at compressing its data, including the cost of describing of the model itself. Ideas related to MDL for making neural networks “simple” was proposed in the 1990s, such as simplifying networks by soft-weight sharing <dt-cite key="nowlan1992simplifying"></dt-cite>, reducing the amount of information in weights by making them noisy <dt-cite key="hinton1993keeping"></dt-cite>, and simplifying the search space of its weights <dt-cite key="schmidhuber1997discovering"></dt-cite>. Recent works offer a modern treatment <dt-cite key="blier2018description"></dt-cite> and application <dt-cite key="li2018measuring,trask2018neural"></dt-cite> of these principles in the context of larger network architectures.

While the aforementioned works focus on the information capacity required to represent the *weights* of a predefined network architecture, in this work we focus on finding minimal *architectures* that can represent solutions to various tasks. As our networks still require weights, we borrow ideas from AIT and BNN, and take them a bit further. Motivated by MDL, in our approach, we apply weight-sharing to the entire network and treat the weight as a random variable sampled from a fixed distribution.

**Network Pruning**&nbsp; By removing connections with small weight values from a trained neural network, pruning approaches <dt-cite key="lecun1990optimal,hassibi1993second,han2015learning"></dt-cite><dt-cite key="guo2016dynamic,li2016pruning,molchanov2016pruning"></dt-cite><dt-cite key="luo2017thinet,liu2018rethinking,mallya2018piggyback"></dt-cite> can produce sparse networks that keep only a small fraction of the connections, while maintaining similar performance on image classification tasks compared to the full network. By retaining the original weight initialization values, these sparse networks can even be trained from scratch to achieve a higher test accuracy <dt-cite key="frankle2018lottery,lee2018snip"></dt-cite> than the original network. Similar to our work, a concurrent work <dt-cite key="zhou2019deconstructing"></dt-cite> found pruned networks that can achieve image classification accuracies that are much better than chance even with randomly initialized weights.

Network pruning is a complementary approach to ours; it starts with a full, trained network, and takes away connections, while in our approach, we start with no connections, and add complexity as needed. Compared to our approach, pruning requires prior training of the full network to obtain useful information about each weight in advance. In addition, the architectures produced by pruning are limited to the full network, while in our method there is no upper bound on the network's complexity.

**Neuroscience**&nbsp; A *connectome* <dt-cite key="seung2012connectome,seung2012ted"></dt-cite> is the “wiring diagram” or mapping of all neural connections of the brain. While it is a challenge to map out the human connectome <dt-cite key="sporns2005human"></dt-cite>, with our 90 billion neurons and 150 trillion synapses, the connectome of simple organisms such as roundworms <dt-cite key="white1986structure,varshney2011structural"></dt-cite> has been constructed, and recent works <dt-cite key="eichler2017complete,takemura2017connectome"></dt-cite> mapped out the entire brain of a small fruit fly. A motivation for examining the connectome, even of an insect, is that it will help guide future research on how the brain learns and represents memories in its connections. For humans it is evident, especially during early childhood <dt-cite key="huttenlocher1990morphometric,tierney2009brain"></dt-cite>, that we learn skills and form memories by forming new synaptic connections, and our brain rewires itself based on our new experiences <dt-cite key="black1990learning,bruer1999neural,kleim2002motor,dayan2011neuroplasticity"></dt-cite>.

The connectome can be viewed as a graph <dt-cite key="bullmore2009complex,he2010graph,van2011rich"></dt-cite>, and analyzed using rich tools from graph theory, network science and computer simulation. Our work also aims to learn network graphs that can encode skills and knowledge for an artificial agent in a simulation environment. By deemphasizing learning of weight parameters, we encourage the agent instead to develop ever-growing networks that can encode acquired skills based on its interactions with the environment. Like the connectome of simple organisms, the networks discovered by our approach are small enough to be analyzed.

______

## Weight Agnostic Neural Network Search

Creating network architectures which encode solutions is a fundamentally different problem than that addressed by neural architecture search (NAS). The goal of NAS techniques is to produce architectures which, once trained, outperform those designed by humans. It is never claimed that the solution is innate to the structure of the network. Networks created by NAS are exceedingly ‘trainable’ -- but no one supposes these networks will solve the task without training the weights. The weights *are* the solution; the found architectures merely a better substrate for the weights to inhabit.

To produce architectures that themselves encode solutions, the importance of weights must be minimized. Rather than judging networks by their performance with optimal weight values, we can instead measure their performance when their weight values are drawn from a random distribution. Replacing weight training with weight sampling ensures that performance is a product of the network topology alone. Unfortunately, due to the high dimensionality, reliable sampling of the weight space is infeasible for all but the simplest of networks. Though the curse of dimensionality prevents us from efficiently sampling high dimensional weight spaces, by enforcing weight-sharing on *all* weights, the number of weight values is reduced to one. Systematically sampling a single weight value is straight-forward and efficient, enabling us to approximate network performance in only a handful of trials. This approximation can then be used to drive the search for ever better architectures.

<div style="text-align: center;">
<br/>
<img class="b-lazy" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src="assets/png/schematic.png" style="display: block; margin: auto; width: 100%;"/>
<br/>
<figcaption style="text-align: left;">
<b>Overview of Weight Agnostic Neural Network Search</b><br/>
Weight Agnostic Neural Network Search avoids weight training while exploring the space of neural network topologies by sampling a single shared weight at each rollout. Networks are evaluated over several rollouts. At each rollout a value for the single shared weight is assigned and the cumulative reward over the trial is recorded. The population of networks is then ranked according to their performance and complexity. The highest ranking networks are then chosen probabilistically and varied randomly to form a new population, and the process repeats.
</figcaption>
</div>

The search for these weight agnostic neural networks (WANNs) can be summarized as follows (See above figure for an overview): 

**1.**&nbsp; An initial population of minimal neural network topologies is created.

**2.**&nbsp; Each network is evaluated over multiple rollouts, with a different shared weight value assigned at each rollout. 

**3.**&nbsp; Networks are ranked according to their performance *and* complexity.

**4.**&nbsp; A new population is created by varying the highest ranked network topologies, chosen probabilistically through tournament selection <dt-cite key="tournamentSelection"></dt-cite>. 

The algorithm then repeats from **(2)**, yielding weight agnostic topologies of gradually increasing complexity that perform better over successive generations.

**Topology Search**&nbsp; The operators used to search for neural network topologies are inspired by the well-established neuroevolution algorithm NEAT <dt-cite key="neat"></dt-cite>. While in NEAT the topology and weight values are optimized simultaneously, we ignore the weights and apply only topological search operators.

<div style="text-align: center;">
<br/>
<img class="b-lazy" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src="assets/png/operators.png" style="display: block; margin: auto; width: 100%;"/>
<br/>
<figcaption style="text-align: left;">
<b>Operators for searching the space of network topologies</b><br/>
<i>Left:</i> A minimal network topology, with input and outputs only partially connected. 
<br/>
<i>Middle:</i> Networks are altered in one of three ways:<br/>
&nbsp;&nbsp;<i>(1) Insert Node</i>: a new node is inserted by splitting an existing connection.<br/>
&nbsp;&nbsp;<i>(2) Add Connection</i>: a new connection is added by connecting two previously unconnected nodes.<br/>
&nbsp;&nbsp;<i>(3) Change Activation</i>: the activation function of a hidden node is reassigned.<br/>
<i>Right:</i> Possible activation functions (linear, step, sin, cosine, Gaussian, tanh, sigmoid, inverse, absolute value, ReLU) shown over the range [2, 2].
</figcaption>
</div>

The initial population is composed of sparsely connected networks, networks with no hidden nodes and only a fraction of the possible connections between input and output. New networks are created by modifying existing networks using one of three operators: insert node, add connection, or change activation (See figure above). To insert a node, we split an existing connection into two connections that pass through this new hidden node. The activation function of this new node is randomly assigned. New connections are added between previously unconnected nodes, respecting the feed-forward property of the network. When activation functions of hidden nodes are changed, they are assigned at random. Activation functions include both the common (e.g. linear, sigmoid, ReLU) and more exotic (Gaussian, sinusoid, step), encoding a variety of relationships between inputs and outputs.

**Performance and Complexity**&nbsp; Network topologies are evaluated using several shared weight values. At each rollout a new weight value is assigned to *all* connections, and the network is tested on the task. In these experiments we used a fixed series of weight values (-2, -1, -0.5, +0.5, +1, +2) to decrease the variance between evaluations.<dt-fn>Variations on these particular values had little effect, though weight values in the range [-2, 2] showed the most variance in performance. Networks whose weight values were set to greater than 3 tended to perform similarly -- presumably saturating many of the activation functions. Weight values near 0 were also omitted to reduce computation, as regardless of the topology little to no signal was sent to the output.</dt-fn> We calculate the mean performance of a network topology by averaging its cumulative reward over all rollouts using these different weight values.

Motivated by algorithmic information theory <dt-cite key="solomonoff1964formal"></dt-cite>, we are not interested in searching merely for *any* weight agnostic neural networks, but networks that can be described with a minimal description length <dt-cite key="rissanen1978modeling,grunwald2007minimum,rissanen2007information"></dt-cite>. Given two different networks with similar performance we prefer the simpler network. By formulating the search as a multi-objective optimization problem <dt-cite key="konak2006multi,mouret2011novelty"></dt-cite> we take into account the size of the network as well as its performance when ranking it in the population. We apply the connection cost technique from <dt-cite key="clune2013evolutionary"></dt-cite> shown to produce networks that are more simple, modular, and evolvable. Networks topologies are judged based on three criteria: mean performance over all weight values, max performance of the single best weight value, and the number of connections in the network. Rather than attempting to balance these criteria with a hand-crafted reward function for each new task, we rank the solutions based on dominance relations <dt-cite key="nsga2"></dt-cite>.

Ranking networks in this way requires that any increase in complexity is accompanied by an increase in performance. While encouraging minimal and modular networks, this constraint can make larger structural changes -- which may require several additions before paying off -- difficult to achieve. To relax this constraint we rank by complexity only probabilistically: in 80% of cases networks are ranked according to mean performance and the number of connections, in the other 20% ranking is done by mean performance and max performance.

______

## Experimental Results

**Continuous Control**&nbsp; Weight agnostic neural networks (WANNs) are evaluated on three continuous control tasks.

The first, *CartPoleSwingUp*, is a classic control problem where, given a cart-pole system, a pole must be swung from a resting to upright position and then balanced, without the cart going beyond the bounds of the track. The swingup task is more challenging than the simpler *CartPole* <dt-cite key="openai_gym"></dt-cite>, where the pole starts upright. Unlike the simpler task, it cannot be solved with a linear controller <dt-cite key="tedrake2009underactuated,raiko2009variational"></dt-cite>. The reward at every timestep is based on the distance of the cart from track edge and the angle of the pole. Our environment is closely based on the one described in <dt-cite key="gal2016improving,deepPILCOgithub"></dt-cite>.

The second task, *BipedalWalker-v2* <dt-cite key="openai_gym"></dt-cite>, is to guide a two-legged agent across randomly generated terrain. Rewards are awarded for distance traveled, with a cost for motor torque to encourage efficient movement. Each leg is controlled by a hip and knee joint in reaction to 24 inputs, including LIDAR sensors which detect the terrain and proprioceptive information such as the agent's joint speeds. Compared to the low dimensional *CartPoleSwingUp*, *BipedalWalker-v2* has a non-trivial number of possible connections, requiring WANNs to be selective about the wiring of inputs to outputs.

The third, *CarRacing-v0* <dt-cite key="openai_gym"></dt-cite>, is a top-down car racing from pixels environment. A car, controlled with three continuous commands (gas, steer, brake) is tasked with visiting as many tiles as possible of a randomly generated track within a time limit. Following the approach described in <dt-cite key="ha2018worldmodels"></dt-cite>, we delegate the pixel interpretation element of the task to a pre-trained variational autoencoder <dt-cite key="kingma2013auto,vae_dm"></dt-cite> (VAE) which compresses the pixel representation to 16 latent dimensions. These dimensions are given as input to the network. The use of learned features tests the ability of WANNs to learn abstract associations rather than encoding explicit geometric relationships between inputs.

Hand-designed networks found in the literature <dt-cite key="ha2018designrl,ha2018worldmodels"></dt-cite> are compared to the best weight agnostic networks found for each task. We compare the mean performance over 100 trials under 4 conditions:

**1.**&nbsp; *Random weights*:&nbsp; individual weights drawn from $\mathcal{U}(-2,2)$.

**2.**&nbsp; *Random shared weight*:&nbsp; a single shared weight drawn from $\mathcal{U}(-2,2)$.

**3.**&nbsp; *Tuned shared weight*:&nbsp; the highest performing shared weight value in range $(-2,2)$.

**4.**&nbsp; *Tuned weights*:&nbsp; individual weights tuned using population-based REINFORCE <dt-cite key="williams1992simple"></dt-cite>.

<div style="text-align: center;">
<br/>
<img class="b-lazy" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src="assets/png/control_results.png" style="display: block; margin: auto; width: 100%;"/>
<br/>
<figcaption style="text-align: left;">
<b>Performance of Randomly Sampled and Trained Weights for Continuous Control Tasks</b><br/>
We compare the mean performance (over 100 trials) of the best weight agnostic network architectures found with standard feed forward network policies commonly used in previous work (i.e. we use SOTA baselines from <dt-cite key="ha2018designrl"></dt-cite> for Biped and <dt-cite key="ha2018worldmodels"></dt-cite> for CarRacing). The intrinsic bias of a network topology can be observed by measuring its performance using a shared weight sampled from a uniform distribution. By tuning this shared weight parameter we can measure its maximum performance. To facilitate comparison to baseline architectures we also conduct experiments where networks are allowed unique weight parameters and tuned.
</figcaption>
</div>

The results are summarized in the above table.<dt-fn>We conduct several independent search runs to measure variability of results in Supplementary Materials.</dt-fn> In contrast to the conventional fixed topology networks used as baselines, which only produce useful behaviors after extensive tuning, WANNs perform even with random shared weights. Though their architectures encode a strong bias toward solutions, WANNs are not completely independent of the weight values -- they do fail when individual weight values are assigned randomly. WANNs function by encoding relationships between inputs and outputs, and so while the importance of the magnitude of the weights is not critical, their consistency, especially consistency of sign, is. An added benefit of a single shared weight is that it becomes trivial to tune this single parameter, without requiring the use of gradient-based methods.

The best performing shared weight value produces satisfactory if not optimal behaviors: a balanced pole after a few swings, effective if inefficient gaits, wild driving behaviour that cuts corners. These basic behaviors are encoded entirely within the architecture of the network. And while WANNs are able to perform without training, this predisposition does not prevent them from reaching similar state-of-the-art performance when the weights *are* trained.

<div style="text-align: center;">
<br/>
<img class="b-lazy" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src="assets/png/swingup_top.png" style="display: block; margin: auto; width: 100%;"/>
<br/>
<table cellspacing="0" cellpadding="0" style="border: none; width:100%">
  <tr>
    <td style="width:50%; border:none;"><div id="demo_0008" class="unselectable"></div></td>
    <td style="width:50%; border:none;"><div id="demo_0032" class="unselectable"></div></td>
  </tr>
</table>
<img class="b-lazy" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src="assets/png/swingup_bottom.png" style="display: block; margin: auto; width: 100%;"/>
<br/>
<table cellspacing="0" cellpadding="0" style="border: none; width:100%">
  <tr>
    <td style="width:50%; border:none;"><div id="demo_0128" class="unselectable"></div></td>
    <td style="width:50%; border:none;"><div id="demo_1024" class="unselectable"></div></td>
  </tr>
</table>
<figcaption style="color:#FF6C00;">Interactive Demo</figcaption>
<figcaption style="text-align: left;">
<b>Development of Weight Agnostic topologies over time</b><br/>
<i>Generation 8</i>: An early network which performs poorly with nearly all weights.
<br/>
<i>Generation 32</i>: Relationships between the position of the cart and velocity of the pole are established. The tension between these relationships produces both centering and swing-up behavior.
<br/>
<i>Generation 128</i>: Complexity is added to refine the balancing behavior of the elevated pole.
<br/>
<i>Generation 1024</i>: Letting the evolution run for many more generations to further refine the architecture.
</figcaption>
</div>

As the networks discovered are small enough to interpret, we can derive insights into how they function by looking at network diagrams (See above figure). Examining the development of a WANN which solves *CartPoleSwingUp* is also illustrative of how relationships are encoded within an architecture. In the earliest generations the space of networks is explored in an essentially random fashion. By generation 32, preliminary structures arise which allow for consistent performance: the three inverters applied to the $x$ position keep the cart from leaving the track. The center of the track is at $0$, left is negative, right is positive. By applying positive force when the cart is in a negative position and vice versa a strong attractor towards the center of the track is encoded.

<div style="text-align: center;">
<br/>
<img class="b-lazy" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src="assets/png/champ_swingup.png" style="display: block; margin: auto; width: 100%;"/>
<figcaption style="text-align: center;">
CartpoleSwingUp champion network<br/>
</figcaption>
</div>

The interaction between the regulation of position and the Gaussian activation on $d\theta$ is responsible for the swing-up behavior, also developed by generation 32. At the start of the trial the pole is stationary: the Gaussian activation of $d\theta$ is 1 and force is applied. As the pole moves toward the edge the nodes connected to the $x$ input, which keep the cart in the center, begin sending an opposing force signal. The cart's progress toward the edge is slowed and the change in acceleration causes the pole to swing, increasing $d\theta$ and so decreasing the signal that is pushing the cart toward the edge. This slow down causes further acceleration of the pole, setting in motion a feedback loop that results in the rapid dissipation of signal from $d\theta$. The resulting snap back of the cart towards the center causes the pole to swing up. As the pole falls and settles the same swing up behavior is repeated, and the controller is rewarded whenever the pole is upright.

<div style="text-align: center;">
<br/>
<div id="final_demo" class="unselectable" style="text-align: center;"></div>
<br/>
<figcaption style="color:#FF6C00;">Interactive Demo</figcaption>
<figcaption style="text-align: left;">
<b>Tuned weights for champion network at generation 1024</b><br/>
We can easily train each individual weight connection of our network by using the best shared weight as a starting point and solving for the offsets from the shared weight parameter. We used population-based REINFORCE <dt-cite key="williams1992simple"></dt-cite> to fine-tune our weights, but in principle any learning algorithm can be used.
<br/><br/>
To visualize the agent's performance outside of the training distribution, this demo uses more chaotic initial conditions than the original settings (in both the architecture search and individual fine-tuned training).
</figcaption>
</div>

As the search process continues, some of these controllers linger in the upright position longer than others, and by generation 128, the lingering duration is long enough for the pole to be kept balanced. Though this more complicated balancing mechanism is less reliable under variable weights than the swing-up and centering behaviors, the more reliable behaviors ensure that the system recovers and tries again until a balanced state is found. Notably, as these networks encode relationships and rely on tension between systems set against each other, their behavior is consistent with a wide range of shared weight values.

______

<div style="text-align: center;">
<img class="b-lazy" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src="assets/png/rl_cover_left.png" style="width: 50%;"/><video class="b-lazy" data-src="assets/mp4/square_biped.mp4" type="video/mp4" autoplay muted playsinline loop style="width:50%;" ></video>
<br/>
<figcaption style="text-align: left;">
A minimal architecture discovered in earlier generations that is still capable of controlling the Bipedal Walker to walk forward, despite not achieving an excellent score.
</figcaption>
</div>

WANN controllers for *BipedalWalker-v2* and *CarRacing-v0* are likewise remarkable in their simplicity and modularity. The biped controller uses only 17 of the 25 possible inputs, ignoring many LIDAR sensors and knee speeds. The best WANN architecture (below) not only solves the task without training the individual weights, but uses only 210 connections, an order of magnitude fewer than commonly used topologies (2804 connections used in the SOTA baseline <dt-cite key="ha2018designrl"></dt-cite>).

<div style="text-align: center;">
<br/>
<img class="b-lazy" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src="assets/png/champ_biped.png" style="display: block; margin: auto; width: 100%;"/>
<figcaption style="text-align: center;">
BipedalWalker champion network<br/>
</figcaption>
</div>
<div style="text-align: center;">
<video class="b-lazy" data-src="assets/mp4/trial_biped_-1.5.mp4" type="video/mp4" autoplay muted playsinline loop style="display: block; margin: auto; width: 100%;" ></video>
<figcaption style="text-align: center;">
Weight set to -1.5<br/>
</figcaption>
<video class="b-lazy" data-src="assets/mp4/trial_example_biped_-1.0.mp4" type="video/mp4" autoplay muted playsinline loop style="display: block; margin: auto; width: 100%;" ></video>
<figcaption style="text-align: center;">
Weight set to -1.0<br/>
</figcaption>
<video class="b-lazy" data-src="assets/mp4/trained_biped.mp4" type="video/mp4" autoplay muted playsinline loop style="display: block; margin: auto; width: 100%;" ></video>
<figcaption style="text-align: center;">
Fine-tuned individual weights of champion network (Average score 332 ± 1)<br/>
</figcaption>
</div>

______

The architecture which encodes stable driving behavior in the car racer is also striking in its simplicity. Only a sparsely connected two layer network (below) and a single weight value is required to encode capable, but imperfect driving behavior.

<div style="text-align: center;">
<img class="b-lazy" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src="assets/png/rl_cover_right.png" style="width: 50%;"/><video class="b-lazy" data-src="assets/mp4/square_racer.mp4" type="video/mp4" autoplay muted playsinline loop style="width:50%;" ></video>
<br/>
<figcaption style="text-align: left;">
A minimal architecture discovered in earlier generations for <i>CarRacing-v0</i>.
</figcaption>
</div>

While the SOTA baseline <dt-cite key="ha2018worldmodels"></dt-cite> also gave the hidden states of a pre-trained RNN world model, in addition to the VAE's representation to its controller, our controller operates on the VAE's latent space alone. Nonetheless, our search procedure was able to find a feed-forward controller (below) that achieves a comparable score. Future work will explore removing the feed-forward constraint from the search to allow WANNs to develop recurrent connections with memory states.

<div style="text-align: center;">
<br/>
<img class="b-lazy" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src="assets/png/champ_carracing.png" style="display: block; margin: auto; width: 100%;"/>
<figcaption style="text-align: center;">
Champion network for <i>CarRacing-v0</i><br/>
</figcaption>
</div>

<div style="text-align: center;">
<video class="b-lazy" data-src="assets/mp4/trial_racer_-1.4.800px.mp4" type="video/mp4" autoplay muted playsinline loop style="display: block; margin: auto; width: 100%;" ></video>
<figcaption style="text-align: center;">
Weight set to -1.4<br/>
</figcaption>
<video class="b-lazy" data-src="assets/mp4/trial_racer_+1.0.800px.mp4" type="video/mp4" autoplay muted playsinline loop style="display: block; margin: auto; width: 100%;" ></video>
<figcaption style="text-align: center;">
Weight set to +1.0<br/>
</figcaption>
<video class="b-lazy" data-src="assets/mp4/trained_racer.mp4" type="video/mp4" autoplay muted playsinline loop style="display: block; margin: auto; width: 100%;" ></video>
<figcaption style="text-align: center;">
Fine-tuned individual weights of champion network (Average score 893 ± 74)<br/>
</figcaption>
</div>

______

**Classification**&nbsp; Promising results on reinforcement learning tasks lead us to consider how widely a WANN approach can be applied. WANNs which encode relationships between inputs are well suited to RL tasks: low-dimensional inputs coupled with internal states and environmental interaction allow discovery of reactive and adaptive controllers. Classification, however, is a far less fuzzy and forgiving problem. A problem where, unlike RL, design of architectures has long been a focus. As a proof of concept, we investigate how WANNs perform on the <dt-cite key="lecun1998mnist">MNIST</dt-cite> dataset, an image classification task which has been a focus of human-led architecture design for decades <dt-cite key="lecun1998gradient,chollet2015keras,sabour2017dynamic"></dt-cite>.

| WANN | Test Accuracy |
|---|---|
| Random Weight | 82.0% $\pm$ 18.7% |
| Ensemble Weights&nbsp;&nbsp; | 91.6% |
| Tuned Weight | 91.9% |
| Trained Weights | 94.2%  |

<br/>

| ANN | Test Accuracy |
|---|---|
| Linear Regression&nbsp;&nbsp; | 91.6% <dt-cite key="lecun1998gradient"></dt-cite> |
| Two-Layer CNN | 99.3% <dt-cite key="chollet2015keras"></dt-cite> |

<div style="text-align: center;">
<br/>
<figcaption style="text-align: left;">
<b>Classification Accuracy on MNIST</b><br/>
WANNs instantiated with multiple weight values acting as an ensemble perform far better than when weights are sampled at random, and as well as a linear classifier with thousands of weights.
</figcaption>
</div>

Even in this high-dimensional classification task WANNs perform remarkably well. Restricted to a single weight value, WANNs are able to classify MNIST digits as well as a single layer neural network with thousands of weights trained by gradient descent. The architectures created still maintain the flexibility to allow weight training, allowing further improvements in accuracy.

<div style="text-align: center;">
<br/>
<img class="b-lazy" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src="assets/png/digit_accuracy_by_weight.png" style="display: block; margin: auto; width: 100%;"/>
<br/>
<figcaption style="text-align: left;">
<b>Digit Accuracy by Weight</b><br/>
No single weight value has better accuracy on all digits. That WANNs can be instantiated as several <i>different</i> networks has intriguing possibilities for the creation of ensembles.
</figcaption>
</div>

It is straight forward to sweep over the range of weights to find the value which performs best on the training set, but the structure of WANNs offers another intriguing possibility. At each weight value the prediction of a WANN is different. On MNIST this can be seen in the varied accuracy on each digit. Each weight value of the network can be thought of as a distinct classifier, creating the possibility of using a single WANN with multiple weight values as self-contained ensemble.

<div style="text-align: center;">
<br/>
<img id="mnist_figure" src="assets/png/mnist_all.png" style="display: block; margin: auto; width: 100%;"/>
<div class="btn-group">
  <button id="mnist_all">All</button>&nbsp;
  <button id="mnist_0">0</button>&nbsp;
  <button id="mnist_1">1</button>&nbsp;
  <button id="mnist_2">2</button>&nbsp;
  <button id="mnist_3">3</button>&nbsp;
  <button id="mnist_4">4</button>&nbsp;
  <button id="mnist_5">5</button>&nbsp;
  <button id="mnist_6">6</button>&nbsp;
  <button id="mnist_7">7</button>&nbsp;
  <button id="mnist_8">8</button>&nbsp;
  <button id="mnist_9">9</button>
</div>
<br/>
<figcaption style="color:#FF6C00;">Interactive Demo</figcaption>
<figcaption style="text-align: left;">
<b>MNIST Classifier</b><br/>
Not all neurons and connections are used to predict each digit. Starting from the output connection for a particular digit, we can map out the part of the network used to classify that digit. We can also see which parts of the inputs are used for classification.
</figcaption>
</div>

In the simplest ensemble approach, a collection of networks are created by instantiating a WANN with a range of weight values. Each of these networks is given a single vote, and the ensemble classifies samples according to the category which received the most votes. This approach yields predictions far more accurate than randomly selected weight values, and only slightly worse than the best possible weight. That the result of this naive ensemble is successful is encouraging for experimenting with more sophisticated ensemble techniques when making predictions or searching for architectures.

______

## Discussion and Future Work

In this work we introduced a method to search for simple neural network architectures with strong inductive biases for performing a given task. Since the networks are optimized to perform well using a single weight parameter over a range of values, this single parameter can easily be tuned to increase performance. Individual weight values can then be further tuned as offsets from the best shared weight. The ability to quickly fine-tune weights is useful in few-shot learning <dt-cite key="finn2017model"></dt-cite> and may find uses in continual lifelong learning where agents continually acquire, fine-tune, and transfer skills throughout their lifespan <dt-cite key="parisi2018continual"></dt-cite>, like in animals <dt-cite key="zador2019critique"></dt-cite>. Early works <dt-cite key="ackley1991interactions,hinton1996learning,smith1987learning"></dt-cite> connected the evolution of weight tolerant networks to the Baldwin effect <dt-cite key="baldwin1896new"></dt-cite>, where organisms with the ability to efficiently learn new skills actually evolve much faster as a species.

We are also interested in WANNs that are able to perform multiple tasks. To develop a single WANN capable of encoding many different useful tasks in its environment, one might consider developing a WANN with a strong intrinsic bias for intrinsic motivation <dt-cite key="schmidhuber1991curious,oudeyer2007intrinsic,pathak2017curiosity"></dt-cite>, and continuously optimize its architecture to perform well at pursuing novelty in an open-ended environment <dt-cite key="lehman2008exploiting"></dt-cite>. Such a WANN might encode, through a curiosity reward signal, a multitude of skills that can easily be fine-tuned for particular downstream tasks in its environment.

While our approach learns network architectures of increasing complexity by adding connections, network pruning approaches find new architectures by their removal. It is also possible to learn  a pruned network capable of performing additional tasks without learning weights <dt-cite key="mallya2018piggyback"></dt-cite>. A concurrent work <dt-cite key="zhou2019deconstructing"></dt-cite> to ours learns a *supermask* where the sub-network pruned using this mask performs well at image recognition even with randomly initialized weights -- it is interesting that their approach achieves a similar range of performance on MNIST compared to ours. While our search method is based on evolution, future work may extend the approach by incorporating recent ideas that formulate architecture search in a differentiable manner <dt-cite key="liu2018darts"></dt-cite> to make the search more efficient.

The success of deep learning is attributed to our ability to train the weights of large neural networks that consist of well-designed building blocks on large datasets, using gradient descent. While much progress has been made, there are also limitations, as we are confined to the space of architectures that gradient descent is able to train. For instance, effectively training models that rely on discrete components <dt-cite key="jang2016categorical,graves2014neural"></dt-cite> or utilize adaptive computation mechanisms <dt-cite key="graves2016adaptive"></dt-cite> with gradient-based methods remain a challenging research area. We hope this work will encourage further research that facilitates the discovery of new architectures that not only possess inductive biases for practical domains, but can also be trained with algorithms that may not require gradient computation.

That the networks found in this work do not match the performance of convolutional neural networks is not surprising. It would be an almost embarrassing achievement if they did. For decades CNN architectures have been refined by human scientists and engineers -- but it was not the reshuffling of existing structures which originally unlocked the capabilities of CNNs. Convolutional layers were themselves once novel building blocks, building blocks with strong biases toward vision tasks, whose discovery and application have been instrumental in the incredible progress made in deep learning. The computational resources available to the research community have grown significantly since the time convolutional neural networks were discovered. If we are devoting such resources to automated discovery and hope to achieve more than incremental improvements in network architectures, we believe it is also worth trying to discover new building blocks, not just their arrangements.

Finally, we see similar ideas circulating in the neuroscience community. A recent neuroscience commentary, *“What artificial neural networks can learn from animal brains”* <dt-cite key="zador2019critique"></dt-cite> provides a critique of how *learning* (and also *meta-learning*) is currently implemented in artificial neural networks. <dt-cite key="zador2019critique">Zador</dt-cite> highlights the stark contrast with how biological learning happens in animals:

*“The first lesson from neuroscience is that much of animal behavior is innate, and does not arise from learning. Animal brains are not the blank slates, equipped with a general purpose learning algorithm ready to learn anything, as envisioned by some AI researchers; there is strong selection pressure for animals to restrict their learning to just what is needed for their survival.”* <dt-cite key="zador2019critique"></dt-cite>

This work is strongly motivated towards these goals of blending innate behavior and learning, and we believe it is a step towards addressing the challenge posed by Zador. We hope this article will help bring neuroscience and machine learning communities closer together to tackle these challenges.

*If you would like to discuss any issues or give feedback, please visit the [GitHub](https://github.com/weightagnostic/weightagnostic.github.io/issues) repository of this page for more information.*
