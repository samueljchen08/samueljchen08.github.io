# Multi-Object-Tracking — figures transcribed from notebook outputs

Source: `sports_tracking_colab.ipynb` stored cell outputs in https://github.com/samueljchen08/Multi-Object-Tracking (extracted 2026-09-03). Paper: https://drive.google.com/file/d/14I8We1yRNw1d1kzCVHLzmc5P-jsfh__H/view


A tracking pipeline on the SportsMOT basketball sequences, built to answer one question
with a real comparison rather than a demonstration.

**Pipeline:** SportsMOT annotations → ball detection (YOLO11) → homography → feature
engineering → Kalman, MLP, XGBoost and LSTM.

## Setup

Player trajectories come from MOT-format ground truth across 30 basketball sequences.
Ball detection runs YOLO11m per frame on COCO class 32, checkpointed per sequence. A
homography built from eight court landmarks maps pixel coordinates into real court
coordinates in feet on the standard 94 ft × 50 ft floor, so every error below is a
physical distance rather than a number in scaled space.

Per player per frame the features are velocity, acceleration, speed, and — where the ball
was found — its direction and distance. The target is the next-frame court position.

Splits are **by sequence, not by row**, so no player's trajectory appears on both sides of
the split: 21 sequences to train (138,357 rows), 4 to validate (32,072), 5 to test (30,315).

## The detector is the constraint

| Measure | Value |
| --- | --- |
| Total ball detections | 3,228 across 30 sequences |
| Mean detection rate per sequence | 10.9% |
| Feature rows | 200,744 · ball coverage 9.6% |

Two sequences reached 56% and 60%; most sat under 10%. Everything downstream is shaped by
that number.

## Full test set

All learned models trained on ~140k rows. The Kalman filter uses no training data at all —
its single parameter `q_var` was tuned on validation only.

| Model | MAE (ft) | MAE-x | MAE-y |
| --- | --- | --- | --- |
| **Kalman (no ball)** | **0.219** | 0.292 | 0.147 |
| XGBoost (no ball) | 0.267 | 0.324 | 0.211 |
| LSTM (no ball) | 0.394 | 0.537 | 0.252 |
| MLP (no ball) | 0.595 | 0.835 | 0.356 |

A constant-velocity physics model beat every network. At 25 FPS a player moves very little
between frames, and that is a regime where kinematics is simply the better prior.

## The actual question, answered fairly

Comparing a +ball model against a no-ball model trained on all 140k rows would confound the
ball features with a 9× difference in training data. So every model in this table is
trained on the same 16,009 ball-detected rows.

| Model | MAE (ft) | MAE-x | MAE-y |
| --- | --- | --- | --- |
| XGBoost (no ball, fair) | **0.405** | 0.498 | 0.312 |
| XGBoost (+ ball) | 0.424 | 0.388 | 0.460 |
| MLP (no ball, fair) | **0.761** | 1.098 | 0.423 |
| MLP (+ ball) | 0.821 | 1.199 | 0.443 |
| LSTM (no ball, fair) | **2.014** | 3.108 | 0.920 |
| LSTM (+ ball) | 2.203 | 3.396 | 1.010 |

Every architecture got **worse** with ball features. The answer to the research question is
no — three times, independently.

The Kalman filter degrades badly on this subset (1.469 ft) for a mechanical reason worth
stating: ball-detected frames are sampled sparsely and non-contiguously, so the constant-
velocity assumption between consecutive *available* frames no longer holds.

## Prediction horizon

Errors compound with the number of frames predicted ahead:

| Model | N=1 | N=3 | N=5 | N=10 |
| --- | --- | --- | --- | --- |
| Kalman | 0.219 | 0.615 | 1.020 | 2.131 |
| XGBoost (autoregressive) | 0.267 | 0.744 | 1.239 | 2.608 |
| MLP (autoregressive) | 0.595 | 2.113 | 3.771 | 7.123 |

## Reversing the question

If ball position does not predict player movement, does player formation predict ball
position? Twelve aggregate features per frame — centroid, spread, velocity statistics —
regressed onto ball location, against two baselines.

| Model | MAE (ft) | MAE-x | MAE-y |
| --- | --- | --- | --- |
| **Kalman (ball trajectory only)** | **8.514** | 9.253 | 7.775 |
| XGBoost (player aggregates) | 13.750 | 14.780 | 12.720 |
| Naive (training mean position) | 14.305 | 15.572 | 13.038 |
| MLP (player aggregates) | 14.383 | 14.832 | 13.935 |
| LSTM (player aggregates, N=5) | 15.869 | 17.594 | 14.144 |

Also no. Two of the three learned models are **worse than always guessing the mean
position**, and the only thing that beats the naive baseline meaningfully is tracking the
ball's own trajectory — which uses no player information whatsoever. On 2,038 training
frames, player formation carries essentially no signal about where the ball is.
