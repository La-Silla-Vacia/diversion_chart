Source files for triple_a_inassa_y_su_sombra
=====

## Description

Please provide a short description of this project
![](https://raw.githubusercontent.com/la-silla-vacia/triple_a_inassa_y_su_sombra/master/screenshot.png)

## Data
Please link to any external data used, as well as scripts for cleaning and analyzing that data, all of which should live in the `/data` directory.

## Installation
First, make sure you have [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/en/) installed on your operating system.

After cloning the repository run inside the directory:
```
yarn install
```

To start watching the project and opening in the browser run:
```
yarn start
```

To deploy to GitHub Pages run:
```
yarn run deploy
```

---

## Embeding on LSV
To embed on a webpage use this code:
```html
<!-- START OF OUR INTERACTIVE -->
<script type="text/javascript">
window.triple_a_inassa_y_su_sombra_data = {
  "dataUri": "https://lsv-data-visualizations.firebaseio.com/fast-track.json"
}
</script>
<div class="lsv-interactive" id="triple_a_inassa_y_su_sombra">
<img src="https://la-silla-vacia.github.io/triple_a_inassa_y_su_sombra/screenshot.png" class="screenshot" style="width:100%;">
</div>
<script defer type="text/javascript" src="https://la-silla-vacia.github.io/triple_a_inassa_y_su_sombra/script.js"></script>
<!-- END OF OUR INTERACTIE -->
```