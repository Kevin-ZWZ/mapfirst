# MapFirst · Map before you move

![MapFirst cover](assets/cover.svg)

English · [中文](README.md)

**A local-first decision canvas that turns vague thinking into testable actions.**

MapFirst helps you work through uncertain decisions with a simple loop: **map the options → run a small experiment → review evidence → update your next move**. It is useful for career choices, learning plans, creative work, and early product ideas.

**[Live demo](https://kevin-zwz.github.io/mapfirst/)** · **[Method guide (中文)](docs/method.md)**

## Try it

Open `index.html` directly in your browser. No install, account, build step, or API key is needed. The interface is currently in Chinese; an English UI is on the [roadmap](README.md#路线图).

1. Write a concrete, time-bounded decision.
2. List options and the information that could change your mind.
3. State your key hypothesis and design a seven-day experiment.
4. Record what happened and update your next step.

Your canvas is stored only in browser `localStorage`. You can export and import JSON. The project has no backend, analytics, or remote fonts.

## Why this exists

Collecting ideas often feels like progress without changing behavior. MapFirst turns a point of view into a falsifiable hypothesis, a small action, and a reviewable record. Its AI prompt asks for missing options, counterevidence, facts to verify, and a practical experiment. AI is a research assistant, not the final decision maker.

| Step | Question | Output |
| --- | --- | --- |
| Map | What options and unknowns matter? | Decision map |
| Experiment | What can I test cheaply this week? | Seven-day action |
| Review | What actually happened? | Evidence |
| Update | Continue, change, or stop? | Next move |

## Publish with GitHub Pages

Create a public repository with these files. In **Settings → Pages**, choose **Deploy from a branch**, `main`, and `/ (root)`. The static page needs no build configuration.

## Inspiration and limits

The project was inspired by [this long-form conversation between Alan Shao and Justin Sun](https://youtu.be/0Z-vhBvBmUY), especially its discussion of exploring before deciding, using AI to widen the information map, acting on what you learn, and updating your beliefs. MapFirst is an independent interpretation, not an official or endorsed project. It does not reproduce the video's transcript.

It is a thinking aid, not medical, legal, or financial advice. Check consequential facts with reliable primary sources and qualified professionals.

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md). Code and documentation are under the [MIT License](LICENSE).
