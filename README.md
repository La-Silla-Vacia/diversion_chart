Source files for diversion_chart
=====

## Description

Please provide a short description of this project
![](https://raw.githubusercontent.com/la-silla-vacia/diversion_chart/master/screenshot.png)

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
window.diversion_chart_data = {
  "dataUri": "https://lsv-data-visualizations.firebaseio.com/triple-a-inassa-y-su-sombra.json"
}
</script>
<div class="lsv-interactive" id="diversion_chart">
<img src="https://la-silla-vacia.github.io/diversion_chart/screenshot.png" class="screenshot" style="width:100%;">
</div>
<script defer type="text/javascript" src="https://la-silla-vacia.github.io/diversion_chart/script.js"></script>
<!-- END OF OUR INTERACTIE -->
```